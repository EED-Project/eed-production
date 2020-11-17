import os

from flask import Flask, jsonify

from backend.admin import setup_admin
from backend.api import stats_api_bp
from backend.models import db


def create_app(**kwargs):
    app = Flask(__name__, **kwargs)
    app.config.from_pyfile("config.cfg")

    # Configure by environment variables
    if os.getenv("EED_DB_NAME", None) or os.getenv("EED_DB_HOST", None):
        db_name = os.getenv("EED_DB_NAME", "df9egclbrc07pm")
        db_host = os.getenv("EED_DB_HOST", "ec2-54-160-202-3.compute-1.amazonaws.com")
        db_user = os.getenv("EED_DB_USER", "ompjvgphfcccsl")
        db_pass = os.getenv("EED_DB_PASS", "12aac0929be8a501efc293dda0bb31d3c3263d0a267704ac8a5a852eab637564")
        app.config[
            "SQLALCHEMY_DATABASE_URI"
        ] = f"postgresql://{db_user}:{db_pass}@{db_host}/{db_name}"

    db.init_app(app)

    app.register_blueprint(stats_api_bp)

    setup_admin(app, db)

    @app.route("/ping")
    def ping_pong():
        return jsonify("pong")

    @app.route("/")
    def index():
        return app.send_static_file("index.html")

    return app
