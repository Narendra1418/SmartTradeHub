const request = require('supertest')
const app = require('../app')

describe('Health Check', () => {
  it('should return 200 OK', async () => {
    const res = await request(app).get('/health')
    expect(res.statusCode).toBe(200)
    expect(res.body.status).toBe('ok')
  })
})

describe('Auth API', () => {
  describe('POST /api/auth/signup', () => {
    it('should create a new user', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          name: 'Test User',
          email: `test${Date.now()}@example.com`,
          password: 'SecurePassword123'
        })
      
      expect(res.statusCode).toBe(201)
      expect(res.body).toHaveProperty('token')
      expect(res.body).toHaveProperty('user')
    })

    it('should return 400 for invalid email', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          name: 'Test User',
          email: 'invalid-email',
          password: 'SecurePassword123'
        })
      
      expect(res.statusCode).toBe(400)
    })
  })
})
