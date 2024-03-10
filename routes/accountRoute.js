// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')

// Route to login
router.get("/login", accountController.buildLogin);
router.get("/register", accountController.buildRegister);
router.post(
    "/register", 
    regValidate.registationRules(),
    regValidate.checkRegData,
    accountController.registerAccount);
router.post(
        "/login",
        regValidate.loginRules(),
        regValidate.checkLoginData,
        (req, res) => {
          res.status(200).send('login process')
        }
      )

module.exports = router;