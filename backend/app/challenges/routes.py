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
def challenge_suggestions():
    try:
        trello_member_id = request.args.get("trello_member_id")
        if not trello_member_id:
            return jsonify({"error": "Missing trello_member_id"}), 400

        user = User.query.filter_by(trello_id=trello_member_id).first()
        if not user:
            return jsonify({"error": "User not found"}), 404

        all_templates = ChallengeTemplate.query.all()
        suggestions = []

        for template in all_templates:
            last_attempt = UserChallenge.query.filter_by(
                user_id=user.id,
                template_id=template.id
            ).order_by(UserChallenge.accepted_at.desc()).first()

            if not last_attempt:
                suggestions.append(template)
                continue

            if last_attempt.status == 'active':
                continue

            if not template.repeatable:
                continue

            # 👇 Avoid crash if cooldown_days is None
            cooldown = template.cooldown_days or 0
            last_done = last_attempt.accepted_at
            days_since = (get_current_utc().date() - last_done.date()).days

            if days_since >= cooldown:
                suggestions.append(template)

        return jsonify([
            {
                "id": t.id,
                "title": t.title,
                "description": t.description,
                "type": t.type,
                "goal": t.goal,
                "duration_days": t.duration_days,
                "repeatable": t.repeatable,
                "cooldown_days": t.cooldown_days
            }
            for t in suggestions
        ]), 200

    except Exception as e:
        import traceback
        print("🔥 /suggestions error:", traceback.format_exc())
        return jsonify({"error": "Internal server error"}), 500



@challenge_bp.route("/accept/<int:template_id>", methods=["POST"], endpoint="accept_challenge")
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


@challenge_bp.route("/active", methods=["GET"], endpoint="active_challenges")
def active_challenges():
    trello_member_id = request.args.get("trello_member_id")
    if not trello_member_id:
        return jsonify({"error": "Missing trello_member_id"}), 400

    user = User.query.filter_by(trello_id=trello_member_id).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    challenges = UserChallenge.query.filter_by(user_id=user.id, status="active").all()

    return jsonify([{
        "id": c.id,
        "title": c.template.title,
        "description": c.description,
        "progress": c.progress,
        "goal": c.template.goal,
        "status": c.status
    } for c in challenges]), 200


@challenge_bp.route("/completed", methods=["GET"], endpoint="completed_challenges")
def completed_challenges():
    trello_member_id = request.args.get("trello_member_id")
    if not trello_member_id:
        return jsonify({"error": "Missing trello_member_id"}), 400

    user = User.query.filter_by(trello_id=trello_member_id).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    challenges = UserChallenge.query.filter_by(user_id=user.id, status="completed").all()

    return jsonify([{
        "id": c.id,
        "title": c.template.title,
        "type": c.template.type,
        "goal": c.template.goal,
        "progress": c.progress,
        "streak": c.streak,
        "deadline": c.deadline.isoformat(),
        "accepted_at": c.accepted_at.isoformat(),
        "status": c.status
    } for c in challenges]), 200
