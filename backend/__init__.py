<<<<<<< Updated upstream
import os

from flask import Flask, jsonify, send_from_directory, send_file, render_template, redirect, url_for, request

from backend.admin import setup_admin
from backend.api import stats_api_bp
from backend.models import db

app = Flask(__name__)

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
=======
import os

from flask import Flask, jsonify, send_from_directory, send_file, render_template, redirect, url_for, request

from backend.admin import setup_admin
from backend.api import stats_api_bp
from backend.models import db

app = Flask(__name__)

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
>>>>>>> Stashed changes
