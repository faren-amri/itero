from datetime import datetime, date
from app import db

class ChallengeTemplate(db.Model):
    __tablename__ = 'challenge_template'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)

    type = db.Column(db.String(50), nullable=False)  # "count" or "streak"
    goal = db.Column(db.Integer, nullable=False)     # task count or days
    duration_days = db.Column(db.Integer, nullable=False)  # e.g., 7 days

    # Optional future: category, reward_xp, tags, etc.
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Reverse relation: template.user_challenges
    user_challenges = db.relationship('UserChallenge', backref='template', lazy=True)


class UserChallenge(db.Model):
    __tablename__ = 'user_challenge'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    template_id = db.Column(db.Integer, db.ForeignKey('challenge_template.id'), nullable=False)

    status = db.Column(db.String(20), default='active')  # active, completed, failed
    progress = db.Column(db.Integer, default=0)          # task count
    streak = db.Column(db.Integer, default=0)            # used for streak type
    last_activity_date = db.Column(db.Date)              # used for streak type

    accepted_at = db.Column(db.DateTime, default=datetime.utcnow)
    deadline = db.Column(db.DateTime, nullable=True)     # auto-calculate on accept
