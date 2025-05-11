from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allows frontend requests


@app.route('/')
def home():
    return '✅ Itero API is running!'

@app.route('/api/complete-challenge', methods=['POST'])
def complete_challenge():
    data = request.get_json()
    # Logic to process challenge (fake XP for now)
    return jsonify({
        "message": "Challenge logged",
        "xp": 10
    })