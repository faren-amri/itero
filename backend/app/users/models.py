from app.database.db import db

class User(db.Model):
    __tablename__ = 'user'  # Explicit table name for consistency

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=True)
    xp = db.Column(db.Integer, default=0, nullable=False)
    level = db.Column(db.Integer, default=1, nullable=False)
    trello_id = db.Column(db.String(128), unique=True, nullable=False)
