from flask import Blueprint, jsonify
from app.users.models import User
from app.database import db

user_bp = Blueprint("user_bp", __name__)

@user_bp.route("/lookup/<string:trello_id>", methods=["GET"])
def lookup_user(trello_id):
    try:
        user = User.query.filter_by(trello_id=trello_id).first()

        if not user:
            # Create a basic new user with defaults
            user = User(
                trello_id=trello_id,
                username=f"user_{trello_id[:6]}",  # Safe fallback
                email=None,  # If email is optional
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
        })

    except Exception as e:
        print(f"🔴 ERROR in lookup_user: {e}")
        return jsonify({"error": "Internal Server Error", "message": "An unexpected error occurred."}), 500

@user_bp.route("/lookup/<string:trello_id>", methods=["GET"])
def lookup_or_create_user(trello_id):
    user = User.query.filter_by(trello_id=trello_id).first()

    if not user:
        user = User(
            trello_id=trello_id,
            username=f"trello_{trello_id[:6]}",
            email=f"{trello_id}@trello.itero",
            password_hash="dummy",  # placeholder
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
    })
