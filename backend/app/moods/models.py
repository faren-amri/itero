from app.database.db import db
from datetime import datetime

class MoodEntry(db.Model):
    __tablename__ = 'mood_entry'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    trello_member_id = db.Column(db.String(100), nullable=False)
    mood = db.Column(db.String(20), nullable=False)
    logged_at = db.Column(db.DateTime(timezone=True), default=datetime.utcnow, nullable=False)
