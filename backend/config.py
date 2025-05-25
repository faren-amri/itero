import os

class Config:
    raw_url = os.environ.get("MYSQL_URL")
    SQLALCHEMY_DATABASE_URI = raw_url.replace("mysql://", "mysql+pymysql://", 1) if raw_url else None
    SQLALCHEMY_TRACK_MODIFICATIONS = False
