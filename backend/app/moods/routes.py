from flask import Blueprint, request, jsonify
from app.moods.models import MoodEntry
from app.database.db import db
from datetime import datetime

mood_bp = Blueprint("mood", __name__)

@mood_bp.route("/log", methods=["POST"])
def log_mood():
    data = request.get_json()
    user_id = data.get("user_id")
    mood = data.get("mood")

    if not user_id or not mood:
        return jsonify({"error": "Missing user_id or mood"}), 400

    today = datetime.utcnow().date()

    # Check if user has already logged mood today
    existing = MoodEntry.query.filter(
        db.func.date(MoodEntry.logged_at) == today,
        MoodEntry.user_id == user_id
    ).first()

    if existing:
        return jsonify({"message": "Mood already logged today", "mood": existing.mood}), 200

    entry = MoodEntry(user_id=user_id, mood=mood)
    db.session.add(entry)
    db.session.commit()

    return jsonify({"message": "Mood logged", "mood": mood}), 200
