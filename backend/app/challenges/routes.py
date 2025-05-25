from flask import Blueprint, request, jsonify
from app.challenges.models import ChallengeTemplate, UserChallenge
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

    template = ChallengeTemplate.query.get(template_id)
    if not template:
        return jsonify({"error": "Challenge template not found"}), 404

    # Prevent duplicates
    existing = UserChallenge.query.filter_by(
        trello_member_id=trello_member_id,
        template_id=template_id,
        status="active"
    ).first()

    if existing:
        return jsonify({"message": "Challenge already active"}), 200

    # Calculate deadline
    from datetime import datetime, timedelta
    deadline = datetime.utcnow() + timedelta(days=template.duration_days or 7)

    challenge = UserChallenge(
        trello_member_id=trello_member_id,
        template_id=template_id,
        progress=0,
        status="active",
        start_date=datetime.utcnow(),
        deadline=deadline
    )

    db.session.add(challenge)
    db.session.commit()

    return jsonify({"message": "Challenge accepted", "challenge": challenge.serialize()}), 201

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

