from flask import Blueprint, request, jsonify
from app.challenges.models import ChallengeTemplate, UserChallenge
from app.users.models import User
from datetime import datetime, timedelta
from app.database.db import db


challenge_bp = Blueprint("challenges", __name__)

@challenge_bp.route("/active", methods=["GET"])
def get_active_challenges():
    trello_member_id = request.args.get("trello_member_id")
    if not trello_member_id:
        return jsonify({"error": "Missing trello_member_id"}), 400

    challenges = UserChallenge.query.filter_by(
        trello_member_id=trello_member_id,
        status='active'
    ).all()

    return jsonify([ch.serialize() for ch in challenges])

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

    # Check if already accepted
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
    db.session.commit()

    return jsonify({
        "message": "Challenge accepted",
        "challenge_id": user_challenge.id,
        "title": template.title,
        "goal": template.goal,
        "type": template.type,
        "deadline": deadline.isoformat()
    }), 200

@challenge_bp.route("/suggestions", methods=["GET"])
def get_suggestions():
    trello_member_id = request.args.get("trello_member_id")
    if not trello_member_id:
        return jsonify({"error": "Missing trello_member_id"}), 400

    # Find template IDs already accepted by the user
    active_template_ids = db.session.query(UserChallenge.template_id).filter_by(
        trello_member_id=trello_member_id, status='active'
    ).subquery()

    # Suggest challenges not yet accepted
    suggestions = ChallengeTemplate.query.filter(
        ~ChallengeTemplate.id.in_(active_template_ids)
    ).all()

    return jsonify([{
        "id": t.id,
        "title": t.title,
        "description": t.description
    } for t in suggestions])


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


