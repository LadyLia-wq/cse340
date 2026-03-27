console.log("1. Starting server initialization...")

const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const session = require("express-session")
const flash = require("connect-flash")
const pgSession = require("connect-pg-simple")(session)
require("dotenv").config()

const pool = require("./database/index")
const utilities = require("./utilities/index")
const static = require("./routes/static")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const accountRoute = require("./routes/accountRoute")

console.log("2. Modules loaded")

const app = express()
console.log("3. Express app created")

/* *******************************
 * Middleware
 *******************************/
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(
    session({
        store: new pgSession({
            pool,
            createTableIfMissing: true,
        }),
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        name: "sessionId",
    })
)
console.log("4. Session middleware configured")

app.use(flash())
app.use(function (req, res, next) {
    res.locals.messages = require("express-messages")(req, res)
    next()
})
console.log("5. Flash messages middleware configured")

/* *******************************
 * View Engine
 *******************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")
console.log("6. View engine configured")

/* *******************************
 * Routes
 *******************************/
app.use(static)
console.log("7. Static routes configured")

// Temporary test route
app.get("/test", (req, res) => {
    console.log("🧪 Test route accessed")
    res.send("Test route is working!")
})

app.use("/account", accountRoute)
app.get("/", utilities.handleErrors(baseController.buildHome))
app.use("/inv", inventoryRoute)
console.log("8. Application routes configured")

// 404 handler (must be last)
app.use(async (req, res, next) => {
    next({ status: 404, message: "Sorry, we appear to have lost that page." })
})
console.log("9. 404 handler configured")

// Express error handler
app.use(async (err, req, res, next) => {
    let nav = await utilities.getNav()
    console.error(`Error at: "${req.originalUrl}": ${err.message}`)
    let message = err.status === 404
        ? err.message
        : "Oh no! There was a crash. Maybe try a different route"

    res.status(err.status || 500).render("errors/error", {
        title: err.status || "Server Error",
        message,
        nav,
    })
})
console.log("10. Error handler configured")

/* *******************************
 * Start Server
 *******************************/
const port = process.env.PORT || 3000
const host = process.env.HOST || "localhost"

app.listen(port, () => {
    console.log(`✅ App listening on ${host}:${port}`)
})
console.log("11. Server startup complete - waiting for requests...")