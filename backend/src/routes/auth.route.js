const router = require('express').Router()
const { signup, login, getProfile, updateProfile } = require('../controllers/auth.controller')
const { validate } = require('../utils/validators')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/signup', validate('signup'), signup)
router.post('/login', validate('login'), login)
router.get('/me', authMiddleware, getProfile)
router.put('/profile', authMiddleware, updateProfile)

module.exports = router

