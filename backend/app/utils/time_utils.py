from datetime import datetime, timezone, timedelta

def get_current_utc():
    """
    Returns the current UTC time with timezone awareness.
    """
    return datetime.now(timezone.utc)

def normalize_to_utc(dt):
    """
    Ensures any datetime object is timezone-aware and converted to UTC.
    """
    if dt is None:
        return None
    if dt.tzinfo is None:
        return dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(timezone.utc)

def is_same_day_utc(date1, date2):
    """
    Safely compares two dates to see if they fall on the same calendar day in UTC.
    Useful for streak calculations.
    """
    if date1 is None or date2 is None:
        return False
    d1 = normalize_to_utc(date1).date()
    d2 = normalize_to_utc(date2).date()
    return d1 == d2

def days_between_utc(date1, date2):
    """
    Returns the number of full days between two UTC dates.
    """
    d1 = normalize_to_utc(date1).date()
    d2 = normalize_to_utc(date2).date()
    return (d2 - d1).days

def get_utc_today():
    """
    Returns today's date in UTC.
    """
    return get_current_utc().date()

def get_yesterday_utc():
    """
    Returns yesterday's date in UTC.
    """
    return get_current_utc().date() - timedelta(days=1)
