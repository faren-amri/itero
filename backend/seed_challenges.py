# seed_challenges.py

from app import create_app
from app.database.db import db
from app.challenges.models import ChallengeTemplate

app = create_app()
app.app_context().push()

# Optional: clear existing templates
# db.session.query(ChallengeTemplate).delete()

challenges = [
    ChallengeTemplate(
        title="Task Master",
        description="Complete 5 tasks this week.",
        type="count",
        goal=5,
        duration_days=7
    ),
    ChallengeTemplate(
        title="Daily Flow",
        description="Stay consistent with daily task completion for 3 days.",
        type="streak",
        goal=3,
        duration_days=5
    ),
    ChallengeTemplate(
        title="Mood Tracker",
        description="Log your mood 5 times.",
        type="count",
        goal=5,
        duration_days=10
    ),
    ChallengeTemplate(
        title="Streak Champion",
        description="Keep a task streak going for 7 days.",
        type="streak",
        goal=7,
        duration_days=10
    ),
]

db.session.bulk_save_objects(challenges)
db.session.commit()
print("✅ Seeded challenge templates.")
