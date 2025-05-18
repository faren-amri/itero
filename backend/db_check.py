# db_check.py

from app import create_app
from app.database.db import db
from sqlalchemy import text
from app.users.models import User

# Create the app
app = create_app()

# Wrap everything in app context
with app.app_context():
    try:
        # Test DB connection
        print("🔌 Connecting to the database...")
        result = db.engine.connect().execute(text("SELECT 1")).fetchall()
        print("✅ DB Connected! Result:", result)
    except Exception as e:
        print("❌ DB Connection failed:", str(e))

    # Seed a demo user (optional)
    existing = User.query.filter_by(username='demo_user').first()
    if not existing:
        demo = User(username='demo_user', email='demo@example.com')
        db.session.add(demo)
        db.session.commit()
        print("🎉 Created sample user 'demo_user'")
    else:
        print("👤 Sample user already exists")
