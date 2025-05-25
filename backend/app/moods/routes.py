from flask import Blueprint, request, jsonify
from app.moods.models import MoodEntry
from app.database.db import db
from datetime import datetime

mood_bp = Blueprint("mood", __name__)

# Mood string to score mapping
MOOD_SCORES = {
    "Burned Out": 1,
    "Tired": 2,
    "Neutral": 3,
    "Energized": 4,
    "Great": 5
}

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

    entry = MoodEntry(trello_member_id=trello_member_id, mood=mood)
    db.session.add(entry)
    db.session.commit()

    return jsonify({"message": "Mood logged", "mood": mood}), 200

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
            "day": entry.logged_at.strftime("%a"),  # e.g., "Mon"
            "mood": MOOD_SCORES.get(entry.mood, 3)
        }
        for entry in reversed(entries)
    ]

    return jsonify(history), 200
