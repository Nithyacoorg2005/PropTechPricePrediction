from fastapi import FastAPI
from pydantic import BaseModel
import pickle
import numpy as np
import os
from src.geo_utils import haversine_distance
from fastapi import HTTPException

SEATTLE_LAT = 47.6097
SEATTLE_LON = -122.3331

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.getenv("MODEL_PATH", "model.pkl")

if not os.path.exists(MODEL_PATH):
    raise RuntimeError(
        "model.pkl not found. Train the model locally before running the API."
    )

with open(MODEL_PATH, "rb") as f:
    model = pickle.load(f)


app = FastAPI(title="PropTech Price Predictor")

class HouseInput(BaseModel):
    lat: float
    long: float
    sqft_living: float
    bedrooms: int

@app.post("/predict")
def predict_price(data: HouseInput):

    # --- Input validation (business rules) ---
    if not (47.0 <= data.lat <= 48.0):
        raise HTTPException(status_code=400, detail="Latitude out of Seattle region")

    if not (-123.5 <= data.long <= -121.5):
        raise HTTPException(status_code=400, detail="Longitude out of Seattle region")

    if data.sqft_living <= 200 or data.sqft_living > 10000:
        raise HTTPException(status_code=400, detail="Invalid sqft_living value")

    if data.bedrooms <= 0 or data.bedrooms > 15:
        raise HTTPException(status_code=400, detail="Invalid number of bedrooms")

    # --- Feature engineering ---
    dist = haversine_distance(
        data.lat,
        data.long,
        SEATTLE_LAT,
        SEATTLE_LON
    )

    X = np.array([[data.sqft_living, data.bedrooms, dist]])
    prediction = model.predict(X)[0]

    return {
        "estimated_price": round(float(prediction), 2),
        "distance_to_city_center_km": round(float(dist), 2)
    }
