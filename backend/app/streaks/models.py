from app.database.db import db
from datetime import datetime

class Streak(db.Model):
    __tablename__ = 'streak'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, nullable=False)  # Consider ForeignKey if linked to users
    streak_type = db.Column(db.String(10), nullable=False, default='daily')  # daily or weekly
    count = db.Column(db.Integer, nullable=False, default=0)
    last_updated = db.Column(db.DateTime(timezone=True), nullable=False, default=datetime.utcnow)
