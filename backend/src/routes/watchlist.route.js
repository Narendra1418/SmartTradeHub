const router = require('express').Router()
const auth = require('../middleware/authMiddleware')
const db = require('../db')

router.get('/', auth, async (req, res) => {
  const { rows } = await db.query(
    'SELECT symbol FROM watchlist_items WHERE user_id=$1',
    [req.user.id]
  )
  res.json(rows)
})

router.post('/', auth, async (req, res) => {
  await db.query(
    'INSERT INTO watchlist_items(user_id,symbol) VALUES($1,$2)',
    [req.user.id, req.body.symbol]
  )
  res.json({ status: 'added' })
})

module.exports = router
