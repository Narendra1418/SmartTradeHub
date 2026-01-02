import numpy as np
from typing import List, Dict, Optional
import logging

logger = logging.getLogger(__name__)


class StockPredictor:
    """Stock price prediction model using statistical methods and ML"""
    
    def __init__(self):
        self.model = None
        self.is_trained = False
    
    def is_loaded(self) -> bool:
        """Check if model is loaded"""
        return True  # Always available with statistical methods
    
    def predict(self, prices: List[float]) -> Dict:
        """
        Predict next price using moving averages and trend analysis
        
        Args:
            prices: List of historical prices
            
        Returns:
            Dictionary with prediction and confidence score
        """
        try:
            if len(prices) < 5:
                raise ValueError("Minimum 5 price points required")
            
            prices_array = np.array(prices)
            
            # Calculate moving averages
            ma_short = np.mean(prices_array[-5:])  # 5-period MA
            ma_long = np.mean(prices_array[-min(10, len(prices)):])  # 10-period MA
            
            # Calculate trend
            trend = self._calculate_trend(prices_array)
            
            # Simple prediction: current price + trend adjustment
            current_price = prices[-1]
            prediction = current_price * (1 + trend)
            
            # Calculate confidence based on volatility
            volatility = np.std(prices_array) / np.mean(prices_array)
            confidence = max(0.5, min(0.95, 1 - volatility))
            
            return {
                'prediction': float(prediction),
                'confidence': float(confidence),
                'trend': float(trend),
                'ma_short': float(ma_short),
                'ma_long': float(ma_long)
            }
            
        except Exception as e:
            logger.error(f"Prediction error: {str(e)}")
            raise
    
    def _calculate_trend(self, prices: np.ndarray) -> float:
        """Calculate price trend using linear regression"""
        n = len(prices)
        x = np.arange(n)
        
        # Simple linear regression
        x_mean = np.mean(x)
        y_mean = np.mean(prices)
        
        numerator = np.sum((x - x_mean) * (prices - y_mean))
        denominator = np.sum((x - x_mean) ** 2)
        
        if denominator == 0:
            return 0.0
        
        slope = numerator / denominator
        trend = slope / y_mean  # Normalize by mean price
        
        return float(trend)
    
    def train(self, training_data: List[Dict]):
        """
        Train model with historical data
        Placeholder for future ML model training
        """
        logger.info("Training not implemented - using statistical methods")
        self.is_trained = True
