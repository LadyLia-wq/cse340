// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities") // 

// Classification view
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
)

// Detail view
router.get(
  "/detail/:inv_id",
  utilities.handleErrors(invController.buildByInventoryId)
)

// 500 error route
router.get(
  "/trigger-error",
  utilities.handleErrors(invController.triggerError)
)

module.exports = router