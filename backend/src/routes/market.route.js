const express = require('express')
const router = express.Router()
const marketService = require('../services/marketService')


router.get('/quote', async (req, res) => {
try {
const { symbol } = req.query
if (!symbol) return res.status(400).json({ error: 'symbol required' })
const q = await marketService.getQuote(symbol)
res.json(q)
} catch (err) {
console.error(err)
res.status(500).json({ error: 'internal_error' })
}
})
module.exports = router