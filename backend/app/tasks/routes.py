from flask import Blueprint, request, jsonify
from app.tasks.models import TaskCompletion
from app.streaks.models import Streak
from app.users.models import User
from app.challenges.models import UserChallenge
from app.database.db import db
from datetime import datetime
from app.utils.progress_utils import update_streak_and_xp
from sqlalchemy.orm import joinedload
import logging

task_bp = Blueprint("tasks", __name__)
XP_PER_TASK = 10
XP_PER_CHALLENGE_COMPLETION = 20

@task_bp.route("/complete", methods=["POST"])
def complete_task():
    try:
        data = request.get_json()
        logging.info(f"📥 Received task completion request: {data}")

        trello_user_id = data.get("trello_user_id")
        trello_username = data.get("trello_username", "Anonymous")
        task_id = data.get("task_id")

        if not trello_user_id or not task_id:
            logging.warning("❌ Missing required fields in request")
            return jsonify({"error": "Missing required fields"}), 400

        user = User.query.filter_by(trello_id=trello_user_id).first()
        if not user:
            user = User(trello_id=trello_user_id, username=trello_username, xp=0, level=1)
            db.session.add(user)
            db.session.commit()
            logging.info(f"🆕 Created new user: {trello_username} ({trello_user_id})")

        existing = TaskCompletion.query.filter_by(user_id=user.id, task_id=task_id).first()
        if existing:
            logging.info("⚠️ Task already marked complete — skipping XP update.")
            return jsonify({"message": "Task already completed."}), 200

        db.session.add(TaskCompletion(user_id=user.id, task_id=task_id))

        total_xp_earned = 0
        today = datetime.utcnow().date()
        streak_count = update_streak_and_xp(user, XP_PER_TASK, 'daily', db) or 0
        total_xp_earned += XP_PER_TASK

        user_challenges = UserChallenge.query.options(joinedload(UserChallenge.template)) \
            .filter_by(user_id=user.id, status='active').all()

        logging.info(f"🧩 Processing {len(user_challenges)} challenges...")

        updated_challenges = []

        for uc in user_challenges:
            try:
                template = uc.template
                if not template or not template.type:
                    logging.warning(f"⚠️ Missing template data for challenge {uc.id}")
                    continue

                logging.info(f"⏳ Evaluating challenge: {template.title} (type={template.type})")

                if uc.deadline and datetime.utcnow() > uc.deadline:
                    uc.status = 'failed'
                    db.session.add(uc)
                    continue

                challenge_data = {
                    "id": uc.id,
                    "title": template.title,
                    "type": template.type,
                    "goal": template.goal,
                    "status": uc.status
                }

                if template.type == 'count':
                    uc.progress += 1
                    challenge_data["progress"] = uc.progress

                    if uc.progress >= template.goal:
                        uc.status = 'completed'
                        user.xp += XP_PER_CHALLENGE_COMPLETION
                        total_xp_earned += XP_PER_CHALLENGE_COMPLETION

                    db.session.add(uc)

                elif template.type == 'streak':
                    if uc.last_activity_date == today:
                        continue
                    if uc.last_activity_date and (today - uc.last_activity_date).days > 1:
                        uc.status = 'failed'
                        db.session.add(uc)
                        continue

                    uc.streak += 1
                    uc.last_activity_date = today
                    challenge_data["streak"] = uc.streak

                    if uc.streak >= template.goal:
                        uc.status = 'completed'
                        user.xp += XP_PER_CHALLENGE_COMPLETION
                        total_xp_earned += XP_PER_CHALLENGE_COMPLETION

                    db.session.add(uc)

                updated_challenges.append(challenge_data)

            except Exception as challenge_err:
                logging.exception(f"❌ Error updating challenge {uc.id}: {challenge_err}")
                continue

        while user.xp >= user.level * 100:
            user.level += 1

        db.session.commit()
        logging.info(f"✅ Task complete: XP+{total_xp_earned} | Level {user.level} | Streak {streak_count}")

        return jsonify({
            "message": "Task completed. XP, streak, and challenges updated.",
            "xp_gained": total_xp_earned,
            "total_xp": user.xp,
            "level": user.level,
            "streak_count": streak_count,
            "updated_challenges": updated_challenges
        }), 200

    except Exception as e:
        logging.exception("❌ Server error while processing task completion")
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
