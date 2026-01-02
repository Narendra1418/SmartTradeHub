const { Pool } = require('pg')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'smarttradehub',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

// Log pool events
pool.on('connect', () => {
  console.log('Database connection established')
})

pool.on('error', (err) => {
  console.error('Unexpected database error:', err)
  process.exit(-1)
})

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
}

