const express = require("express")
const router = new express.Router()

const utilities = require("../utilities")
const accountController = require("../controllers/accountController")

// Account home route
router.get(
  "/", 
  utilities.handleErrors(accountController.buildAccount)
)

router.get(
    "/login",
    utilities.handleErrors(accountController.buildLogin)
)

module.exports = router
