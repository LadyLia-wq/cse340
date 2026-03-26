// server-minimal.js - with database
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const pool = require('./database/index')

console.log('🚀 Starting server with database...')

// Simple logging middleware
app.use((req, res, next) => {
    console.log(`📝 ${new Date().toISOString()} - ${req.method} ${req.url}`)
    next()
})

// Test database route
app.get("/db-test", async (req, res) => {
    try {
        console.log('Testing database...')
        const result = await pool.query('SELECT NOW()')
        res.json({ 
            success: true, 
            time: result.rows[0],
            message: 'Database connection working!'
        })
    } catch (error) {
        console.error('Database error:', error.message)
        res.status(500).json({ 
            success: false, 
            error: error.message 
        })
    }
})

// View Engine
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")

// Simple home route
app.get("/", (req, res) => {
    console.log('🏠 Home route accessed')
    res.send('<h1>Home Page Working!</h1><p>Database is available at /db-test</p>')
})

app.get("/test", (req, res) => {
    console.log('🧪 Test route accessed')
    res.send('Test route is working!')
})

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`✅ Server listening on http://localhost:${port}`)
    console.log(`Test database: http://localhost:${port}/db-test`)
})