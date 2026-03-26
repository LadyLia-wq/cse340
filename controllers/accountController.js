const utilities = require("../utilities")
const accountController = {}

// Deliver login view
async function buildLogin(req, res, next){
    let nav = await utilities.getNav()
    res.render("account/login", {
        title: "Login",
        nav,
    })
}

module.exports = { buildLogin }

// Build account view
accountController.buildAccount = async function (req, res) {
  const nav = await utilities.getNav()
  res.render("account/index", {
    title: "My Account",
    nav,
  })
}

// Build login view
accountController.buildLogin = async function (req, res) {
    const nav = await utilities.getNav()
    res.render("account/login", {
        title: "login",
        nav,
    })
}
module.exports = accountController

