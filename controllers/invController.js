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
  })
}

invCont.showItemDetail = async function (req, res, next) {
  try {
    const itemId = req.params.itemId;
    const item = await invModel.getInventoryItemById(itemId); // Function to retrieve inventory item by ID from the model
    if (!item) {
      throw new Error("Inventory item not found");
    }
    const formattedItem = utilities.formatItemForDetailView(item); // Custom function to format item for display
    res.render("./inventory/detail", {
      title: `${item.inv_make} ${item.inv_model}`,
      item: formattedItem,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = invCont