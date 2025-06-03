from flask import Blueprint, request, jsonify
from app.challenges.models import ChallengeTemplate, UserChallenge
from app.users.models import User
from datetime import datetime, timedelta
from app.database.db import db
from app.utils.progress_utils import update_streak_and_xp

challenge_bp = Blueprint("challenges", __name__)

XP_FOR_CHALLENGE_ACCEPT = 8  # Custom XP for accepting a challenge

@challenge_bp.route("/active", methods=["GET"])
def get_active_challenges():
    try:
        trello_member_id = request.args.get("trello_member_id")
        if not trello_member_id:
            return jsonify({"error": "Missing trello_member_id"}), 400

        user = User.query.filter_by(trello_id=trello_member_id).first()
        if not user:
            return jsonify({"error": "User not found"}), 404

        active_challenges = UserChallenge.query.filter_by(user_id=user.id, status="active").all()

        def format_challenge(uc):
            template = uc.template
            progress_percent = (
                (uc.streak / template.goal * 100) if template.type == "streak"
                else (uc.progress / template.goal * 100)
            )
            return {
                "id": uc.id,
                "title": template.title,
                "progress": round(progress_percent),
                "status": uc.status,
            }

        return jsonify([format_challenge(uc) for uc in active_challenges]), 200
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": "Internal server error", "detail": str(e)}), 500


@challenge_bp.route("/accept/<int:template_id>", methods=["POST"])
def accept_challenge(template_id):
    data = request.get_json()
    trello_member_id = data.get("trello_member_id")

    if not trello_member_id:
        return jsonify({"error": "Missing trello_member_id"}), 400

    user = User.query.filter_by(trello_id=trello_member_id).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    template = ChallengeTemplate.query.get(template_id)
    if not template:
        return jsonify({"error": "Challenge template not found"}), 404

    existing = UserChallenge.query.filter_by(user_id=user.id, template_id=template.id, status='active').first()
    if existing:
        return jsonify({"error": "Challenge already accepted"}), 400

    accepted_at = datetime.utcnow()
    deadline = accepted_at + timedelta(days=template.duration_days)

    user_challenge = UserChallenge(
        user_id=user.id,
        template_id=template.id,
        status="active",
        progress=0,
        streak=0,
        last_activity_date=None,
        accepted_at=accepted_at,
        deadline=deadline
    )

    db.session.add(user_challenge)

    # ✅ Award XP and streak for accepting a challenge
    streak_count = update_streak_and_xp(user, XP_FOR_CHALLENGE_ACCEPT, 'challenge', db)

    db.session.commit()

    return jsonify({
        "message": "Challenge accepted",
        "challenge_id": user_challenge.id,
        "title": template.title,
        "goal": template.goal,
        "type": template.type,
        "deadline": deadline.isoformat(),
        "xp": user.xp,
        "level": user.level,
        "streak_count": streak_count
    }), 200


@challenge_bp.route("/suggestions", methods=["GET"])
def get_suggestions():
    try:
        trello_member_id = request.args.get("trello_member_id")
        if not trello_member_id:
            return jsonify({"error": "Missing trello_member_id"}), 400

        user = User.query.filter_by(trello_id=trello_member_id).first()
        if not user:
            return jsonify({"error": "User not found"}), 404

        active_template_ids = db.session.query(UserChallenge.template_id).filter_by(
            user_id=user.id, status='active'
        ).all()
        accepted_ids = [t[0] for t in active_template_ids]

        suggestions = ChallengeTemplate.query.filter(~ChallengeTemplate.id.in_(accepted_ids)).all()

        return jsonify([{
            "id": t.id,
            "title": t.title,
            "description": t.description,
            "type": t.type,
            "goal": t.goal,
            "duration_days": t.duration_days
        } for t in suggestions]), 200

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": "Internal server error", "detail": str(e)}), 500


@challenge_bp.route("/completed", methods=["GET"])
def get_completed_challenges():
    trello_member_id = request.args.get("trello_member_id")
    if not trello_member_id:
        return jsonify({"error": "Missing trello_member_id"}), 400

    user = User.query.filter_by(trello_id=trello_member_id).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    completed = UserChallenge.query.filter_by(user_id=user.id, status='completed').all()

    def format_challenge(uc):
        return {
            "id": uc.id,
            "title": uc.template.title,
            "type": uc.template.type,
            "goal": uc.template.goal,
            "progress": uc.progress,
            "streak": uc.streak,
            "deadline": uc.deadline.isoformat(),
            "accepted_at": uc.accepted_at.isoformat(),
            "status": uc.status
        }

    return jsonify([format_challenge(uc) for uc in completed]), 200
