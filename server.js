/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
console.log('1. Starting server initialization...')

const session = require("express-session")
console.log('2. Session module loaded')

const pool = require('./database/index')
console.log('3. Database pool loaded')

const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
console.log('4. Express and layouts loaded, env configured')

const app = express()
console.log('5. Express app created')

const static = require("./routes/static")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const utilities = require("./utilities/index")
console.log('6. Routes and controllers loaded')

const accountRoute = require("./routes/accountRoute")

/* ***********************
 * Middleware
 *************************/
console.log('7. Setting up session middleware...')

// Test database connection safely
if (pool && typeof pool.query === 'function') {
    pool.query('SELECT NOW()')
        .then(result => {
            console.log('✅ Database test query successful:', result.rows[0])
        })
        .catch(err => {
            console.error('❌ Database test query failed:', err.message)
            console.log('⚠️ Session store may not work properly without database connection')
        })
} else {
    console.error('❌ Database pool not properly initialized')
}

try {
    app.use(session({
        store: new (require('connect-pg-simple')(session))({
            createTableIfMissing: true,
            pool,
        }),
        secret: process.env.SESSION_SECRET,
        resave: true,
        saveUninitialized: true,
        name: 'sessionId',
    }))
    console.log('8. Session middleware configured')
} catch (error) {
    console.error('❌ Failed to configure session middleware:', error.message)
    process.exit(1)
}

// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function(req, res, next){
    res.locals.messages = require('express-messages')(req, res)
    next()
})
console.log('9. Flash messages middleware configured')

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")
console.log('10. View engine configured')

/* ***********************
 * Routes
 *************************/
app.use(static)
console.log('11. Static routes configured')

// TEMPORARY TEST ROUTE - Add this right after your middleware setup
app.get('/test', (req, res) => {
    console.log('🧪 Test route accessed')
    res.send('Test route is working!')
})

app.use("/account", accountRoute)

// Index route
app.get("/", utilities.handleErrors(baseController.buildHome))
console.log('12. Home route configured')

app.use("/inv", inventoryRoute)
console.log('13. Inventory route configured')

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
    next({status: 404, message: 'Sorry, we appear to have lost that page.'})
})
console.log('14. 404 handler configured')


/* ***********************
 * Express Error Handler
 * Place after all other middleware
 *************************/
app.use(async (err, req, res, next) => {
    let nav = await utilities.getNav()
    console.error(`Error at: "${req.originalUrl}": ${err.message}`)
    let message
    if(err.status == 404){
        message = err.message
    } else {
        message = 'Oh no! There was a crash. Maybe try a different route'
    }
    res.render("errors/error", {
        title: err.status || 'Server Error',
        message,
        nav
    })
})
console.log('15. Error handler configured')

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT || 3000
const host = process.env.HOST || "localhost"

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
    console.log(`✅ app listening on ${host}:${port}`)
})

console.log('16. Server startup complete - waiting for requests...')