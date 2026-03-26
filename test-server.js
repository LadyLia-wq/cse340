// test-server.js - Minimal test server
const express = require('express')
const app = express()

console.log('🚀 Starting minimal test server...')

// Simple middleware to log requests
app.use((req, res, next) => {
    console.log(`📝 ${new Date().toISOString()} - ${req.method} ${req.url}`)
    next()
})

// Simple home route
app.get('/', (req, res) => {
    console.log('🏠 Home route accessed')
    res.send('Hello! The server is working!')
})

// Test route
app.get('/test', (req, res) => {
    console.log('🧪 Test route accessed')
    res.send('Test route is working!')
})

const port = 3000
app.listen(port, () => {
    console.log(`✅ Test server listening on http://localhost:${port}`)
    console.log(`Try accessing: http://localhost:${port}/test`)
})