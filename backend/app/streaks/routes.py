from flask import Blueprint, request, jsonify
from app.streaks.models import Streak
from app.database.db import db
from datetime import datetime, timedelta

streak_bp = Blueprint("streaks", __name__)

@streak_bp.route("/update", methods=["POST"])
def update_streak():
    data = request.get_json()
    user_id = data.get("user_id")

    if not user_id:
        return jsonify({"error": "Missing user_id"}), 400

    today = datetime.utcnow().date()
    streak = Streak.query.filter_by(user_id=user_id, streak_type='daily').first()

    if not streak:
        new_streak = Streak(user_id=user_id, count=1, streak_type='daily', last_updated=today)
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
