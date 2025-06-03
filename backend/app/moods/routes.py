from flask import Blueprint, request, jsonify
from app.moods.models import MoodEntry
from app.users.models import User
from app.database.db import db
from datetime import datetime
from app.utils.progress_utils import update_streak_and_xp

mood_bp = Blueprint("moods", __name__)

MOOD_SCORES = {
    "Burned Out": 1,
    "Tired": 2,
    "Neutral": 3,
    "Energized": 4,
    "Great": 5
}

XP_FOR_MOOD_LOG = 5

@mood_bp.route("/log", methods=["POST"])
def log_mood():
    data = request.get_json()
    trello_member_id = data.get("trello_member_id")
    mood = data.get("mood")

    if not trello_member_id or not mood:
        return jsonify({"error": "Missing Trello member ID or mood"}), 400

    today = datetime.utcnow().date()

    existing = MoodEntry.query.filter(
        db.func.date(MoodEntry.logged_at) == today,
        MoodEntry.trello_member_id == trello_member_id
    ).first()

    if existing:
        return jsonify({"message": "Mood already logged today", "mood": existing.mood}), 200

    # Save mood entry
    entry = MoodEntry(trello_member_id=trello_member_id, mood=mood)
    db.session.add(entry)

    # Award XP and streak
    user = User.query.filter_by(trello_id=trello_member_id).first()
    streak_count = 0
    if user:
        streak_count = update_streak_and_xp(user, XP_FOR_MOOD_LOG, 'mood', db)

    db.session.commit()

    return jsonify({
        "message": "Mood logged",
        "mood": mood,
        "xp": user.xp if user else 0,
        "level": user.level if user else 1,
        "streak_count": streak_count
    }), 200


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
            "day": entry.logged_at.strftime("%a"),
            "mood": MOOD_SCORES.get(entry.mood, 3)
        }
        for entry in reversed(entries)
    ]

    return jsonify(history), 200
