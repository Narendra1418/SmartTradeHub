const db = require('../db')
const logger = require('../utils/logger')
const asyncHandler = require('../utils/asyncHandler')
const marketService = require('../services/marketService')

/**
 * Get user's watchlist
 * @route GET /api/watchlist
 */
exports.getWatchlist = asyncHandler(async (req, res) => {
  const userId = req.user.id

  const result = await db.query(
    `SELECT id, symbol, target_price, notes, created_at
     FROM watchlist WHERE user_id = $1 ORDER BY created_at DESC`,
    [userId]
  )

  // Fetch current prices for each symbol
  const watchlistWithPrices = await Promise.all(
    result.rows.map(async (item) => {
      try {
        const quote = await marketService.getQuote(item.symbol)
        return {
          ...item,
          currentPrice: quote.current,
          change: quote.change,
          percentChange: quote.percentChange,
          targetReached: item.target_price && quote.current >= parseFloat(item.target_price)
        }
      } catch (error) {
        logger.error(`Error fetching price for ${item.symbol}:`, error.message)
        return {
          ...item,
          currentPrice: null,
          change: null,
          percentChange: null,
          targetReached: false
        }
      }
    })
  )

  res.json({ watchlist: watchlistWithPrices })
})

/**
 * Add symbol to watchlist
 * @route POST /api/watchlist
 */
exports.addToWatchlist = asyncHandler(async (req, res) => {
  const userId = req.user.id
  const { symbol, targetPrice, notes } = req.body

  // Verify symbol exists
  try {
    await marketService.getQuote(symbol.toUpperCase())
  } catch (error) {
    return res.status(400).json({ error: 'Invalid stock symbol' })
  }

  // Check if already in watchlist
  const existing = await db.query(
    'SELECT id FROM watchlist WHERE user_id = $1 AND symbol = $2',
    [userId, symbol.toUpperCase()]
  )

  if (existing.rows.length > 0) {
    return res.status(409).json({ error: 'Symbol already in watchlist' })
  }

  const result = await db.query(
    `INSERT INTO watchlist (user_id, symbol, target_price, notes)
     VALUES ($1, $2, $3, $4)
     RETURNING id, symbol, target_price, notes, created_at`,
    [userId, symbol.toUpperCase(), targetPrice, notes]
  )

  logger.info(`User ${userId} added to watchlist: ${symbol}`)

  res.status(201).json({
    message: 'Added to watchlist successfully',
    item: result.rows[0]
  })
})

/**
 * Update watchlist item
 * @route PUT /api/watchlist/:id
 */
exports.updateWatchlistItem = asyncHandler(async (req, res) => {
  const userId = req.user.id
  const { id } = req.params
  const { targetPrice, notes } = req.body

  const result = await db.query(
    `UPDATE watchlist 
     SET target_price = $1, notes = $2
     WHERE id = $3 AND user_id = $4
     RETURNING id, symbol, target_price, notes`,
    [targetPrice, notes, id, userId]
  )

  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Watchlist item not found' })
  }

  logger.info(`User ${userId} updated watchlist item: ${id}`)

  res.json({
    message: 'Watchlist item updated successfully',
    item: result.rows[0]
  })
})

/**
 * Remove symbol from watchlist
 * @route DELETE /api/watchlist/:id
 */
exports.deleteFromWatchlist = asyncHandler(async (req, res) => {
  const userId = req.user.id
  const { id } = req.params

  const result = await db.query(
    'DELETE FROM watchlist WHERE id = $1 AND user_id = $2 RETURNING id',
    [id, userId]
  )

  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Watchlist item not found' })
  }

  logger.info(`User ${userId} removed from watchlist: ${id}`)

  res.json({ message: 'Removed from watchlist successfully' })
})
