from flask import Blueprint, jsonify
from app.users.models import User
from app.database.db import db

user_bp = Blueprint("user_bp", __name__)

@user_bp.route("/lookup/<string:trello_id>", methods=["GET"])
def lookup_user(trello_id):
    user = User.query.filter_by(trello_id=trello_id).first()
    if not user:
        user = User(
            trello_id=trello_id,
            username=f"trello_{trello_id[:6]}",
            email=f"{trello_id}@trello.itero",
            xp=0,
            level=1,
            streak=0
        )
        db.session.add(user)
        db.session.commit()

    return jsonify({
        "id": user.id,
        "trello_id": user.trello_id,
        "username": user.username,
        "email": user.email,
        "xp": user.xp,
        "level": user.level,
        "streak": user.streak
    }), 200

# GDPR Compliance Polling API — required by Trello
@user_bp.route("/compliance/user/<string:trello_id>", methods=["GET"])
def check_user_compliance(trello_id):
    user = User.query.filter_by(trello_id=trello_id).first()
    has_data = user is not None
    return jsonify({"hasData": has_data}), 200

# Optional: GDPR-compliant route to delete user data
@user_bp.route("/compliance/user/delete/<string:trello_id>", methods=["DELETE"])
def delete_user_data(trello_id):
    user = User.query.filter_by(trello_id=trello_id).first()
    if user:
        db.session.delete(user)
        db.session.commit()
        return jsonify({"message": "User data deleted."}), 200
    return jsonify({"message": "User not found."}), 404