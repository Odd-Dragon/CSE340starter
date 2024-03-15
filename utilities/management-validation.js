const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}
const invModel = require("../models/inventory-model")

/*  **********************************
 *  Add-classification Data Validation Rules
 * ********************************* */
validate.classRules = () => {
    return [
      // classification_name is required and must be string
      body("classification_name")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide a classification name.") // on error this message is sent.
        .matches(/^[a-zA-Z0-9]+$/)
        .withMessage("Classification name should contain only letters and numbers, no spaces or special characters.")
  
    ]
  }

  /* ******************************
 * Check data and return errors or continue to creation
 * ***************************** */
  validate.checkClassData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("inventory/add-classification", {
        errors,
        title: "Add Classification",
        nav,
        classification_name,
      })
      return
    }
    next()
  }

  validate.invRules = () => {
    return [
      body("inv_make")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide the make of the vehicle."),
      body("inv_model")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide the model of the vehicle."),
      body("inv_year")
        .trim()
        .isInt({ min: 1900, max: new Date().getFullYear() })
        .withMessage("Please provide a valid year."),
      body("inv_description")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide a description of the vehicle."),
      body("inv_image")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide the path to the vehicle image."),
      body("inv_thumbnail")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide the path to the vehicle thumbnail."),
      body("inv_price")
        .trim()
        .isNumeric()
        .withMessage("Please provide a valid price."),
      body("inv_miles")
        .trim()
        .isNumeric()
        .withMessage("Please provide the number of miles."),
      body("inv_color")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide the color of the vehicle."),
      body("classification_id")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please choose a classification.")
        .custom(async (value) => {
          const classification = await invModel.getClassificationById(value);
          if (!classification) {
            return Promise.reject("Invalid classification.");
          }
        }),
    ];
  };
  
  validate.checkInvData = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const nav = await utilities.getNav();
      const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color } = req.body;
      
      // Extract error messages
      const errorMessages = errors.array().map(error => error.msg);
  
      res.render("inventory/add-inventory", {
        title: "New Inventory",
        errors: errorMessages,
        locals: {
          inv_make,
          inv_model,
          inv_year,
          inv_description,
          inv_image,
          inv_thumbnail,
          inv_price,
          inv_miles,
          inv_color
        },
        classifications: classifications
      });
      return;
    }
    next();
  };

  
  module.exports = validate