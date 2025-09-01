from flask import Blueprint, jsonify
from app.users.models import User
from app.database.db import db

try:
    from app.moods.models import MoodLog
except Exception:  # pragma: no cover
    MoodLog = None

try:
    from app.challenges.models import UserChallenge
except Exception:  # pragma: no cover
    UserChallenge = None

user_bp = Blueprint("user_bp", __name__)

import os
from flask import request, jsonify

ADMIN_JOB_TOKEN = os.environ.get("ADMIN_JOB_TOKEN", "")

@user_bp.route("/compliance/run-now", methods=["POST"])
def compliance_run_now():
    token = request.headers.get("X-Admin-Token", "")
    if not ADMIN_JOB_TOKEN or token != ADMIN_JOB_TOKEN:
        return jsonify({"error": "unauthorized"}), 401
    try:
        from app.scripts.poll_trello_compliance import run_poll

        run_poll()
        return jsonify({"status": "ok"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ------------------------------
# Lookup / seed user
# ------------------------------
@user_bp.route("/lookup/<string:trello_id>", methods=["GET"])
def lookup_user(trello_id):
    user = User.query.filter_by(trello_id=trello_id).first()
    if not user:
        user = User(
            trello_id=trello_id,
            username=f"trello_{trello_id[:6]}",
            email=f"{trello_id}@trello.itero",
            xp=0,
            level=1,
            streak=0,
        )
        db.session.add(user)
        db.session.commit()

    return jsonify({
        "id": user.id,
        "trello_id": user.trello_id,
        "username": user.username,
        "email": user.email,
        "xp": user.xp,
        "level": user.level,
        "streak": user.streak,
    }), 200


# ============================================
# GDPR / Compliance Polling API (Trello)
# ============================================

def _row_to_dict(row):
    """Serialize SQLAlchemy row to dict without relationships."""
    return {c.name: getattr(row, c.name) for c in row.__table__.columns}


def _export_user_data(trello_id: str):
    """Collect all data tied to the Trello member id."""
    payload = {"trelloMemberId": trello_id}

    user = User.query.filter_by(trello_id=trello_id).first()
    payload["user"] = _row_to_dict(user) if user else None

    # Optional tables – included if models exist in your app
    if MoodLog is not None:
        logs = MoodLog.query.filter_by(trello_member_id=trello_id).all()
        payload["moodLogs"] = [_row_to_dict(x) for x in logs]
    else:
        payload["moodLogs"] = []

    if UserChallenge is not None:
        ucs = UserChallenge.query.filter_by(trello_member_id=trello_id).all()
        payload["challenges"] = [_row_to_dict(x) for x in ucs]
    else:
        payload["challenges"] = []

    # Derived flags
    payload["hasData"] = bool(
        payload["user"] or payload["moodLogs"] or payload["challenges"]
    )
    payload["dataCategories"] = [
        k for k in ("user", "moodLogs", "challenges") if payload.get(k)
    ]
    return payload


@user_bp.route("/compliance", methods=["GET"])
def compliance_index():
    """
    Discovery endpoint — lets Trello QA see what's available.
    """
    return jsonify({
        "service": "itero",
        "version": "1.0",
        "endpoints": [
            "/users/compliance/user/<trello_id>",
            "/users/compliance/user/export/<trello_id>",
            "/users/compliance/user/delete/<trello_id>",
        ],
        "dataCategories": ["user", "moodLogs", "challenges"],
    }), 200


@user_bp.route("/compliance/user/<string:trello_id>", methods=["GET"])
def compliance_user_summary(trello_id):
    """
    Trello's polling-style summary: fast boolean + categories.
    """
    data = _export_user_data(trello_id)
    return jsonify({
        "hasData": data["hasData"],
        "dataCategories": data["dataCategories"],
    }), 200


@user_bp.route("/compliance/user/export/<string:trello_id>", methods=["GET"])
def compliance_user_export(trello_id):
    """
    Full export for a given Trello member id.
    Returns everything we store for the user.
    """
    data = _export_user_data(trello_id)
    status = 200 if data["hasData"] else 404
    return jsonify(data), status


@user_bp.route("/compliance/user/delete/<string:trello_id>", methods=["DELETE"])
def compliance_user_delete(trello_id):
    """
    Hard delete all rows tied to this trello_member_id (idempotent).
    Always returns 200 with counts so callers can retry safely.
    """
    deleted = {"user": 0, "moodLogs": 0, "challenges": 0}

    # Delete optional tables first
    if UserChallenge is not None:
        deleted["challenges"] = (
            UserChallenge.query.filter_by(trello_member_id=trello_id)
            .delete(synchronize_session=False)
        )
    if MoodLog is not None:
        deleted["moodLogs"] = (
            MoodLog.query.filter_by(trello_member_id=trello_id)
            .delete(synchronize_session=False)
        )

    user = User.query.filter_by(trello_id=trello_id).first()
    if user:
        db.session.delete(user)
        deleted["user"] = 1

    db.session.commit()

    return jsonify({
        "message": "Deletion completed",
        "deleted": deleted,
        "trelloMemberId": trello_id,
    }), 200
