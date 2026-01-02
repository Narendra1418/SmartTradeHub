const router = require('express').Router()
const auth = require('../middleware/authMiddleware')
const { getPortfolio, createTrade } = require('../controllers/portfolioController')

router.get('/', auth, getPortfolio)
router.post('/trade', auth, createTrade)
router.get('/pnl', auth, async (req, res) => {
     const { rows } = await db.query(
    `SELECT symbol, quantity, avg_price FROM holdings
     WHERE portfolio_id IN (
       SELECT id FROM portfolios WHERE user_id=$1
     )`,
    [req.user.id]
  )
  res.json(rows)
})


module.exports = router
