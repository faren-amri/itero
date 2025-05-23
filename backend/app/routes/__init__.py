from app.challenges.routes import challenge_bp
from app.main.routes import main_bp
from app.streaks.routes import streak_bp
from app.tasks.routes import task_bp
from app.moods.routes import mood_bp
from app.dashboard.routes import dashboard_bp
from app.users.routes import user_bp






def register_routes(app):
    app.register_blueprint(main_bp) 
    app.register_blueprint(challenge_bp, url_prefix="/api/challenges")
    app.register_blueprint(streak_bp, url_prefix="/api/streaks")
    app.register_blueprint(task_bp, url_prefix="/api/tasks")
    app.register_blueprint(mood_bp, url_prefix="/api/mood")
    app.register_blueprint(dashboard_bp, url_prefix="/api/dashboard")
    app.register_blueprint(user_bp, url_prefix="/api/users") 

    return app
