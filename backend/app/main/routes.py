from flask import Blueprint

main_bp = Blueprint("main", __name__)

@main_bp.route("/")
def index():
    return {"message": "Itero API is running!"}
