const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const db = require('../db')
const logger = require('../utils/logger')
const asyncHandler = require('../utils/asyncHandler')

/**
 * Register a new user
 * @route POST /api/auth/signup
 */
exports.signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  // Check if user already exists
  const existingUser = await db.query(
    'SELECT id FROM users WHERE email = $1',
    [email]
  )

  if (existingUser.rows.length > 0) {
    return res.status(409).json({ error: 'User already exists' })
  }

  // Hash password
  const hash = await bcrypt.hash(password, 12)

  // Create user
  const user = await db.query(
    'INSERT INTO users(name, email, password_hash, created_at) VALUES($1, $2, $3, NOW()) RETURNING id, name, email, created_at',
    [name, email, hash]
  )

  const userId = user.rows[0].id

  // Generate JWT token
  const token = jwt.sign(
    { id: userId, email: user.rows[0].email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )

  logger.info(`New user registered: ${email}`)

  res.status(201).json({
    message: 'User registered successfully',
    token,
    user: {
      id: userId,
      name: user.rows[0].name,
      email: user.rows[0].email
    }
  })
})

/**
 * Login user
 * @route POST /api/auth/login
 */
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  // Find user
  const result = await db.query(
    'SELECT id, name, email, password_hash FROM users WHERE email = $1',
    [email]
  )

  if (!result.rows.length) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }

  const user = result.rows[0]

  // Verify password
  const valid = await bcrypt.compare(password, user.password_hash)
  if (!valid) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }

  // Generate JWT token
  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )

  logger.info(`User logged in: ${email}`)

  res.json({
    message: 'Login successful',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    }
  })
})

/**
 * Get current user profile
 * @route GET /api/auth/me
 */
exports.getProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id

  const result = await db.query(
    'SELECT id, name, email, created_at FROM users WHERE id = $1',
    [userId]
  )

  if (!result.rows.length) {
    return res.status(404).json({ error: 'User not found' })
  }

  res.json({ user: result.rows[0] })
})

/**
 * Update user profile
 * @route PUT /api/auth/profile
 */
exports.updateProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id
  const { name } = req.body

  if (!name || name.trim().length < 2) {
    return res.status(400).json({ error: 'Invalid name' })
  }

  const result = await db.query(
    'UPDATE users SET name = $1 WHERE id = $2 RETURNING id, name, email',
    [name.trim(), userId]
  )

  logger.info(`User profile updated: ${userId}`)

  res.json({
    message: 'Profile updated successfully',
    user: result.rows[0]
  })
})
