from app.database.db import db

class User(db.Model):
    __tablename__ = 'user'  # Explicit table name for consistency

    id = db.Column(db.Integer, primary_key=True)
    trello_id = db.Column(db.String(128), unique=True, nullable=False)
    username = db.Column(db.String(128))
    email = db.Column(db.String(128), unique=True)
    xp = db.Column(db.Integer, default=0)
    level = db.Column(db.Integer, default=1)
    streak = db.Column(db.Integer, default=0)

def to_dict(self):
    return {
        "id": self.id,
        "trello_id": self.trello_id,
        "username": self.username,
        "email": self.email,
        "xp": self.xp,
        "level": self.level,
        "streak": self.streak
    }
