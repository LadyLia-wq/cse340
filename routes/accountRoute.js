const express = require("express")
const router = new express.Router()

const utilities = require("../utilities")
const accountController = require("../controllers/accountController")

// Account home route
router.get(
  "/", 
  utilities.handleErrors(accountController.buildAccount)
)

module.exports = router

router.get(
    "/login",
    utilities.handleErrors(accountController.buildLogin)
)

