from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
import numpy as np
import joblib
import logging
from datetime import datetime
from .model import StockPredictor
from .utils import validate_prices, calculate_technical_indicators

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="SmartTradeHub ML Service",
    description="Machine Learning API for stock price predictions and market analysis",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure properly for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize predictor
predictor = StockPredictor()


class PredictRequest(BaseModel):
    """Request model for price prediction"""
    prices: List[float] = Field(..., min_items=5, description="Historical price data (minimum 5 data points)")
    symbol: Optional[str] = Field(None, description="Stock symbol")


class PredictResponse(BaseModel):
    """Response model for price prediction"""
    symbol: Optional[str]
    prediction: float
    confidence: float
    trend: str
    timestamp: str
    technical_indicators: dict


class HealthResponse(BaseModel):
    """Health check response"""
    status: str
    timestamp: str
    model_loaded: bool


@app.get("/", response_model=dict)
async def root():
    """Root endpoint"""
    return {
        "message": "SmartTradeHub ML Service",
        "version": "1.0.0",
        "endpoints": {
            "/predict": "POST - Get stock price predictions",
            "/health": "GET - Health check",
            "/docs": "GET - API documentation"
        }
    }


@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "model_loaded": predictor.is_loaded()
    }


@app.post("/predict", response_model=PredictResponse)
async def predict(req: PredictRequest):
    """
    Predict future stock price based on historical data
    
    - **prices**: List of historical prices (minimum 5 data points)
    - **symbol**: Optional stock symbol
    """
    try:
        logger.info(f"Prediction request for {req.symbol or 'unknown'} with {len(req.prices)} price points")
        
        # Validate input
        if not validate_prices(req.prices):
            raise HTTPException(status_code=400, detail="Invalid price data")
        
        # Calculate technical indicators
        indicators = calculate_technical_indicators(req.prices)
        
        # Make prediction
        prediction_result = predictor.predict(req.prices)
        
        # Determine trend
        current_price = req.prices[-1]
        predicted_price = prediction_result['prediction']
        trend = "bullish" if predicted_price > current_price else "bearish"
        
        response = {
            "symbol": req.symbol,
            "prediction": round(predicted_price, 2),
            "confidence": round(prediction_result['confidence'], 2),
            "trend": trend,
            "timestamp": datetime.now().isoformat(),
            "technical_indicators": indicators
        }
        
        logger.info(f"Prediction successful: {response}")
        return response
        
    except ValueError as e:
        logger.error(f"Validation error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        raise HTTPException(status_code=500, detail="Prediction failed")


@app.post("/batch-predict")
async def batch_predict(symbols: List[PredictRequest]):
    """
    Batch prediction for multiple stocks
    """
    try:
        results = []
        for req in symbols:
            try:
                result = await predict(req)
                results.append({"success": True, "data": result})
            except Exception as e:
                results.append({
                    "success": False,
                    "symbol": req.symbol,
                    "error": str(e)
                })
        return {"predictions": results}
    except Exception as e:
        logger.error(f"Batch prediction error: {str(e)}")
        raise HTTPException(status_code=500, detail="Batch prediction failed")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
