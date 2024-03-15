// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const manValidate = require('../utilities/management-validation')

//Routes
router.get("/", invController.renderManagementView);
router.get("/add-classification", invController.renderAddClassificationView);
router.post("/add-classification", manValidate.classRules(), manValidate.checkClassData, invController.addNewClassification);
router.get('/add-inventory', invController.addInventoryView);
router.post('/add', manValidate.invRules(), manValidate.checkInvData, invController.addInventory);
router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/detail/:invId", invController.buildByInvID);


module.exports = router;
