from flask import Blueprint, request, jsonify
from app.tasks.models import TaskCompletion
from app.streaks.models import Streak
from app.users.models import User
from app.database.db import db
from datetime import datetime, timedelta
import logging

task_bp = Blueprint("tasks", __name__)
XP_PER_TASK = 10

@task_bp.route("/complete", methods=["POST"])
def complete_task():
    try:
        data = request.get_json()
        logging.info(f"📥 Received task completion request: {data}")

        trello_user_id = data.get("trello_user_id")
        trello_username = data.get("trello_username")
        task_id = data.get("task_id")

        if not trello_user_id or not task_id:
            logging.warning("❌ Missing required fields in request")
            return jsonify({"error": "Missing required fields"}), 400

        # Get or create the user based on Trello ID
        user = User.query.filter_by(trello_id=trello_user_id).first()
        if not user:
            user = User(trello_id=trello_user_id, username=trello_username, xp=0, level=1)
            db.session.add(user)
            db.session.commit()
            logging.info(f"🆕 Created new user: {trello_username} ({trello_user_id})")

        # Reward XP
        user.xp += XP_PER_TASK
        if user.xp >= user.level * 100:
            user.level += 1

        # Handle streak
        today = datetime.utcnow().date()
        streak = Streak.query.filter_by(user_id=user.id, streak_type='daily').first()
        if not streak:
            streak = Streak(user_id=user.id, count=1, streak_type='daily', last_updated=today)
            db.session.add(streak)
        else:
            last = streak.last_updated.date()
            if last == today:
                pass  # Already updated today
            elif last == today - timedelta(days=1):
                streak.count += 1
                streak.last_updated = today
            else:
                streak.count = 1
                streak.last_updated = today

        db.session.commit()
        logging.info(f"✅ Task complete: XP={user.xp}, Streak={streak.count}")

        return jsonify({
            "message": "Task completed. Streak and XP updated.",
            "streak_count": streak.count,
            "xp": user.xp,
            "level": user.level
        }), 200

    except Exception as e:
        logging.exception("❌ Server error while processing task completion")
        return jsonify({"error": "Internal server error"}), 500
