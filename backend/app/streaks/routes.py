from flask import Blueprint, request, jsonify
from app.streaks.models import Streak
from app.users.models import User
from app.database.db import db
from datetime import datetime, timedelta

streak_bp = Blueprint("streaks", __name__)

@streak_bp.route("/update", methods=["POST"])
def update_streak():
    data = request.get_json()
    trello_id = data.get("trello_id")

    if not trello_id:
        return jsonify({"error": "Missing trello_id"}), 400

    user = User.query.filter_by(trello_id=trello_id).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    today = datetime.utcnow().date()
    streak = Streak.query.filter_by(user_id=user.id, streak_type='daily').first()

    if not streak:
        new_streak = Streak(user_id=user.id, count=1, streak_type='daily', last_updated=today)
        db.session.add(new_streak)
        db.session.commit()
        return jsonify({"message": "Streak started", "count": 1}), 200

    last_updated = streak.last_updated.date()

    if last_updated == today:
        return jsonify({"message": "Streak already updated today", "count": streak.count}), 200
    elif last_updated == today - timedelta(days=1):
        streak.count += 1
        streak.last_updated = today
        db.session.commit()
        return jsonify({"message": "Streak continued!", "count": streak.count}), 200
    else:
        streak.count = 1
        streak.last_updated = today
        db.session.commit()
        return jsonify({"message": "Streak reset", "count": 1}), 200
    
@streak_bp.route("/<string:trello_id>/streak", methods=["GET"])
def get_all_streaks(trello_id):
    user = User.query.filter_by(trello_id=trello_id).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    streaks = Streak.query.filter_by(user_id=user.id).all()

    return jsonify({
        "streaks": [
            {
                "type": s.streak_type,
                "count": s.count,
                "last_updated": s.last_updated.isoformat()
            }
            for s in streaks
        ]
    }), 200
