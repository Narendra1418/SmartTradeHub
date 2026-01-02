const db = require('../db')
const logger = require('../utils/logger')
const asyncHandler = require('../utils/asyncHandler')
const marketService = require('../services/marketService')

/**
 * Get user's portfolio
 * @route GET /api/portfolio
 */
exports.getPortfolio = asyncHandler(async (req, res) => {
  const userId = req.user.id

  const result = await db.query(
    `SELECT id, symbol, quantity, purchase_price, purchase_date, created_at
     FROM portfolio WHERE user_id = $1 ORDER BY created_at DESC`,
    [userId]
  )

  // Fetch current prices for each holding
  const portfolioWithPrices = await Promise.all(
    result.rows.map(async (holding) => {
      try {
        const quote = await marketService.getQuote(holding.symbol)
        const currentValue = holding.quantity * quote.current
        const investedValue = holding.quantity * parseFloat(holding.purchase_price)
        const profitLoss = currentValue - investedValue
        const profitLossPercent = (profitLoss / investedValue) * 100

        return {
          ...holding,
          currentPrice: quote.current,
          currentValue,
          investedValue,
          profitLoss,
          profitLossPercent: profitLossPercent.toFixed(2)
        }
      } catch (error) {
        logger.error(`Error fetching price for ${holding.symbol}:`, error.message)
        return {
          ...holding,
          currentPrice: null,
          currentValue: null,
          investedValue: holding.quantity * parseFloat(holding.purchase_price),
          profitLoss: null,
          profitLossPercent: null
        }
      }
    })
  )

  // Calculate total portfolio value
  const totalInvested = portfolioWithPrices.reduce((sum, h) => sum + h.investedValue, 0)
  const totalCurrent = portfolioWithPrices.reduce((sum, h) => sum + (h.currentValue || 0), 0)
  const totalProfitLoss = totalCurrent - totalInvested
  const totalProfitLossPercent = totalInvested > 0 ? (totalProfitLoss / totalInvested) * 100 : 0

  res.json({
    holdings: portfolioWithPrices,
    summary: {
      totalInvested,
      totalCurrent,
      totalProfitLoss,
      totalProfitLossPercent: totalProfitLossPercent.toFixed(2)
    }
  })
})

/**
 * Add holding to portfolio
 * @route POST /api/portfolio
 */
exports.addHolding = asyncHandler(async (req, res) => {
  const userId = req.user.id
  const { symbol, quantity, purchasePrice, purchaseDate } = req.body

  // Verify symbol exists
  try {
    await marketService.getQuote(symbol.toUpperCase())
  } catch (error) {
    return res.status(400).json({ error: 'Invalid stock symbol' })
  }

  const result = await db.query(
    `INSERT INTO portfolio (user_id, symbol, quantity, purchase_price, purchase_date)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, symbol, quantity, purchase_price, purchase_date, created_at`,
    [userId, symbol.toUpperCase(), quantity, purchasePrice, purchaseDate || new Date()]
  )

  logger.info(`User ${userId} added holding: ${symbol}`)

  res.status(201).json({
    message: 'Holding added successfully',
    holding: result.rows[0]
  })
})

/**
 * Update holding in portfolio
 * @route PUT /api/portfolio/:id
 */
exports.updateHolding = asyncHandler(async (req, res) => {
  const userId = req.user.id
  const { id } = req.params
  const { quantity, purchasePrice, purchaseDate } = req.body

  const result = await db.query(
    `UPDATE portfolio 
     SET quantity = $1, purchase_price = $2, purchase_date = $3
     WHERE id = $4 AND user_id = $5
     RETURNING id, symbol, quantity, purchase_price, purchase_date`,
    [quantity, purchasePrice, purchaseDate, id, userId]
  )

  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Holding not found' })
  }

  logger.info(`User ${userId} updated holding: ${id}`)

  res.json({
    message: 'Holding updated successfully',
    holding: result.rows[0]
  })
})

/**
 * Delete holding from portfolio
 * @route DELETE /api/portfolio/:id
 */
exports.deleteHolding = asyncHandler(async (req, res) => {
  const userId = req.user.id
  const { id } = req.params

  const result = await db.query(
    'DELETE FROM portfolio WHERE id = $1 AND user_id = $2 RETURNING id',
    [id, userId]
  )

  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Holding not found' })
  }

  logger.info(`User ${userId} deleted holding: ${id}`)

  res.json({ message: 'Holding deleted successfully' })
})

// Legacy methods for backward compatibility
exports.createTrade = asyncHandler(async (req, res) => {
  const { portfolioId, symbol, action, quantity, price } = req.body

  await db.query(
    `INSERT INTO transactions(user_id,portfolio_id,symbol,action,quantity,price)
     VALUES($1,$2,$3,$4,$5,$6)`,
    [req.user.id, portfolioId, symbol, action, quantity, price]
  )

  if (action === 'BUY') {
    await db.query(
      `INSERT INTO holdings(portfolio_id,symbol,quantity,avg_price)
       VALUES($1,$2,$3,$4)
       ON CONFLICT (portfolio_id,symbol)
       DO UPDATE SET
         quantity = holdings.quantity + $3,
         avg_price = ((holdings.avg_price * holdings.quantity) + ($4 * $3))
                      / (holdings.quantity + $3)`,
      [portfolioId, symbol, quantity, price]
    )
  }

  if (action === 'SELL') {
    await db.query(
      `UPDATE holdings
       SET quantity = quantity - $1
       WHERE portfolio_id=$2 AND symbol=$3`,
      [quantity, portfolioId, symbol]
    )
  }

  res.json({ status: 'executed' })
})
