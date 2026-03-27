const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ****************************************
* Build inventory by classification view
* ****************************************/
invCont.buildByClassificationId = async function (req, res, next) {

    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)

    console.log("CLASS DATA:", data) 

    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    
    res.render("inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
    })
}

/* ****************************************
* Build inventory detail view
* ****************************************/
invCont.buildByInventoryId = async function (req, res, next) {

    const inv_id = parseInt(req.params.inv_id)

    const data = await invModel.getInventoryById(inv_id)

    console.log("DETAIL DATA:", data) 

    if (!data) {
        return res.status(404).render("errors/error", {
            title: "Vehicle Not Found",
            message: "Sorry, no vehicle found."
        })
    }

    const nav = await utilities.getNav()

    const detailHTML = utilities.buildVehicleDetail(data)

    res.render("inventory/detail", {
        title: `${data.inv_make} ${data.inv_model}`,
        nav,
        detailHTML
    })
}


/* ****************************************
* Trigger intentional error
* ****************************************/
invCont.triggerError = function (req, res, next) {
    throw new Error("Intentional Server Error")
}

module.exports = invCont