# Quick Start Guide

## Prerequisites Check
- [ ] Node.js 18+ installed (`node --version`)
- [ ] Python 3.9+ installed (`python --version`)
- [ ] PostgreSQL 14+ installed
- [ ] Git installed

## 5-Minute Setup

### 1. Clone & Install (2 minutes)

```bash
# Clone repository
git clone https://github.com/Narendra1418/SmartTradeHub.git
cd SmartTradeHub

# Backend
cd backend
npm install
cd ..

# Frontend
cd frontend
npm install
cd ..

# ML Service
cd ml-service
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cd ..
```

### 2. Database Setup (1 minute)

```bash
# Create database
psql -U postgres
CREATE DATABASE smarttradehub;
\c smarttradehub
\i backend/db/schema.sql
\q
```

### 3. Environment Variables (1 minute)

**Backend** - Copy `backend/.env.template` to `backend/.env`:
```env
PORT=4000
DB_HOST=localhost
DB_NAME=smarttradehub
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your-secret-key-min-32-chars
FINNHUB_KEY=get-from-finnhub.io
FRONTEND_URL=http://localhost:3000
```

**Frontend** - Create `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_ML_SERVICE_URL=http://localhost:8000
```

### 4. Run Services (1 minute)

Open 3 terminals:

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm run dev

# Terminal 3 - ML Service
cd ml-service
source venv/bin/activate
python -m uvicorn app.main:app --reload
```

### 5. Access Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:4000/health
- ML API Docs: http://localhost:8000/docs

## Test the Setup

1. Go to http://localhost:3000
2. Click "Sign Up" and create an account
3. Login and explore the dashboard
4. Try adding a stock to your portfolio (e.g., AAPL)

## Using Docker (Alternative)

```bash
cd infra
docker-compose up -d
```

All services will start automatically!

## Common Issues

**Database connection error?**
- Check PostgreSQL is running: `psql -U postgres`
- Verify credentials in `.env`

**Frontend can't connect to backend?**
- Check backend is running on port 4000
- Verify `NEXT_PUBLIC_API_URL` in `.env.local`

**Missing dependencies?**
- Run `npm install` in backend/frontend
- Run `pip install -r requirements.txt` in ml-service

## Get Finnhub API Key (Free)

1. Visit https://finnhub.io/register
2. Sign up for free account
3. Copy API key from dashboard
4. Add to `backend/.env` as `FINNHUB_KEY`

## Next Steps

- Read [README.md](README.md) for detailed documentation
- Check [docs/API.md](docs/API.md) for API endpoints
- Review [CONTRIBUTING.md](CONTRIBUTING.md) to contribute

## Need Help?

Open an issue on GitHub: https://github.com/Narendra1418/SmartTradeHub/issues
