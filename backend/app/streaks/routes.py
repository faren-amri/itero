from flask import Blueprint, request, jsonify
from app.streaks.models import Streak
from app.users.models import User
from app.database.db import db
from datetime import timedelta
from app.utils.time_utils import get_current_utc, normalize_to_utc, is_same_day_utc, days_between_utc

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

    now_utc = get_current_utc()
    today_utc = now_utc.date()

    streak = Streak.query.filter_by(user_id=user.id, streak_type='daily').first()

    if not streak:
        # Start new streak
        new_streak = Streak(user_id=user.id, count=1, streak_type='daily', last_updated=now_utc)
        db.session.add(new_streak)
        db.session.commit()
        return jsonify({"message": "Streak started", "count": 1}), 200

    last_updated = normalize_to_utc(streak.last_updated).date()

    if last_updated == today_utc:
        return jsonify({"message": "Streak already updated today", "count": streak.count}), 200
    elif (today_utc - last_updated).days == 1:
        # Continue streak
        streak.count += 1
        streak.last_updated = now_utc
        db.session.commit()
        return jsonify({"message": "Streak continued!", "count": streak.count}), 200
    else:
        # Streak broken, reset
        streak.count = 1
        streak.last_updated = now_utc
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
                "last_updated": normalize_to_utc(s.last_updated).isoformat()
            }
            for s in streaks
        ]
    }), 200
