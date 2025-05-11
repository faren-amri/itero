from flask import Flask
from flask_cors import CORS
from app.database.db import db, migrate


def create_app():
    app = Flask(__name__)
    app.config.from_object("config.Config")
    CORS(app)

    db.init_app(app)
    migrate.init_app(app, db)

    # Register routes
    from app.challenges.models import ChallengeTemplate, UserChallenge
    from app.streaks.models import Streak
    from app.tasks.models import TaskCompletion
    from app.users.models import User
    from app.moods.models import MoodEntry





    from app.routes import register_routes
    register_routes(app)

    return app





