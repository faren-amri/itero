import os, requests, datetime as dt
from app import create_app, db

# Your actual models
from app.users.models import User
try:
    from app.moods.models import MoodLog
except ImportError:
    MoodLog = None
try:
    from app.challenges.models import UserChallenge
except ImportError:
    UserChallenge = None

PLUGIN_ID  = os.environ["TRELLO_PLUGIN_ID"]    # set in Render
API_SECRET = os.environ["TRELLO_API_SECRET"]   # set in Render

def delete_all_for_member(trello_id: str):
    """Delete every row tied to this Trello member id (idempotent)."""
    # children first
    if UserChallenge is not None:
        UserChallenge.query.filter_by(trello_member_id=trello_id).delete(synchronize_session=False)
    if MoodLog is not None:
        MoodLog.query.filter_by(trello_member_id=trello_id).delete(synchronize_session=False)

    user = User.query.filter_by(trello_id=trello_id).first()
    if user:
        db.session.delete(user)

    db.session.commit()

def run_poll():
    # Look back 30 days; safe & idempotent.
    since = (dt.datetime.utcnow() - dt.timedelta(days=30)).strftime("%Y-%m-%dT%H:%M:%SZ")
    url = f"https://api.trello.com/1/plugins/{PLUGIN_ID}/compliance/memberPrivacy"
    resp = requests.get(url, params={"since": since, "limit": 1000, "secret": API_SECRET}, timeout=30)
    resp.raise_for_status()
    events = resp.json()
    print(f"[Compliance] {len(events)} events since {since}")

    for e in events:
        evt = e.get("event")
        member_id = e.get("id")  # Trello member ID
        print(f"[Compliance] {evt} -> {member_id}")
        if evt in ("accountDeleted", "tokenRevoked"):
            delete_all_for_member(member_id)
        # tokenExpired/accountUpdated: ignore unless you store profile fields

if __name__ == "__main__":
    app = create_app()
    with app.app_context():
        run_poll()
