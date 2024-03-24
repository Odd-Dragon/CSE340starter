const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()


/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  }
  
  /* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  );

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you're registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors:null,
    })
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  const accountData = await accountModel.getAccountByEmail(account_email);

  if (!accountData) {
      req.flash("notice", "Please check your credentials and try again.");
      return res.status(400).render("account/login", {
          title: "Login",
          nav,
          errors: null,
          account_email,
      });
  }

  try {
      if (await bcrypt.compare(account_password, accountData.account_password)) {
          delete accountData.account_password;

          // Include accountType and accountId along with existing data in the JWT payload
          const payload = {
              ...accountData, // Spread existing data
              accountType: accountData.accountType,
              accountId: accountData.accountId
          };

          const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 });
          if (process.env.NODE_ENV === 'development') {
              res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
          } else {
              res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 });
          }
          return res.redirect("/account/");
      } else {
          // Passwords don't match
          req.flash("notice", "Invalid email or password.");
          return res.status(400).render("account/login", {
              title: "Login",
              nav,
              errors: null,
              account_email,
          });
      }
  } catch (error) {
      console.error("Error:", error.message);
      return res.status(500).send("Internal Server Error");
  }
}
 async function  showAccountView(req, res) {
      let nav = await utilities.getNav()
      const token = req.cookies.jwt;
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const accountType = decodedToken.accountType;
      const account_firstname = decodedToken.account_firstname;
      const accountId = decodedToken.accountId;
      res.render('account/accountView', {
      title: "Account",
      nav,
      errors: null,
      accountType: accountType,
      account_firstname: account_firstname,
      accountId: accountId});
  }

  async function renderUpdateForm(req, res) {
    try {
      const token = req.cookies.jwt;
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const { accountId, account_firstname, account_lastname, account_email } = decodedToken;
      let nav = await utilities.getNav();
        // Render the account update form view
        res.render('account/update', {
            title: 'Account Update Form',
            nav,
            account_firstname: account_firstname,
            account_lastname: account_lastname,
            account_email: account_email,
            accountId: accountId,
            errors: null
        });
    } catch (error) {
        console.error('Error rendering account update form:', error);
        res.status(500).send('Internal Server Error');
    }
}

async function renderChangePasswordForm(req, res) {
    try {
      const token = req.cookies.jwt;
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const accountId = decodedToken.accountId;
      let nav = await utilities.getNav();
        // Render the change password form view
        res.render('account/change-password', {
            title: 'Change Password',
            nav,
            accountId: accountId,
            errors: null
        });
    } catch (error) {
        console.error('Error rendering change password form:', error);
        res.status(500).send('Internal Server Error');
    }
}

module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, showAccountView, renderUpdateForm, renderChangePasswordForm }