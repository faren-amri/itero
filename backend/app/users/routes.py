from flask import Blueprint, jsonify
from app.users.models import User
from app.database import db

user_bp = Blueprint("user_bp", __name__)

@user_bp.route("/lookup/<string:trello_id>", methods=["GET"])
def lookup_user(trello_id):
    user = User.query.filter_by(trello_id=trello_id).first()
    if user:
        return jsonify({
            "id": user.id,
            "trello_id": user.trello_id,
            "username": user.username,
            "email": user.email,
            "xp": user.xp,
            "level": user.level,
            "streak": user.streak
        })
    return jsonify({"error": "User not found"}), 404
