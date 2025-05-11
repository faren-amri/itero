from app import create_app
from app.challenges.models import ChallengeTemplate, UserChallenge
from app.streaks.models import Streak
from app.tasks.models import TaskCompletion
from app.users.models import User
from app.moods.models import MoodEntry




app = create_app()

if __name__ == '__main__':
    app.run()
