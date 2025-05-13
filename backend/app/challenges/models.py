from app.database.db import db
from datetime import datetime

class ChallengeTemplate(db.Model):
    __tablename__ = 'challenge_template'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    target_count = db.Column(db.Integer)
    duration_days = db.Column(db.Integer)

class UserChallenge(db.Model):
    __tablename__ = 'user_challenge'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    template_id = db.Column(db.Integer, db.ForeignKey('challenge_template.id'), nullable=False)
    progress = db.Column(db.Integer, default=0)
    status = db.Column(db.String(20), default='active')
    start_date = db.Column(db.DateTime, default=datetime.utcnow)
    deadline = db.Column(db.DateTime)
    
    template = db.relationship('ChallengeTemplate')
