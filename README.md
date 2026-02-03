Seattle Property Price Predictor (PropTech ML App)
A full-stack machine learning application that estimates Seattle residential property market values using supervised learning, geospatial feature engineering, and a production-style web interface.

Project Overview
This project predicts the estimated market (sale) value of residential properties in Seattle based on:
Living area (square footage)
Number of bedrooms
Geospatial distance to Seattle city center
The system is built as a complete ML product, not just a notebook:
Machine learning model trained locally
FastAPI backend serving real-time predictions
Responsive frontend with analytical visualizations and KPIs
User-friendly abstraction (no latitude/longitude input required)

Key Features
Geospatial Feature Engineering
Calculates distance to Seattle city center using the Haversine formula.

Supervised Regression Model
Trained on King County housing data to estimate property sale prices.

FastAPI Backend
Clean REST API with input validation, error handling, and documentation.

Interactive Frontend Dashboard
Seattle neighborhood selection
Key metrics (price, distance, area)
Donut chart vs Seattle average
Neighborhood price comparison chart
Fully responsive UI
Production-Safe Repository
Model artifacts excluded from version control
Clear local setup instructions

proptech-price-predictor/
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── src/
│   ├── app.py              # FastAPI backend
│   ├── train_model.py      # Model training script
│   └── geo_utils.py        # Haversine distance calculation
│
├── data/
│   └── raw/
│       └── kc_house_data.csv
│
├── README.md
└── .gitignore

Run the project Locally
Clone the repository
git clone {link}
cd {into the folder}

Train the model           - python -m src.train_model.py
Start the FastAPI backend - uvicorn src.app:app --reload

Backend runs at: http://127.0.0.1:8000
Swagger docs at: http://127.0.0.1:8000/docs

Run the frontend
python -m http.server 5500
Open in the browser: http://127.0.0.1:5500/frontend/

What the Prediction Represents
The output is an estimated market (sale) value of the property.
It is not annual income, rent, or appreciation.
Predictions are based on historical housing data and engineered features.

Limitations & Notes
The model is trained on historical King County data and should be used for educational and analytical purposes only.
Estimates may not reflect real-time market conditions.
The project focuses on engineering clarity and end-to-end design, not production deployment.



