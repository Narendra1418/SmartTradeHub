const Joi = require('joi')

const schemas = {
  signup: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(128).required()
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  symbol: Joi.object({
    symbol: Joi.string().uppercase().min(1).max(10).required()
  }),

  portfolio: Joi.object({
    symbol: Joi.string().uppercase().min(1).max(10).required(),
    quantity: Joi.number().positive().required(),
    purchasePrice: Joi.number().positive().required(),
    purchaseDate: Joi.date().iso().optional()
  }),

  watchlist: Joi.object({
    symbol: Joi.string().uppercase().min(1).max(10).required(),
    targetPrice: Joi.number().positive().optional(),
    notes: Joi.string().max(500).optional()
  })
}

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schemas[schema].validate(req.body, { abortEarly: false })
    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }))
      return res.status(400).json({ errors })
    }
    next()
  }
}

module.exports = { validate, schemas }
