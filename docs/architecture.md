# SmartTradeHub Architecture

## System Overview

SmartTradeHub is a modern, microservices-based stock trading platform that combines real-time market data, portfolio management, and AI-powered predictions.

## Architecture Diagram

```
┌─────────────────┐
│   Frontend      │
│   (Next.js)     │
│   Port: 3000    │
└────────┬────────┘
         │
         │ HTTP/REST
         │
┌────────▼────────┐      ┌──────────────┐
│   Backend API   │◄────►│  PostgreSQL  │
│   (Express.js)  │      │   Database   │
│   Port: 4000    │      │  Port: 5432  │
└────────┬────────┘      └──────────────┘
         │
         │ HTTP
         │
┌────────▼────────┐
│   ML Service    │
│   (FastAPI)     │
│   Port: 8000    │
└─────────────────┘
         │
         │ External APIs
         │
┌────────▼────────┐
│  Finnhub API    │
│  Market Data    │
└─────────────────┘
```

## Components

### 1. Frontend (Next.js + React)

**Technology:**
- Next.js 14 with React 18
- Tailwind CSS for styling
- Chart.js for visualizations
- Axios for API communication

**Features:**
- Server-side rendering for SEO
- Client-side routing
- Responsive design
- Real-time data updates
- Interactive charts and dashboards

**Key Pages:**
- `/` - Landing page
- `/auth/login` - Authentication
- `/dashboard` - User dashboard
- `/portfolio` - Portfolio management
- `/watchlist` - Watchlist management

### 2. Backend API (Node.js + Express)

**Technology:**
- Express.js web framework
- PostgreSQL database
- JWT authentication
- Winston logging
- Joi validation

**Architecture Patterns:**
- RESTful API design
- MVC pattern (Controllers, Services, Routes)
- Middleware-based authentication
- Error handling middleware
- Async/await error handling

**Directory Structure:**
```
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Request handlers
│   ├── services/        # Business logic
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   ├── utils/           # Helper functions
│   └── db/             # Database connection
├── logs/               # Application logs
├── app.js             # Express app setup
└── index.js           # Server entry point
```

**API Layers:**
1. **Routes** - Define endpoints and apply middleware
2. **Controllers** - Handle requests, validate input
3. **Services** - Business logic and external API calls
4. **Database** - Data persistence layer

### 3. ML Service (Python + FastAPI)

**Technology:**
- FastAPI framework
- NumPy for numerical computing
- Pandas for data analysis
- Scikit-learn for ML models

**Features:**
- Price prediction using statistical models
- Technical indicator calculations
- Trend analysis
- Batch predictions
- Real-time API documentation (Swagger)

**Prediction Methods:**
- Moving averages (MA5, MA10, MA20)
- Linear regression for trend analysis
- RSI (Relative Strength Index)
- Volatility calculations

### 4. Database (PostgreSQL)

**Schema:**

```sql
users
├── id (PK)
├── name
├── email (unique)
├── password_hash
└── created_at

portfolio
├── id (PK)
├── user_id (FK → users)
├── symbol
├── quantity
├── purchase_price
├── purchase_date
└── created_at

watchlist
├── id (PK)
├── user_id (FK → users)
├── symbol
├── target_price
├── notes
└── created_at

transactions
├── id (PK)
├── user_id (FK → users)
├── symbol
├── action (BUY/SELL)
├── quantity
├── price
└── transaction_date
```

**Indexes:**
- User email (unique)
- Portfolio user_id
- Watchlist user_id + symbol (composite unique)
- Transaction user_id and symbol

## Data Flow

### 1. User Authentication Flow

```
User → Frontend → Backend → Database
                  ↓
                JWT Token
                  ↓
            Store in localStorage
```

### 2. Portfolio Data Flow

```
User Request → Frontend
               ↓
         API Call (with JWT)
               ↓
          Backend Auth Middleware
               ↓
         Portfolio Controller
               ↓
          Database Query
               ↓
        Market Service (Finnhub)
               ↓
       Calculate P&L
               ↓
      Return Response → Frontend
```

### 3. ML Prediction Flow

```
Frontend → Backend → ML Service
                      ↓
               Fetch Historical Data
                      ↓
             Calculate Indicators
                      ↓
              Run Prediction Model
                      ↓
           Return Prediction → Frontend
```

## Security

### Authentication
- JWT-based authentication
- Bcrypt password hashing (12 rounds)
- Token expiration (7 days)
- HTTP-only cookies option available

### API Security
- Helmet.js for security headers
- CORS configuration
- Rate limiting (planned)
- Input validation with Joi
- SQL injection prevention (parameterized queries)
- XSS protection

### Data Protection
- Environment variables for secrets
- Database connection pooling
- Encrypted passwords
- HTTPS in production (recommended)

## Scalability

### Current Architecture
- Stateless API design
- Horizontal scaling ready
- Database connection pooling
- Response caching in services

### Future Enhancements
- Redis for caching
- Message queue (RabbitMQ/Kafka)
- Load balancer (NGINX)
- CDN for static assets
- Database read replicas

## Monitoring & Logging

### Logging
- Winston logger for structured logging
- Log levels: error, warn, info, debug
- File-based logging with rotation
- Console logging in development

### Monitoring (Planned)
- Application metrics
- Performance monitoring
- Error tracking (Sentry)
- Health check endpoints
- Database query performance

## Deployment

### Development
- Local development environment
- Docker Compose for services
- Hot reload for all services

### Production
- Docker containers
- Kubernetes orchestration
- CI/CD with GitHub Actions
- Infrastructure as Code (Terraform)
- Environment-based configuration

## API Design Principles

1. **RESTful Design**: Resource-based URLs, proper HTTP methods
2. **Versioning**: API version in URL (/api/v1/)
3. **Error Handling**: Consistent error response format
4. **Documentation**: Comprehensive API documentation
5. **Testing**: Unit and integration tests
6. **Performance**: Caching, pagination, query optimization

## Technology Choices

### Why Next.js?
- Server-side rendering for better SEO
- File-based routing
- API routes capability
- Great developer experience
- Production-ready optimizations

### Why Express.js?
- Lightweight and flexible
- Large ecosystem
- Easy middleware integration
- Well-documented
- Perfect for RESTful APIs

### Why FastAPI?
- High performance
- Automatic API documentation
- Type validation with Pydantic
- Async support
- Easy Python integration

### Why PostgreSQL?
- ACID compliance
- Strong data integrity
- Complex queries support
- JSON support
- Excellent performance
- Wide adoption

## Future Roadmap

1. **Real-time Features**
   - WebSocket for live updates
   - Real-time notifications
   - Live chat support

2. **Advanced ML**
   - Deep learning models
   - Sentiment analysis
   - News impact prediction
   - Pattern recognition

3. **Social Features**
   - Portfolio sharing
   - Trading ideas community
   - Follow traders
   - Leaderboards

4. **Mobile App**
   - React Native application
   - Push notifications
   - Biometric authentication

5. **Advanced Analytics**
   - Performance reports
   - Tax calculations
   - Risk analysis
   - Diversification suggestions
