const express = require("express");
const router = express.Router();
const invController = require("../controllers/invController");

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to display inventory item detail
router.get("/detail/:itemId", invController.showItemDetail);

module.exports = router;