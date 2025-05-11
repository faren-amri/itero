from app.challenges.routes import challenge_bp
from app.main.routes import main_bp  # ✅ new import

def register_routes(app):
    app.register_blueprint(main_bp)  # ✅ new line
    app.register_blueprint(challenge_bp, url_prefix="/api/challenges")
    return app
