# seed_challenges.py

from app import create_app
from app.database.db import db
from app.challenges.models import ChallengeTemplate

app = create_app()

with app.app_context():
    print("🚀 Seeding challenge templates...")

    templates = [
        ChallengeTemplate(
            title="5 Tasks in 7 Days",
            description="Complete 5 tasks within the next 7 days.",
            type="count",
            goal=5,
            duration_days=7
        ),
        ChallengeTemplate(
            title="3-Day Task Streak",
            description="Complete 1 task each day for 3 consecutive days.",
            type="streak",
            goal=3,
            duration_days=3
        ),
        ChallengeTemplate(
            title="Streak Master: 7 Days",
            description="Maintain a task streak for 7 days.",
            type="streak",
            goal=7,
            duration_days=7
        ),
        ChallengeTemplate(
            title="Mini Sprint",
            description="Complete 3 tasks in 3 days.",
            type="count",
            goal=3,
            duration_days=3
        )
    ]

    existing = ChallengeTemplate.query.all()
    if existing:
        print("⚠️ Templates already exist. Skipping to avoid duplicates.")
    else:
        db.session.bulk_save_objects(templates)
        db.session.commit()
        print("✅ Challenges successfully seeded.")
