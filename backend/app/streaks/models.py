from app.database.db import db
from datetime import datetime

class Streak(db.Model):
    __tablename__ = 'streak'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    streak_type = db.Column(db.String(10), default='daily')  # daily or weekly
    count = db.Column(db.Integer, default=0)
    last_updated = db.Column(db.DateTime, default=datetime.utcnow)
