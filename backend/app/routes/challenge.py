from flask import Blueprint, request, jsonify

challenge_bp = Blueprint('challenge', __name__)

@challenge_bp.route('/api/complete_challenge', methods=['POST'])
def complete_challenge():
    data = request.json
    print("Received:", data)

    # Future: update XP, streaks, etc.
    return jsonify({"success": True, "message": "Challenge completed!"})
