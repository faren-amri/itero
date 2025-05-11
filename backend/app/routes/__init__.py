from app.challenges.routes import challenge_bp

def register_routes(app):
    app.register_blueprint(challenge_bp, url_prefix="/api/challenges")
    return app
