from flask import Flask, render_template, request, jsonify
import joblib
import pandas as pd
import numpy as np

app = Flask(__name__)

# Load the model pipeline
model = joblib.load('model.joblib')

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Extract data from request
        data = request.json
        
        # Mapping frontend names to dataset column names
        # Features needed: longitude, latitude, housing_median_age, total_rooms, total_bedrooms, population, households, median_income, ocean_proximity
        
        input_data = {
            'longitude': float(data.get('longitude', -122.23)),
            'latitude': float(data.get('latitude', 37.88)),
            'housing_median_age': float(data.get('age', 41)),
            'total_rooms': float(data.get('rooms', 880)),
            'total_bedrooms': float(data.get('bedrooms', 129)),
            'population': float(data.get('population', 322)),
            'households': float(data.get('households', 126)),
            'median_income': float(data.get('income', 8.3252)),
            'ocean_proximity': data.get('proximity', 'NEAR BAY')
        }
        
        df = pd.DataFrame([input_data])
        
        # Make prediction
        prediction = model.predict(df)[0]
        
        # Calculate a "Contact" confidence score or just return agent info
        agent_info = {
            'name': 'Sarah Mitchell',
            'phone': '+1 (555) 012-3456',
            'email': 'sarah.m@elegancerealty.com',
            'agency': 'Elegance Luxury Realty'
        }
        
        return jsonify({
            'success': True,
            'prediction': round(prediction, 2),
            'agent': agent_info
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        })

if __name__ == '__main__':
    app.run(debug=True, port=5000)
