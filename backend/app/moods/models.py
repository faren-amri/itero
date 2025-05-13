from app.database.db import db
from datetime import datetime

class MoodEntry(db.Model):
    __tablename__ = 'mood_entry'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    mood = db.Column(db.String(20), nullable=False)  # e.g. "Tired", "Energized", "Neutral"
    logged_at = db.Column(db.DateTime, default=datetime.utcnow)
