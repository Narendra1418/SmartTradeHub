import numpy as np
from typing import List, Dict


def validate_prices(prices: List[float]) -> bool:
    """
    Validate price data
    
    Args:
        prices: List of price values
        
    Returns:
        True if valid, False otherwise
    """
    if not prices or len(prices) < 5:
        return False
    
    # Check for valid numbers
    try:
        prices_array = np.array(prices, dtype=float)
        if np.any(prices_array <= 0):
            return False
        if np.any(np.isnan(prices_array)) or np.any(np.isinf(prices_array)):
            return False
        return True
    except (ValueError, TypeError):
        return False


def calculate_technical_indicators(prices: List[float]) -> Dict:
    """
    Calculate technical indicators from price data
    
    Args:
        prices: List of historical prices
        
    Returns:
        Dictionary of technical indicators
    """
    prices_array = np.array(prices)
    
    # Moving averages
    ma_5 = np.mean(prices_array[-5:]) if len(prices) >= 5 else None
    ma_10 = np.mean(prices_array[-10:]) if len(prices) >= 10 else None
    ma_20 = np.mean(prices_array[-20:]) if len(prices) >= 20 else None
    
    # Volatility
    returns = np.diff(prices_array) / prices_array[:-1]
    volatility = float(np.std(returns)) if len(returns) > 0 else 0.0
    
    # RSI (Relative Strength Index) - simplified
    rsi = calculate_rsi(prices_array) if len(prices) >= 14 else None
    
    # Price change
    price_change = float(prices[-1] - prices[0])
    price_change_percent = float((price_change / prices[0]) * 100)
    
    return {
        "ma_5": float(ma_5) if ma_5 is not None else None,
        "ma_10": float(ma_10) if ma_10 is not None else None,
        "ma_20": float(ma_20) if ma_20 is not None else None,
        "volatility": volatility,
        "rsi": float(rsi) if rsi is not None else None,
        "price_change": price_change,
        "price_change_percent": round(price_change_percent, 2)
    }


def calculate_rsi(prices: np.ndarray, period: int = 14) -> float:
    """
    Calculate Relative Strength Index (RSI)
    
    Args:
        prices: Array of prices
        period: RSI period (default 14)
        
    Returns:
        RSI value between 0 and 100
    """
    if len(prices) < period + 1:
        return 50.0  # Neutral value
    
    deltas = np.diff(prices)
    gains = np.where(deltas > 0, deltas, 0)
    losses = np.where(deltas < 0, -deltas, 0)
    
    avg_gain = np.mean(gains[-period:])
    avg_loss = np.mean(losses[-period:])
    
    if avg_loss == 0:
        return 100.0
    
    rs = avg_gain / avg_loss
    rsi = 100 - (100 / (1 + rs))
    
    return float(rsi)


def calculate_bollinger_bands(prices: List[float], period: int = 20, std_dev: int = 2) -> Dict:
    """
    Calculate Bollinger Bands
    
    Args:
        prices: List of prices
        period: Moving average period
        std_dev: Number of standard deviations
        
    Returns:
        Dictionary with upper, middle, and lower bands
    """
    if len(prices) < period:
        return {"upper": None, "middle": None, "lower": None}
    
    prices_array = np.array(prices[-period:])
    middle = np.mean(prices_array)
    std = np.std(prices_array)
    
    return {
        "upper": float(middle + (std_dev * std)),
        "middle": float(middle),
        "lower": float(middle - (std_dev * std))
    }
