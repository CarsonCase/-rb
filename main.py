import requests
from flask import Flask, jsonify, request
from flask_cors import CORS
import yfinance as yf
from datetime import datetime

def fetch_monthly_price_data(symbol):
    try:
        # Fetch historical data using yfinance
        stock_data = yf.download(symbol, start='2014-01-01', end='2023-11-29', interval='1mo')

        # Extract adjusted closing prices
        price_data = []
        for date, row in stock_data.iterrows():
            month = date.strftime('%Y-%m-%d')
            adjusted_close = row['Adj Close']

            price_data.append({'date': f"{row['Open']} - {month}", 'price': adjusted_close})

        return price_data
    except Exception as error:
        print('Error fetching data:', error)
        return None

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/stock-data')
def stock_data():
    symbol = request.args.get('ticker')  # Get the 'ticker' query parameter, defaulting to 'AAPL'
    result = fetch_monthly_price_data(symbol)

    if result is not None:
        return jsonify(result)
    else:
        return jsonify({'error': 'Failed to fetch data'})

if __name__ == '__main__':
    app.run(port=1234)
