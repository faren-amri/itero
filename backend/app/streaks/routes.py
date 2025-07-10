from flask import Blueprint, request, jsonify
from app.streaks.models import Streak
from app.users.models import User
from app.database.db import db
from app.utils.time_utils import get_current_utc, normalize_to_utc

streak_bp = Blueprint("streaks", __name__)

@streak_bp.route("/<string:trello_id>/streak", methods=["GET"])
def get_all_streaks(trello_id):
    user = User.query.filter_by(trello_id=trello_id).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    streaks = Streak.query.filter_by(user_id=user.id).all()
    return jsonify({
        "streaks": [{
            "type": s.streak_type,
            "count": s.count,
            "last_updated": normalize_to_utc(s.last_updated).isoformat()
        } for s in streaks]
    }), 200
