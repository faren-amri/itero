from datetime import datetime
from app.database.db import db

class ChallengeTemplate(db.Model):
    __tablename__ = 'challenge_template'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)

    type = db.Column(db.String(50), nullable=False)  # "count" or "streak"
    goal = db.Column(db.Integer, nullable=False)
    source = db.Column(db.String(20), default="task")  # task, mood, etc.
    duration_days = db.Column(db.Integer, nullable=False)

    repeatable = db.Column(db.Boolean, default=False)  # ✅ new
    cooldown_days = db.Column(db.Integer, default=0)   # ✅ new (used if repeatable)

    created_at = db.Column(db.DateTime(timezone=True), default=datetime.utcnow)

    user_challenges = db.relationship(
        'UserChallenge',
        backref='template',
        lazy=True,
        cascade="all, delete-orphan"
    )


class UserChallenge(db.Model):
    __tablename__ = 'user_challenge'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)

    user_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete="CASCADE"), nullable=False)
    template_id = db.Column(db.Integer, db.ForeignKey('challenge_template.id', ondelete="CASCADE"), nullable=False)

    status = db.Column(db.String(20), nullable=False, default='active')  # 'active', 'completed', 'failed'
    progress = db.Column(db.Integer, nullable=False, default=0)
    streak = db.Column(db.Integer, nullable=False, default=0)
    last_activity_date = db.Column(db.DateTime(timezone=True), nullable=True)

    accepted_at = db.Column(db.DateTime(timezone=True), default=datetime.utcnow)
    deadline = db.Column(db.DateTime(timezone=True), nullable=True)
