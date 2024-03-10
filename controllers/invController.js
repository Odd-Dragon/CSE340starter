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

module.exports = invCont