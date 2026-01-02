const { validate, schemas } = require('../src/utils/validators')

describe('Validators', () => {
  describe('Signup validation', () => {
    it('should validate correct signup data', () => {
      const data = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'SecurePass123'
      }
      const { error } = schemas.signup.validate(data)
      expect(error).toBeUndefined()
    })

    it('should reject invalid email', () => {
      const data = {
        name: 'John Doe',
        email: 'invalid-email',
        password: 'SecurePass123'
      }
      const { error } = schemas.signup.validate(data)
      expect(error).toBeDefined()
    })

    it('should reject short password', () => {
      const data = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'short'
      }
      const { error } = schemas.signup.validate(data)
      expect(error).toBeDefined()
    })
  })
})
