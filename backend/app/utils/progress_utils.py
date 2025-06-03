from app.streaks.models import Streak
from datetime import datetime, timedelta

XP_PER_STREAK_DAY = 2

def update_streak_and_xp(user, base_xp, streak_type, db):
    """Update user's XP and streak based on activity."""
    today = datetime.utcnow().date()
    total_xp = base_xp
    user.xp += base_xp

    # Streak logic
    streak = Streak.query.filter_by(user_id=user.id, streak_type=streak_type).first()
    if not streak:
        streak = Streak(user_id=user.id, streak_type=streak_type, count=1, last_updated=today)
        db.session.add(streak)
        total_xp += XP_PER_STREAK_DAY
        user.xp += XP_PER_STREAK_DAY
    else:
        last = streak.last_updated.date()
        if last == today:
            pass
        elif last == today - timedelta(days=1):
            streak.count += 1
            streak.last_updated = today
            total_xp += XP_PER_STREAK_DAY
            user.xp += XP_PER_STREAK_DAY
        else:
            streak.count = 1
            streak.last_updated = today
            total_xp += XP_PER_STREAK_DAY
            user.xp += XP_PER_STREAK_DAY

    # Level-up logic
    while user.xp >= user.level * 100:
        user.level += 1

    return streak.count
