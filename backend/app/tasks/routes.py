from flask import Blueprint, request, jsonify
from app.tasks.models import TaskCompletion
from app.users.models import User
from app.challenges.models import UserChallenge
from app.database.db import db
from app.utils.progress_utils import update_streak_and_xp
from app.utils.time_utils import get_current_utc, normalize_to_utc, is_same_day_utc, days_between_utc
import logging
from datetime import datetime, time, date

task_bp = Blueprint("tasks", __name__)

XP_PER_TASK = 10
XP_PER_CHALLENGE_COMPLETION = 20

@task_bp.route("/complete", methods=["POST"])
def complete_task():
    try:
        data = request.get_json()
        print("Incoming payload:", data)

        trello_user_id = data.get("trello_user_id")
        trello_username = data.get("trello_username", "Anonymous")
        task_id = data.get("task_id")
        source = data.get("source", "task")

        if not trello_user_id or not task_id:
            return jsonify({"error": "Missing required fields"}), 400

        user = User.query.filter_by(trello_id=trello_user_id).first()
        if not user:
            user = User(trello_id=trello_user_id, username=trello_username, xp=0, level=1)
            db.session.add(user)
            db.session.commit()

        existing = TaskCompletion.query.filter_by(user_id=user.id, task_id=task_id).first()
        if existing:
            return jsonify({"message": "Task already completed."}), 200

        now_utc = get_current_utc()
        db.session.add(TaskCompletion(user_id=user.id, task_id=task_id, completed_at=now_utc))

        total_xp_earned = XP_PER_TASK
        streak_count = update_streak_and_xp(user, XP_PER_TASK, 'daily', db)

        user_challenges = UserChallenge.query.filter_by(user_id=user.id, status='active').all()
        completed_challenges = []

        print("DEBUG: Active UserChallenges:")
        for uc in user_challenges:
            template = uc.template
            if not template:
                print(f"  ⚠️ Challenge ID {uc.id} has no template")
                continue

            print(f"  → {template.title} | type: {template.type} | source: {template.source} | progress: {uc.progress} | streak: {uc.streak} | last_activity: {uc.last_activity_date}")

            if template.source != source:
                print(f"  ⏩ Skipping '{template.title}' (source mismatch: expected {template.source}, got {source})")
                continue

            if uc.deadline and get_current_utc() > normalize_to_utc(uc.deadline):
                uc.status = 'failed'
                print(f"  ❌ Expired: {template.title}")
                continue

            if template.type == 'count':
                uc.progress += 1
                print(f"  🔄 Count Progress: {uc.progress}/{template.goal}")
                if uc.progress >= template.goal:
                    uc.status = 'completed'
                    user.xp += XP_PER_CHALLENGE_COMPLETION
                    total_xp_earned += XP_PER_CHALLENGE_COMPLETION
                    completed_challenges.append({
                        "id": uc.id,
                        "title": template.title,
                        "goal": template.goal,
                        "status": uc.status
                    })
                    print(f"  ✅ Challenge completed: {template.title}")

            elif template.type == 'streak':
                last_dt = uc.last_activity_date
                if isinstance(last_dt, date) and not isinstance(last_dt, datetime):
                    last_dt = datetime.combine(last_dt, time.min)
                elif last_dt is None:
                    last_dt = None

                if not last_dt:
                    uc.streak = 1
                    uc.last_activity_date = now_utc
                    print(f"  🔥 First activity for {template.title}")
                elif is_same_day_utc(last_dt, now_utc):
                    print(f"  🔁 Already logged today for {template.title}")
                    uc.last_activity_date = now_utc  # still update timestamp
                elif days_between_utc(last_dt, now_utc) > 1:
                    uc.status = 'failed'
                    print(f"  ❌ Streak broken for {template.title}")
                    continue
                else:
                    uc.streak += 1
                    uc.last_activity_date = now_utc
                    print(f"  🔥 Continuing streak for {template.title} → {uc.streak}")

                uc.progress = uc.streak  # sync progress with streak

                if uc.streak >= template.goal:
                    uc.status = 'completed'
                    user.xp += XP_PER_CHALLENGE_COMPLETION
                    total_xp_earned += XP_PER_CHALLENGE_COMPLETION
                    completed_challenges.append({
                        "id": uc.id,
                        "title": template.title,
                        "goal": template.goal,
                        "status": uc.status
                    })
                    print(f"  ✅ Challenge completed: {template.title}")

        while user.xp >= user.level * 100:
            user.level += 1

        db.session.commit()

        return jsonify({
            "message": "Task completed",
            "xp_gained": total_xp_earned,
            "level": user.level,
            "streak_count": streak_count,
            "completed_challenges": completed_challenges
        }), 200

    except Exception as e:
        logging.exception("❌ Task completion failed at top-level")
        return jsonify({"error": "Internal server error"}), 500


@task_bp.route("/xp/<trello_user_id>", methods=["GET"])
def get_xp(trello_user_id):
    user = User.query.filter_by(trello_id=trello_user_id).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify({
        "xp": user.xp,
        "level": user.level,
        "next_level_xp": user.level * 100
    }), 200

@task_bp.route("/xp/<int:user_id>", methods=["GET"])
def get_user_xp(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    xp = user.xp
    next_level_xp = (user.level + 1) * 100
    return jsonify({"xp": xp, "next_level_xp": next_level_xp})
