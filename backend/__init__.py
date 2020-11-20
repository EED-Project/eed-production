import os

from flask import Flask, jsonify, send_from_directory, send_file, render_template, redirect, url_for, request
from flask_cors import CORS

from backend.admin import setup_admin
from backend.api import stats_api_bp
from backend.models import db

app = Flask(__name__)
CORS(app)

def create_app(**kwargs):
    app = Flask(__name__, **kwargs)
    app.config.from_pyfile("config.cfg")

    # Configure by environment variables
    # if os.getenv("EED_DB_NAME", None) or os.getenv("EED_DB_HOST", None):
    #     db_name = os.getenv("EED_DB_NAME", "d688t4rh4ed7lh")
    #     db_host = os.getenv("EED_DB_HOST", "ec2-18-208-58-24.compute-1.amazonaws.com")
    #     db_user = os.getenv("EED_DB_USER", "unk5e4abt32nh")
    #     db_pass = os.getenv("EED_DB_PASS", "pdebf7608f2ccca0f38bfe2c7caaabd484dbafdc15ead873d2cb7c53ca3c202af")
    #     app.config[
    #         "SQLALCHEMY_DATABASE_URI"
    #     ] = f"postgresql://{db_user}:{db_pass}@{db_host}/{db_name}"

    db.init_app(app)

    app.register_blueprint(stats_api_bp)

    setup_admin(app, db)

    @app.route("/ping")
    def ping_pong():
        return jsonify("pong")

    @app.route("/")
    def index():
        if request.args.get("country") is not None:
            return render_template('dashboard.html')
        else:
            return render_template("index.html")
        #return render_template('index.html')


    '''
    @app.route("/dashboard/", methods=['GET', 'POST'])
    def dashboard():
        a = request.args.get("country")
        #return app.send_static_file("dashboard.html")
        #return redirect(url_for('static', filename='dashboard.html/?country=Angola'))
        return render_template('dashboard.html')
        '''

    return app
