from flask import Blueprint, request, jsonify
from app.moods.models import MoodEntry
from app.users.models import User
from app.challenges.models import UserChallenge
from app.database.db import db
from app.utils.progress_utils import update_streak_and_xp
from app.utils.time_utils import get_current_utc, normalize_to_utc, is_same_day_utc, days_between_utc
import logging

mood_bp = Blueprint("moods", __name__)

MOOD_SCORES = {
    "Burned Out": 1,
    "Tired": 2,
    "Neutral": 3,
    "Energized": 4,
    "Great": 5
}

XP_FOR_MOOD_LOG = 5
XP_FOR_CHALLENGE_COMPLETE = 20

@mood_bp.route("/log", methods=["POST"])
def log_mood():
    try:
        data = request.get_json()
        trello_member_id = data.get("trello_member_id")
        mood = data.get("mood")

        if not trello_member_id or not mood:
            return jsonify({"error": "Missing Trello member ID or mood"}), 400

        now_utc = get_current_utc()
        today_utc = now_utc.date()

        # Prevent double mood log for today
        existing = MoodEntry.query.filter(
            db.func.date(MoodEntry.logged_at) == today_utc,
            MoodEntry.trello_member_id == trello_member_id
        ).first()

        if existing:
            return jsonify({"message": "Mood already logged today", "mood": existing.mood}), 200

        # Save mood entry
        entry = MoodEntry(trello_member_id=trello_member_id, mood=mood, logged_at=now_utc)
        db.session.add(entry)

        # Award XP and streak
        user = User.query.filter_by(trello_id=trello_member_id).first()
        streak_count = 0
        total_xp_earned = 0

        if user:
            streak_count = update_streak_and_xp(user, XP_FOR_MOOD_LOG, 'daily', db)
            total_xp_earned += XP_FOR_MOOD_LOG

            # Challenge updates (only mood source)
            user_challenges = UserChallenge.query.filter_by(user_id=user.id, status='active').all()
            completed_challenges = []

            for uc in user_challenges:
                template = uc.template

                if template.source != "mood":
                    continue  # skip non-mood challenges

                if template.type == 'count':
                    uc.progress += 1
                    if uc.progress >= template.goal:
                        uc.status = 'completed'
                        user.xp += XP_FOR_CHALLENGE_COMPLETE
                        total_xp_earned += XP_FOR_CHALLENGE_COMPLETE
                        completed_challenges.append({
                            "id": uc.id,
                            "title": template.title,
                            "type": template.type,
                            "goal": template.goal,
                            "progress": uc.progress,
                            "status": uc.status
                        })

                elif template.type == 'streak':
                    last_activity = uc.last_activity_date

                    if last_activity and is_same_day_utc(last_activity, now_utc):
                        continue  # already updated today

                    if last_activity and days_between_utc(last_activity, now_utc) > 1:
                        uc.status = 'failed'
                        continue

                    uc.streak += 1
                    uc.last_activity_date = now_utc

                    if uc.streak >= template.goal:
                        uc.status = 'completed'
                        user.xp += XP_FOR_CHALLENGE_COMPLETE
                        total_xp_earned += XP_FOR_CHALLENGE_COMPLETE
                        completed_challenges.append({
                            "id": uc.id,
                            "title": template.title,
                            "type": template.type,
                            "goal": template.goal,
                            "streak": uc.streak,
                            "status": uc.status
                        })

            # Level-up check
            while user.xp >= user.level * 100:
                user.level += 1

        db.session.commit()

        return jsonify({
            "message": "Mood logged successfully",
            "mood": mood,
            "xp_gained": total_xp_earned,
            "level": user.level if user else 1,
            "streak_count": streak_count
        }), 200

    except Exception as e:
        logging.exception("❌ Error processing mood log")
        return jsonify({"error": "Internal server error"}), 500


@mood_bp.route("/history", methods=["GET"])
def mood_history():
    trello_member_id = request.args.get("trello_member_id")

    if not trello_member_id:
        return jsonify({"error": "Missing Trello member ID"}), 400

    entries = (
        MoodEntry.query
        .filter_by(trello_member_id=trello_member_id)
        .order_by(MoodEntry.logged_at.desc())
        .limit(7)
        .all()
    )

    history = [
        {
            "day": normalize_to_utc(entry.logged_at).strftime("%a"),
            "mood": MOOD_SCORES.get(entry.mood, 3)
        }
        for entry in reversed(entries)
    ]

    return jsonify(history), 200
