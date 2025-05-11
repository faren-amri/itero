from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allows frontend requests

@app.route('/api/complete-challenge', methods=['POST'])
def complete_challenge():
    data = request.json
    trello_user = data.get('trelloUser')
    challenge_id = data.get('challengeId')

    # Dummy XP logic
    xp_awarded = 10

    print(f"User {trello_user} completed challenge {challenge_id}")

    return jsonify({
        "message": "Challenge logged",
        "xp": xp_awarded
    })
