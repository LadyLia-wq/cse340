const { Pool } = require("pg")
require("dotenv").config()

let pool

try {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === "development" ? { rejectUnauthorized: false } : true,
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 10000, // increased from 2000
    })

    // Optional: query logging wrapper
    const originalQuery = pool.query.bind(pool)
    pool.query = async (text, params) => {
        const start = Date.now()
        try {
            const res = await originalQuery(text, params)
            const duration = Date.now() - start
            console.log("executed query", {
                text: text.substring(0, 100),
                duration,
                rows: res?.rowCount || 0,
            })
            return res
        } catch (error) {
            console.error("error in query", {
                text: text.substring(0, 100),
                error: error.message,
            })
            throw error
        }
    }
} catch (error) {
    console.error("Failed to create database pool:", error.message)
    process.exit(1)
}

module.exports = pool