// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const manValidate = require('../utilities/management-validation')
const accValidate = require("../utilities/account-validation")
const utilities = require("../utilities/")

//Routes
router.get("/", utilities.handleErrors(invController.renderManagementView));
router.get("/add-classification", accValidate.checkAuthAndAccountType, utilities.handleErrors(invController.renderAddClassificationView));
router.post("/add-classification", accValidate.checkAuthAndAccountType, manValidate.classRules(), manValidate.checkClassData, utilities.handleErrors(invController.addNewClassification));
router.get('/add-inventory', accValidate.checkAuthAndAccountType, utilities.handleErrors(invController.addInventoryView));
router.post('/add-inventory', accValidate.checkAuthAndAccountType, manValidate.invRules(), manValidate.checkInvData, utilities.handleErrors(invController.addInventory));
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInvID));
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON));
router.get("/edit/:inv_id", accValidate.checkAuthAndAccountType, utilities.handleErrors(invController.editInventoryView))
router.post("/update/", accValidate.checkAuthAndAccountType, manValidate.invRules(), manValidate.checkUpdateData, utilities.handleErrors(invController.updateInventory))
router.get("/delete/:inv_id", accValidate.checkAuthAndAccountType, utilities.handleErrors(invController.deleteInventoryView))
router.post("/delete", accValidate.checkAuthAndAccountType, utilities.handleErrors(invController.deleteInventory))

module.exports = router;
