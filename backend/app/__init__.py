from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import logging
from app.database.db import db, migrate

load_dotenv()

def create_app():
    app = Flask(__name__)
    app.config.from_object("config.Config")

    # CORS for your deployed frontend
    CORS(app, resources={r"/api/*": {"origins": "https://itero-powerup.netlify.app"}})

    # Initialize DB and migrations
    db.init_app(app)
    migrate.init_app(app, db)

    # Centralized Logging Setup
    logging.basicConfig(
        level=logging.INFO,
        format='[%(asctime)s] %(levelname)s in %(module)s: %(message)s'
    )

    # Log every request with user info if available
    @app.before_request
    def log_request_info():
        user_id = getattr(request, 'user_id', None)
        logging.info(f"Request: {request.method} {request.path} | User: {user_id if user_id else 'unauthenticated'}")

    # Global Error Handlers
    @app.errorhandler(500)
    def internal_server_error(e):
        logging.exception("Internal Server Error")
        return jsonify({'error': 'Internal Server Error', 'message': 'An unexpected error occurred.'}), 500

    @app.errorhandler(404)
    def not_found(e):
        return jsonify({'error': 'Not Found'}), 404

    @app.errorhandler(400)
    def bad_request(e):
        return jsonify({'error': 'Bad Request', 'message': str(e)}), 400

    # Import models for Alembic migrations
    from app.challenges.models import ChallengeTemplate, UserChallenge
    from app.streaks.models import Streak
    from app.tasks.models import TaskCompletion
    from app.users.models import User
    from app.moods.models import MoodEntry

    # Register all routes
    from app.routes import register_routes
    register_routes(app)

    return app
