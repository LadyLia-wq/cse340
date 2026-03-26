const { Client } = require("pg")

// Use the exact URL format from Render
const connectionString = "postgresql://cse340aa_28y6_user:8s2HJUquFfYoblg8JP07tnX7SzN4GEUG@dpg-d6sqd9paae7s73dh0hkg-a.singapore-postgres.render.com:5432/cse340aa_28y6"

console.log('Testing connection with full URL...')
console.log('URL (password hidden):', connectionString.replace(/:[^:]*@/, ':****@'))

const client = new Client({
    connectionString: connectionString,
    ssl: {
        rejectUnauthorized: false,
    },
    connectionTimeoutMillis: 15000,
})

// Add detailed event logging
client.on('connect', () => console.log('🔌 Socket connected'))
client.on('error', (err) => console.log('⚠️ Client error:', err.message))
client.on('end', () => console.log('🔌 Connection ended'))

console.log('Attempting to connect...')

client.connect()
    .then(() => {
        console.log('✅ Connected to PostgreSQL!')
        return client.query('SELECT version()')
    })
    .then(result => {
        console.log('✅ Query successful!')
        console.log('PostgreSQL version:', result.rows[0].version)
        client.end()
    })
    .catch(err => {
        console.error('❌ Connection failed:', err.message)
        console.error('\nFull error details:')
        console.error(err)
        client.end()
    })