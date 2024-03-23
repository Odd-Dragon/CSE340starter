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
    const classificationSelect = await utilities.buildClassificationList()
      res.render("./inventory/management", {
          title: "Management",
          nav,
          classificationSelect
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
      const nav = await utilities.getNav();
      const classificationSelect = await utilities.buildClassificationList()
      // Render the view with classification data
      res.render('inventory/add-inventory', { title: "Add Inventory", nav, errors: null, classificationSelect });
  } catch (error) {
      console.error('Error retrieving classifications:', error);
      res.status(500).send('Internal Server Error');
  }
};

// Handle form submission for adding inventory
invCont.addInventory = async (req, res) => {
  try {
    // Extract data from the request body
    const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body;

    // Check if any required field is missing
    if (!inv_make || !inv_model || !inv_year || !inv_price || !classification_id) {
      return res.status(400).send('Missing required fields');
    }

    // Save the data to the database using the model
    await invModel.addInventory(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id);

    // Redirect to a success page or the management view
    res.redirect('/inv');
  } catch (error) {
    console.error('Error adding inventory:', error);
    res.status(500).send('Failed to add inventory: ' + error.message);
  }
};

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id);
  let nav = await utilities.getNav();
  const itemData = await invModel.getInventoryByInvId(inv_id);
  const classificationSelect = await utilities.buildClassificationList();
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}

module.exports = invCont