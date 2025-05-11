# app/challenges/routes.py
from flask import Blueprint

challenge_bp = Blueprint("challenges", __name__)

@challenge_bp.route("/complete-challenge", methods=["POST"])
def complete_challenge():
    return {"message": "Challenge completed!"}
