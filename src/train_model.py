import os
import pickle
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from src.geo_utils import haversine_distance

SEATTLE_LAT = 47.6097
SEATTLE_LON = -122.3331

# Absolute path resolution
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
BASE_DIR = os.path.abspath(os.path.join(CURRENT_DIR, ".."))

DATA_PATH = os.path.join(BASE_DIR, "data", "raw", "kc_house_data.csv")
MODEL_PATH = os.path.join(BASE_DIR, "model.pkl")

print("BASE_DIR:", BASE_DIR)
print("DATA_PATH:", DATA_PATH)

# Load data
df = pd.read_csv(DATA_PATH)

# Feature engineering
df["dist_to_city_center_km"] = haversine_distance(
    df["lat"],
    df["long"],
    SEATTLE_LAT,
    SEATTLE_LON
)

features = ["sqft_living", "bedrooms", "dist_to_city_center_km"]
X = df[features].values
y = df["price"].values

# Train model
rf = RandomForestRegressor(
    n_estimators=200,
    random_state=42,
    n_jobs=-1
)

rf.fit(X, y)

# Save model
with open(MODEL_PATH, "wb") as f:
    pickle.dump(rf, f)

print("Model trained and saved.")
