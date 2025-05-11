from flask import Blueprint, request, jsonify
from app.tasks.models import TaskCompletion
from app.streaks.models import Streak
from app.users.models import User
from app.database.db import db
from datetime import datetime, timedelta

task_bp = Blueprint("tasks", __name__)

XP_PER_TASK = 10

@task_bp.route("/complete", methods=["POST"])
def complete_task():
    data = request.get_json()
    user_id = data.get("user_id")

    if not user_id:
        return jsonify({"error": "Missing user_id"}), 400

    # ✅ Reward XP
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    user.xp += XP_PER_TASK
    if user.xp >= user.level * 100:
        user.level += 1

    # ✅ Handle streak
    today = datetime.utcnow().date()
    streak = Streak.query.filter_by(user_id=user_id, streak_type='daily').first()
    if not streak:
        streak = Streak(user_id=user_id, count=1, streak_type='daily', last_updated=today)
        db.session.add(streak)
    else:
        last = streak.last_updated.date()
        if last == today:
            pass
        elif last == today - timedelta(days=1):
            streak.count += 1
            streak.last_updated = today
        else:
            streak.count = 1
            streak.last_updated = today

    # ✅ Save everything
    db.session.commit()

    return jsonify({
        "message": "Task completed. Streak and XP updated.",
        "streak_count": streak.count,
        "xp": user.xp,
        "level": user.level
    }), 200
