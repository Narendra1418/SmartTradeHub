const axios = require('axios')
const logger = require('../utils/logger')

// Cache configuration
const cache = new Map()
const CACHE_TTL = 60000 // 1 minute

/**
 * Get cached data or fetch new data
 */
function getCached(key, ttl = CACHE_TTL) {
  const cached = cache.get(key)
  if (cached && Date.now() - cached.timestamp < ttl) {
    return cached.data
  }
  return null
}

function setCache(key, data) {
  cache.set(key, { data, timestamp: Date.now() })
}

/**
 * Get real-time quote for a stock symbol
 */
async function getQuote(symbol) {
  try {
    const cacheKey = `quote:${symbol}`
    const cached = getCached(cacheKey, 30000) // 30 seconds cache
    if (cached) return cached

    const token = process.env.FINNHUB_KEY
    if (!token) {
      throw new Error('FINNHUB_KEY not configured')
    }

    const url = `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(symbol)}&token=${token}`
    const response = await axios.get(url, { timeout: 10000 })

    const quote = {
      symbol,
      current: response.data.c,
      change: response.data.d,
      percentChange: response.data.dp,
      open: response.data.o,
      high: response.data.h,
      low: response.data.l,
      prevClose: response.data.pc,
      timestamp: response.data.t
    }

    setCache(cacheKey, quote)
    return quote
  } catch (error) {
    logger.error(`Error fetching quote for ${symbol}:`, error.message)
    throw new Error(`Failed to fetch quote: ${error.message}`)
  }
}

/**
 * Search for stock symbols
 */
async function searchSymbols(query) {
  try {
    const cacheKey = `search:${query}`
    const cached = getCached(cacheKey)
    if (cached) return cached

    const token = process.env.FINNHUB_KEY
    const url = `https://finnhub.io/api/v1/search?q=${encodeURIComponent(query)}&token=${token}`
    const response = await axios.get(url, { timeout: 10000 })

    const results = response.data.result || []
    setCache(cacheKey, results)
    return results
  } catch (error) {
    logger.error(`Error searching symbols for ${query}:`, error.message)
    throw new Error(`Failed to search symbols: ${error.message}`)
  }
}

/**
 * Get historical candle data
 */
async function getCandles(symbol, resolution, from, to) {
  try {
    const token = process.env.FINNHUB_KEY
    const url = `https://finnhub.io/api/v1/stock/candle?symbol=${encodeURIComponent(symbol)}&resolution=${resolution}&from=${from}&to=${to}&token=${token}`
    const response = await axios.get(url, { timeout: 15000 })

    if (response.data.s === 'no_data') {
      return { status: 'no_data', data: [] }
    }

    return {
      status: response.data.s,
      timestamps: response.data.t,
      close: response.data.c,
      open: response.data.o,
      high: response.data.h,
      low: response.data.l,
      volume: response.data.v
    }
  } catch (error) {
    logger.error(`Error fetching candles for ${symbol}:`, error.message)
    throw new Error(`Failed to fetch candles: ${error.message}`)
  }
}

/**
 * Get market news
 */
async function getMarketNews(category = 'general') {
  try {
    const cacheKey = `news:${category}`
    const cached = getCached(cacheKey, 300000) // 5 minutes cache
    if (cached) return cached

    const token = process.env.FINNHUB_KEY
    const url = `https://finnhub.io/api/v1/news?category=${category}&token=${token}`
    const response = await axios.get(url, { timeout: 10000 })

    const news = response.data.slice(0, 20) // Limit to 20 articles
    setCache(cacheKey, news)
    return news
  } catch (error) {
    logger.error(`Error fetching market news:`, error.message)
    throw new Error(`Failed to fetch news: ${error.message}`)
  }
}

/**
 * Get market movers (top gainers/losers)
 */
async function getMarketMovers() {
  try {
    const cacheKey = 'movers'
    const cached = getCached(cacheKey, 300000) // 5 minutes cache
    if (cached) return cached

    // Placeholder - implement with real API
    const movers = {
      gainers: [],
      losers: []
    }

    setCache(cacheKey, movers)
    return movers
  } catch (error) {
    logger.error(`Error fetching market movers:`, error.message)
    throw new Error(`Failed to fetch movers: ${error.message}`)
  }
}

module.exports = {
  getQuote,
  searchSymbols,
  getCandles,
  getMarketNews,
  getMarketMovers
}
