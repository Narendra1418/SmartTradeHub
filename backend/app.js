const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const marketRoutes = require('./src/routes/market.route')
const authRoutes = require('./src/routes/auth.route')
const portfolioRoutes = require('./src/routes/portfolio.route')
const watchlistRoutes = require('./src/routes/watchlist.route')

const app = express()

// Security middleware
app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}))

// Logging middleware
app.use(morgan('combined'))

// Body parser middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/portfolio', portfolioRoutes)
app.use('/api/watchlist', watchlistRoutes)
app.use('/api/market', marketRoutes)

// Health check endpoint
app.get('/health', (req, res) => res.json({ 
  status: 'ok', 
  timestamp: new Date().toISOString(),
  uptime: process.uptime()
}))

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err)
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
})

module.exports = app