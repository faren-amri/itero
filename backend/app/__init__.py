from flask import Flask
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    CORS(app)

    # Register routes
    from .routes.challenge import challenge_bp
    app.register_blueprint(challenge_bp)

    return app
