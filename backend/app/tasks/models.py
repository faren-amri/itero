from app.database.db import db
from datetime import datetime

class TaskCompletion(db.Model):
    __tablename__ = 'task_completion'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    task_id = db.Column(db.String(128))
    completed_at = db.Column(db.DateTime, default=datetime.utcnow)

