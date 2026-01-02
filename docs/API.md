# API Documentation

## Base URL

```
http://localhost:4000/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Endpoints

### Authentication

#### Register User

```http
POST /api/auth/signup
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### Login

```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### Get Current User

```http
GET /api/auth/me
```

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### Market Data

#### Get Stock Quote

```http
GET /api/market/quote/:symbol
```

**Parameters:**
- `symbol` (path): Stock symbol (e.g., AAPL, TSLA)

**Response:**
```json
{
  "quote": {
    "symbol": "AAPL",
    "current": 182.52,
    "change": 2.35,
    "percentChange": 1.31,
    "open": 180.17,
    "high": 183.12,
    "low": 179.85,
    "prevClose": 180.17,
    "timestamp": 1704067200
  }
}
```

#### Search Symbols

```http
GET /api/market/search?q=apple
```

**Query Parameters:**
- `q`: Search query

**Response:**
```json
{
  "results": [
    {
      "description": "Apple Inc",
      "displaySymbol": "AAPL",
      "symbol": "AAPL",
      "type": "Common Stock"
    }
  ]
}
```

#### Get Historical Data

```http
GET /api/market/candles/:symbol?resolution=D&from=1640995200&to=1672531200
```

**Parameters:**
- `symbol` (path): Stock symbol
- `resolution` (query): Candle resolution (1, 5, 15, 30, 60, D, W, M)
- `from` (query): Unix timestamp
- `to` (query): Unix timestamp

**Response:**
```json
{
  "candles": {
    "status": "ok",
    "timestamps": [1640995200, 1641081600],
    "close": [182.01, 182.52],
    "open": [180.17, 181.50],
    "high": [183.12, 183.25],
    "low": [179.85, 181.00],
    "volume": [89897000, 87934000]
  }
}
```

### Portfolio Management

#### Get Portfolio

```http
GET /api/portfolio
```

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "holdings": [
    {
      "id": 1,
      "symbol": "AAPL",
      "quantity": 10,
      "purchase_price": "150.00",
      "purchase_date": "2024-01-01",
      "currentPrice": 182.52,
      "currentValue": 1825.20,
      "investedValue": 1500.00,
      "profitLoss": 325.20,
      "profitLossPercent": "21.68"
    }
  ],
  "summary": {
    "totalInvested": 1500.00,
    "totalCurrent": 1825.20,
    "totalProfitLoss": 325.20,
    "totalProfitLossPercent": "21.68"
  }
}
```

#### Add Holding

```http
POST /api/portfolio
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "symbol": "AAPL",
  "quantity": 10,
  "purchasePrice": 150.00,
  "purchaseDate": "2024-01-01"
}
```

**Response:**
```json
{
  "message": "Holding added successfully",
  "holding": {
    "id": 1,
    "symbol": "AAPL",
    "quantity": 10,
    "purchase_price": "150.00",
    "purchase_date": "2024-01-01",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Update Holding

```http
PUT /api/portfolio/:id
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "quantity": 15,
  "purchasePrice": 155.00,
  "purchaseDate": "2024-01-01"
}
```

#### Delete Holding

```http
DELETE /api/portfolio/:id
```

**Headers:** `Authorization: Bearer <token>`

### Watchlist

#### Get Watchlist

```http
GET /api/watchlist
```

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "watchlist": [
    {
      "id": 1,
      "symbol": "TSLA",
      "target_price": "250.00",
      "notes": "Buy when it reaches target",
      "currentPrice": 242.84,
      "change": -2.15,
      "percentChange": -0.88,
      "targetReached": false,
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Add to Watchlist

```http
POST /api/watchlist
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "symbol": "TSLA",
  "targetPrice": 250.00,
  "notes": "Buy when it reaches target"
}
```

#### Update Watchlist Item

```http
PUT /api/watchlist/:id
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "targetPrice": 260.00,
  "notes": "Updated target price"
}
```

#### Remove from Watchlist

```http
DELETE /api/watchlist/:id
```

**Headers:** `Authorization: Bearer <token>`

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "must be a valid email"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "error": "Invalid token"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

## Rate Limiting

API requests are rate-limited to prevent abuse:
- 100 requests per 15 minutes per IP address
- 1000 requests per hour per authenticated user

## Pagination

List endpoints support pagination:

```http
GET /api/endpoint?page=1&limit=20
```

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)

## Webhooks

Coming soon: Real-time updates via webhooks for portfolio and watchlist changes.
