from app.database.db import db

class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    trello_id = db.Column(db.String(100), unique=True, nullable=True) 
    username = db.Column(db.String(80), unique=False) 
    email = db.Column(db.String(120), unique=True, nullable=True)
    xp = db.Column(db.Integer, default=0)
    level = db.Column(db.Integer, default=1)
