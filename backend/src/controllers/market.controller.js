const marketService = require('../services/marketService')
const logger = require('../utils/logger')
const asyncHandler = require('../utils/asyncHandler')

/**
 * Get real-time quote for a stock symbol
 * @route GET /api/market/quote/:symbol
 */
exports.getQuote = asyncHandler(async (req, res) => {
  const { symbol } = req.params

  if (!symbol) {
    return res.status(400).json({ error: 'Symbol is required' })
  }

  const quote = await marketService.getQuote(symbol.toUpperCase())

  if (!quote) {
    return res.status(404).json({ error: 'Symbol not found' })
  }

  res.json({ quote })
})

/**
 * Search for stock symbols
 * @route GET /api/market/search?q=query
 */
exports.searchSymbols = asyncHandler(async (req, res) => {
  const { q } = req.query

  if (!q || q.length < 1) {
    return res.status(400).json({ error: 'Search query is required' })
  }

  const results = await marketService.searchSymbols(q)

  res.json({ results })
})

/**
 * Get historical data for a symbol
 * @route GET /api/market/candles/:symbol
 */
exports.getCandles = asyncHandler(async (req, res) => {
  const { symbol } = req.params
  const { resolution = 'D', from, to } = req.query

  if (!symbol) {
    return res.status(400).json({ error: 'Symbol is required' })
  }

  if (!from || !to) {
    return res.status(400).json({ error: 'from and to timestamps are required' })
  }

  const candles = await marketService.getCandles(
    symbol.toUpperCase(),
    resolution,
    parseInt(from),
    parseInt(to)
  )

  res.json({ candles })
})

/**
 * Get market news
 * @route GET /api/market/news
 */
exports.getMarketNews = asyncHandler(async (req, res) => {
  const { category = 'general' } = req.query

  const news = await marketService.getMarketNews(category)

  res.json({ news })
})

/**
 * Get market movers (gainers/losers)
 * @route GET /api/market/movers
 */
exports.getMarketMovers = asyncHandler(async (req, res) => {
  const movers = await marketService.getMarketMovers()

  res.json({ movers })
})
