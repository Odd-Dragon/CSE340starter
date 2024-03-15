const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
    errors: null,
  })
}

/* ***************************
 *  Build inventory item by inventory ID view
 * ************************** */

invCont.buildByInvID = async function (req, res, next) {
  try {
    const invId = req.params.invId;
    const vehicle = await invModel.getInventoryByInvId(invId);
    if (!vehicle) {
      return res.status(404).send("Vehicle not found");
    }
    
    // Retrieving navigation data and awaiting the promise
    const nav = await utilities.getNav();
    
    const vehicleHTML = utilities.formatVehicleHTML(vehicle);
    
    res.render("./inventory/vehicle_detail", {
      title: `${vehicle.inv_make} ${vehicle.inv_model}`,
      nav,
      vehicleHTML,
      errors: null,
    });
  } catch (error) {
    console.error("Error retrieving vehicle details: ", error);
    res.status(500).send("Internal Server Error");
  }
}

/* ***************************
 *  Render management view
 * ************************** */
invCont.renderManagementView = async function (req, res, next) {
  try {
    const nav = await utilities.getNav();
      res.render("./inventory/management", {
          title: "Management",
          nav,
      });
  } catch (error) {
      console.error("Error rendering management view: ", error);
      res.status(500).send("Internal Server Error");
  }
};

// Render add-classification view
invCont.renderAddClassificationView = async function(req, res, next) {
  const nav = await utilities.getNav();
  res.render("./inventory/add-classification", { title: "Add Classification", nav, errors: null});
};

// Handle form submission for adding a new classification
invCont.addNewClassification = async function(req, res) {
  const { classification_name } = req.body;

  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // If there are validation errors, render the form again with error messages
    const nav = await utilities.getNav();
    return res.render("./inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: errors.array(),
      classification_name
    });
  }

  try {
    // Insert the new classification into the database
    await invModel.addClassification(classification_name);
    // If successful, redirect to the management view
    req.flash("success", "Classification added successfully.");
    return res.redirect("/inv");
  } catch (error) {
    console.error("Error adding classification: ", error);
    req.flash("error", "Failed to add classification.");
    return res.redirect("/inv/add-classification");
  }
};

invCont.addInventoryView = async (req, res) => {
  try {
      // Retrieve classification data
      const classifications = await invModel.getClassifications();
      const nav = await utilities.getNav();
      // Render the view with classification data
      res.render('inventory/add-inventory', { title: "Add Inventory", nav, errors: null, classifications: classifications.rows });
  } catch (error) {
      console.error('Error retrieving classifications:', error);
      res.status(500).send('Internal Server Error');
  }
};

invCont.addInventory = async (req, res) => {
  try {
      // Extract data from the request body
      const { make, model, year, price, classification_id, imagePath, thumbnailPath } = req.body;
      if (!make || !model || !year || !price || !classification_id) {
          return res.status(400).send('Missing required fields');
      }

      // Save the data to the database using the model
      const result = await invModel.addInventory(make, model, year, price, classification_id, imagePath, thumbnailPath);
      
      // Redirect to management view if successful
      res.redirect('/management');
  } catch (error) {
    console.error('Error adding inventory:', error);
    res.status(500).send('Failed to add inventory: ' + error.message);
  }
};


module.exports = invCont