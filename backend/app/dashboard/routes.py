from flask import Blueprint, jsonify
from app.users.models import User
from app.streaks.models import Streak
from app.moods.models import MoodEntry
from app.challenges.models import UserChallenge
from app.database.db import db
from datetime import datetime, timedelta

dashboard_bp = Blueprint("dashboard", __name__)

@dashboard_bp.route("/<int:user_id>", methods=["GET"])
def get_dashboard(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    # XP and level
    xp = user.xp
    level = user.level

    # Streak
    streak = Streak.query.filter_by(user_id=user_id, streak_type='daily').first()
    streak_count = streak.count if streak else 0

    # Mood trend (last 7 days)
    seven_days_ago = datetime.utcnow() - timedelta(days=7)
    moods = MoodEntry.query.filter(
        MoodEntry.user_id == user_id,
        MoodEntry.logged_at >= seven_days_ago
    ).order_by(MoodEntry.logged_at.desc()).all()

    mood_data = [
        {
            "mood": m.mood,
            "logged_at": m.logged_at.strftime("%Y-%m-%d")
        } for m in moods
    ]

    # Active challenges (placeholder)
    active_challenges = UserChallenge.query.filter_by(user_id=user_id, status="active").all()
    challenge_data = [
        {
            "template_id": c.template_id,
            "progress": c.progress,
            "deadline": c.deadline.strftime("%Y-%m-%d")
        } for c in active_challenges
    ]

    return jsonify({
        "xp": xp,
        "level": level,
        "streak_count": streak_count,
        "mood_trend": mood_data,
        "active_challenges": challenge_data
    }), 200
