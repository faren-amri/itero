from flask import Blueprint, request, jsonify
from app.challenges.models import ChallengeTemplate, UserChallenge
from app.users.models import User
from app.database.db import db
from app.utils.progress_utils import update_streak_and_xp
from app.utils.time_utils import get_current_utc
from datetime import timedelta

challenge_bp = Blueprint("challenges", __name__)
XP_FOR_CHALLENGE_ACCEPT = 8
XP_FOR_CHALLENGE_COMPLETE = 20

@challenge_bp.route("/suggestions", methods=["GET"])
def get_suggestions():
    trello_member_id = request.args.get("trello_member_id")
    if not trello_member_id:
        return jsonify({"error": "Missing trello_member_id"}), 400

    user = User.query.filter_by(trello_id=trello_member_id).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    active_ids = db.session.query(UserChallenge.template_id).filter_by(
        user_id=user.id, status='active'
    ).all()

    suggestions = ChallengeTemplate.query.filter(~ChallengeTemplate.id.in_([x[0] for x in active_ids])).all()

    return jsonify([{
        "id": t.id,
        "title": t.title,
        "description": t.description,
        "type": t.type,
        "goal": t.goal,
        "duration_days": t.duration_days
    } for t in suggestions]), 200

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
        return jsonify({"error": "Template not found"}), 404

    if UserChallenge.query.filter_by(user_id=user.id, template_id=template_id, status='active').first():
        return jsonify({"error": "Already accepted"}), 400

    accepted_at = get_current_utc()
    deadline = accepted_at + timedelta(days=template.duration_days)

    user_challenge = UserChallenge(
        user_id=user.id,
        template_id=template.id,
        status="active",
        progress=0,
        streak=0,
        accepted_at=accepted_at,
        deadline=deadline
    )

    db.session.add(user_challenge)
    streak_count = update_streak_and_xp(user, XP_FOR_CHALLENGE_ACCEPT, 'challenge', db)
    db.session.commit()

    return jsonify({
        "message": "Accepted",
        "challenge_id": user_challenge.id,
        "deadline": deadline.isoformat(),
        "xp": user.xp,
        "level": user.level,
        "streak_count": streak_count
    }), 200

@challenge_bp.route("/completed", methods=["GET"])
def get_completed_challenges():
    trello_member_id = request.args.get("trello_member_id")
    if not trello_member_id:
        return jsonify({"error": "Missing trello_member_id"}), 400

    user = User.query.filter_by(trello_id=trello_member_id).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    completed = UserChallenge.query.filter_by(user_id=user.id, status='completed').all()
    return jsonify([{
        "id": uc.id,
        "title": uc.template.title,
        "type": uc.template.type,
        "goal": uc.template.goal,
        "progress": uc.progress,
        "streak": uc.streak,
        "deadline": uc.deadline.isoformat(),
        "accepted_at": uc.accepted_at.isoformat(),
        "status": uc.status
    } for uc in completed]), 200

@challenge_bp.route("/active", methods=["GET"])
def get_active_challenges():
    trello_member_id = request.args.get("trello_member_id")
    if not trello_member_id:
        return jsonify({"error": "Missing trello_member_id"}), 400

    user = User.query.filter_by(trello_id=trello_member_id).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    active = UserChallenge.query.filter_by(user_id=user.id, status='active').all()
    return jsonify([{
        "id": uc.id,
        "title": uc.template.title,
        "progress": uc.progress,
        "status": uc.status
    } for uc in active]), 200
