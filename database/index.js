const { Pool } = require("pg")
require("dotenv").config()

/* ************************
* Connection Pool
* SSL Object needed for local testing of app
* But will cause problems in productive environment
* If - else will make determination which to use
* *************************/
let pool

try {
    if (process.env.NODE_ENV == "development") {
        pool = new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: {
                rejectUnauthorized: false,
            },
        })

        // Wrap the query method for logging
        const originalQuery = pool.query.bind(pool)
        pool.query = async (text, params) => {
            try {
                const start = Date.now()
                const res = await originalQuery(text, params)
                const duration = Date.now() - start
                console.log("executed query", { 
                    text: text.substring(0, 100), // Log only first 100 chars
                    duration, 
                    rows: res?.rowCount || 0 
                })
                return res
            } catch (error) {
                console.error("error in query", { 
                    text: text.substring(0, 100), 
                    error: error.message 
                })
                throw error
            }
        }
    } else {
        pool = new Pool({
            connectionString: process.env.DATABASE_URL,
        })
    }
} catch (error) {
    console.error('Failed to create database pool:', error.message)
    process.exit(1)
}

// Test the connection
if (pool) {
    pool.connect((err, client, release) => {
        if (err) {
            console.error('⚠️ Database connection warning:', err.message)
            console.log('Server will continue but database features may not work')
        } else {
            console.log('✅ Database connected successfully')
            release()
        }
    })
}

module.exports = pool