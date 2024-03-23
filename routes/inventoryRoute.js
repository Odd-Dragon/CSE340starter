// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const manValidate = require('../utilities/management-validation')
const utilities = require("../utilities/")

//Routes
router.get("/", utilities.handleErrors(invController.renderManagementView));
router.get("/add-classification", utilities.handleErrors(invController.renderAddClassificationView));
router.post("/add-classification", manValidate.classRules(), manValidate.checkClassData, utilities.handleErrors(invController.addNewClassification));
router.get('/add-inventory', utilities.handleErrors(invController.addInventoryView));
router.post('/add', manValidate.invRules(), manValidate.checkInvData, utilities.handleErrors(invController.addInventory));
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInvID));
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON));
router.get("/edit/:invID", utilities.handleErrors(invController.editInventoryView))

module.exports = router;
