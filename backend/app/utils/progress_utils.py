from app.streaks.models import Streak
from app.utils.time_utils import get_current_utc, normalize_to_utc, is_same_day_utc, days_between_utc

XP_PER_STREAK_DAY = 2

def update_streak_and_xp(user, base_xp, streak_type, db):
    """
    Update user's XP and streak based on first activity of the UTC day.
    """

    now_utc = get_current_utc()
    today_utc = now_utc.date()

    # Award base XP
    total_xp = base_xp
    user.xp += base_xp

    # Query existing streak for correct streak_type
    streak = Streak.query.filter_by(user_id=user.id, streak_type=streak_type).first()

    if not streak:
        # No streak exists yet — start new
        streak = Streak(user_id=user.id, streak_type=streak_type, count=1, last_updated=now_utc)
        db.session.add(streak)
        total_xp += XP_PER_STREAK_DAY
        user.xp += XP_PER_STREAK_DAY

    else:
        last_updated_date = normalize_to_utc(streak.last_updated).date()

        if last_updated_date == today_utc:
            # Already updated today — no streak change
            pass

        elif (today_utc - last_updated_date).days == 1:
            # Continue streak
            streak.count += 1
            streak.last_updated = now_utc
            total_xp += XP_PER_STREAK_DAY
            user.xp += XP_PER_STREAK_DAY

        else:
            # Streak broken — reset
            streak.count = 1
            streak.last_updated = now_utc
            total_xp += XP_PER_STREAK_DAY
            user.xp += XP_PER_STREAK_DAY

    # Handle level-ups
    while user.xp >= user.level * 100:
        user.level += 1

    db.session.commit()

    return streak.count if streak else 0
