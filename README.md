# SmartTradeHub

A comprehensive AI-powered stock trading platform with real-time market data, portfolio management, and machine learning predictions.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![Python](https://img.shields.io/badge/python-%3E%3D3.9-blue.svg)

## 🚀 Features

### Core Functionality
- **Real-Time Market Data**: Live stock quotes and market information via Finnhub API
- **Portfolio Management**: Track investments, calculate P&L, and monitor performance
- **Watchlist**: Save and monitor favorite stocks with price alerts
- **AI-Powered Predictions**: Machine learning models for price trend analysis
- **Interactive Charts**: Visualize stock performance with Chart.js
- **User Authentication**: Secure JWT-based authentication system

### Technical Highlights
- **Microservices Architecture**: Separate backend, frontend, and ML services
- **RESTful API**: Well-structured API with validation and error handling
- **Responsive Design**: Modern UI built with Next.js and Tailwind CSS
- **Database**: PostgreSQL for reliable data persistence
- **Containerization**: Docker support for easy deployment
- **CI/CD**: Automated testing and deployment pipeline

## 📋 Table of Contents

- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## 🏗️ Architecture

```
SmartTradeHub/
├── backend/          # Node.js/Express REST API
├── frontend/         # Next.js React application
├── ml-service/       # Python FastAPI ML service
├── infra/           # Infrastructure & deployment configs
│   ├── docker-compose.yaml
│   ├── k8s/         # Kubernetes manifests
│   └── terraform/   # Infrastructure as Code
└── docs/            # Documentation
```

### Tech Stack

**Backend:**
- Node.js & Express.js
- PostgreSQL database
- JWT authentication
- Winston logging
- Joi validation

**Frontend:**
- Next.js 14 (React 18)
- Tailwind CSS
- Chart.js for visualizations
- Axios for API calls
- React Hot Toast for notifications

**ML Service:**
- FastAPI
- NumPy & Pandas
- Scikit-learn
- Statistical analysis & predictions

**DevOps:**
- Docker & Docker Compose
- Kubernetes
- GitHub Actions CI/CD
- Terraform (IaC)

## ✅ Prerequisites

- **Node.js**: v18.x or higher
- **Python**: v3.9 or higher
- **PostgreSQL**: v14 or higher
- **Docker** (optional): For containerized deployment
- **Finnhub API Key**: [Sign up for free](https://finnhub.io/)

## 📦 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Narendra1418/SmartTradeHub.git
cd SmartTradeHub
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file (see Configuration section below)

### 3. Frontend Setup

```bash
cd frontend
npm install
```

### 4. ML Service Setup

```bash
cd ml-service
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 5. Database Setup

```sql
-- Create database
CREATE DATABASE smarttradehub;

-- Connect to database
\c smarttradehub

-- Create tables
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE portfolio (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    symbol VARCHAR(10) NOT NULL,
    quantity DECIMAL(10, 2) NOT NULL,
    purchase_price DECIMAL(10, 2) NOT NULL,
    purchase_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE watchlist (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    symbol VARCHAR(10) NOT NULL,
    target_price DECIMAL(10, 2),
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, symbol)
);

CREATE INDEX idx_portfolio_user ON portfolio(user_id);
CREATE INDEX idx_watchlist_user ON watchlist(user_id);
```

## ⚙️ Configuration

### Backend Environment Variables

Create `backend/.env`:

```env
# Server
PORT=4000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/smarttradehub
DB_HOST=localhost
DB_PORT=5432
DB_NAME=smarttradehub
DB_USER=your_username
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_jwt_secret_key_here_minimum_32_characters

# External APIs
FINNHUB_KEY=your_finnhub_api_key

# CORS
FRONTEND_URL=http://localhost:3000

# Logging
LOG_LEVEL=info
```

### Frontend Environment Variables

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_ML_SERVICE_URL=http://localhost:8000
```

### ML Service Environment Variables

Create `ml-service/.env`:

```env
API_HOST=0.0.0.0
API_PORT=8000
LOG_LEVEL=INFO
```

## 🚀 Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

**Terminal 3 - ML Service:**
```bash
cd ml-service
source venv/bin/activate  # On Windows: venv\Scripts\activate
python -m uvicorn app.main:app --reload --port 8000
```

### Using Docker Compose

```bash
cd infra
docker-compose up -d
```

Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000
- ML Service: http://localhost:8000/docs

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user profile |
| PUT | `/api/auth/profile` | Update user profile |

### Market Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/market/quote/:symbol` | Get real-time quote |
| GET | `/api/market/search?q=query` | Search stock symbols |
| GET | `/api/market/candles/:symbol` | Get historical data |
| GET | `/api/market/news` | Get market news |

### Portfolio Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/portfolio` | Get user portfolio |
| POST | `/api/portfolio` | Add holding |
| PUT | `/api/portfolio/:id` | Update holding |
| DELETE | `/api/portfolio/:id` | Delete holding |

### Watchlist Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/watchlist` | Get user watchlist |
| POST | `/api/watchlist` | Add to watchlist |
| PUT | `/api/watchlist/:id` | Update watchlist item |
| DELETE | `/api/watchlist/:id` | Remove from watchlist |

### ML Service Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/predict` | Get price prediction |
| POST | `/batch-predict` | Batch predictions |
| GET | `/health` | Health check |

For detailed API documentation, visit:
- Backend: Run server and check logs for endpoint list
- ML Service: http://localhost:8000/docs (Swagger UI)

## 🧪 Testing

### Backend Tests

```bash
cd backend
npm test
npm run test:watch  # Watch mode
```

### Frontend Tests

```bash
cd frontend
npm test
```

### Integration Tests

```bash
# Run all services first
npm run test:integration
```

## 🐳 Deployment

### Docker Deployment

```bash
# Build images
docker-compose -f infra/docker-compose.yaml build

# Run containers
docker-compose -f infra/docker-compose.yaml up -d

# Check status
docker-compose -f infra/docker-compose.yaml ps
```

### Kubernetes Deployment

```bash
# Apply configurations
kubectl apply -f infra/k8s/

# Check deployments
kubectl get pods
kubectl get services
```

### Environment-Specific Deployments

See [docs/deployment.md](docs/deployment.md) for detailed deployment guides for:
- AWS
- Google Cloud Platform
- Azure
- DigitalOcean

## 👥 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and development process.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Finnhub API](https://finnhub.io/) for market data
- [Next.js](https://nextjs.org/) for the amazing React framework
- [FastAPI](https://fastapi.tiangolo.com/) for the Python web framework
- All contributors and supporters of this project

## 📞 Contact

**Narendra** - [@Narendra1418](https://github.com/Narendra1418)

Project Link: [https://github.com/Narendra1418/SmartTradeHub](https://github.com/Narendra1418/SmartTradeHub)

---

⭐ Star this repository if you find it helpful!
