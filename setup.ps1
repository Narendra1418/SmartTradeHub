# SmartTradeHub Quick Setup Script

Write-Host "🚀 SmartTradeHub Setup Starting..." -ForegroundColor Cyan
Write-Host ""

# Check if Docker is running
Write-Host "1️⃣ Checking Docker..." -ForegroundColor Yellow
$dockerRunning = docker ps 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Docker is not running. Please start Docker Desktop and try again." -ForegroundColor Red
    exit 1
}
Write-Host "✅ Docker is running" -ForegroundColor Green
Write-Host ""

# Start PostgreSQL and Redis
Write-Host "2️⃣ Starting PostgreSQL and Redis..." -ForegroundColor Yellow
docker-compose up -d
Start-Sleep -Seconds 5
Write-Host "✅ Database services started" -ForegroundColor Green
Write-Host ""

# Install backend dependencies
Write-Host "3️⃣ Installing backend dependencies..." -ForegroundColor Yellow
Set-Location backend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Backend npm install failed" -ForegroundColor Red
    Set-Location ..
    exit 1
}
Set-Location ..
Write-Host "✅ Backend dependencies installed" -ForegroundColor Green
Write-Host ""

# Install frontend dependencies
Write-Host "4️⃣ Installing frontend dependencies..." -ForegroundColor Yellow
Set-Location frontend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Frontend npm install failed" -ForegroundColor Red
    Set-Location ..
    exit 1
}
Set-Location ..
Write-Host "✅ Frontend dependencies installed" -ForegroundColor Green
Write-Host ""

# Initialize database
Write-Host "5️⃣ Initializing database..." -ForegroundColor Yellow
Start-Sleep -Seconds 2
Get-Content backend/db/init.sql | docker exec -i smarttrade_postgres psql -U postgres -d smarttrade
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️ Database initialization may have failed. Verify manually." -ForegroundColor Yellow
} else {
    Write-Host "✅ Database initialized with test user" -ForegroundColor Green
}
Write-Host ""

Write-Host "🎉 Setup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host "  1. Open Terminal 1 and run: cd backend; node index.js"
Write-Host "  2. Open Terminal 2 and run: cd frontend; npm run dev"
Write-Host "  3. Visit http://localhost:3000"
Write-Host ""
Write-Host "🔐 Test Login Credentials:" -ForegroundColor Cyan
Write-Host "  Email: test@example.com"
Write-Host "  Password: test123"
Write-Host ""
