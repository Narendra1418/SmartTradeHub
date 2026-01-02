export default async function handler(req, res) {
  const { symbol } = req.query
  const r = await fetch(`http://localhost:4000/api/market/quote?symbol=${symbol}`)
  const data = await r.json()
  res.status(200).json(data)
}
