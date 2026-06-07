# SmartTradeHub Setup

## Prerequisites
- Node.js installed
- Docker Desktop running

## Setup Steps

### 1. Start PostgreSQL and Redis

docker-compose up -d


### 2. Initialize Database

# Wait a few seconds for PostgreSQL to start, then run:
docker exec -i smarttrade_postgres psql -U postgres -d smarttrade < backend/db/init.sql


Or connect manually:

docker exec -it smarttrade_postgres psql -U postgres -d smarttrade


Then paste the SQL from `backend/db/init.sql`

### 3. Install Dependencies

**Backend:**

cd backend
npm install


**Frontend:**

cd frontend
npm install


### 4. Start Services

**Backend (in Terminal 1):**

cd backend
node index.js


**Frontend (in Terminal 2):**

cd frontend
npm run dev


## Test Login Credentials
- **Email:** test@example.com
- **Password:** test123

## API Endpoints

### Backend (http://localhost:4000)
- `GET /` - API status
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/market/summary` - Market data (protected)

### Frontend (http://localhost:3000)
- `/` - Home page
- `/login` - Login page
- `/dashboard` - Dashboard (protected)

## Troubleshooting

### "Cannot GET /"
This is fixed! Now visiting http://localhost:4000 shows API status.

### Database Connection Errors
```powershell
# Check if containers are running:
docker ps

# Restart containers:
docker-compose restart
```

### Redis Connection Errors
```powershell
# Check Redis:
docker exec -it smarttrade_redis redis-cli ping
# Should return: PONG
```

### Invalid Credentials
Make sure the database was initialized with the test user. Run:
```powershell
docker exec -it smarttrade_postgres psql -U postgres -d smarttrade -c "SELECT email FROM users;"
```

Should show: `test@example.com`
