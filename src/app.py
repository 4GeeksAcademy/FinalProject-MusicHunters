"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, request, jsonify, url_for, send_from_directory
from flask_migrate import Migrate
from flask_swagger import swagger
from api.utils import APIException, generate_sitemap
from api.models import db, User
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands
from flask_jwt_extended import JWTManager,create_access_token,get_jwt_identity, jwt_required
from flask_mail import Mail, Message
from flask_cors import CORS
from datetime import timedelta

# from models import Person

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(
    os.path.realpath(__file__)), '../public/')
app = Flask(__name__)
app.url_map.strict_slashes = False
app.config['JWT_SECRET_KEY']='23e48d2e-174a-4ba2-af63-c2b94e903e22'
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=8)
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False
app.config['MAIL_USERNAME'] = 'musichunterweb@gmail.com'
app.config['MAIL_PASSWORD'] = 'fazj yuxy icai wxlf'

mail = Mail(app)
CORS(app)

jwt = JWTManager(app)

# database condiguration
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace(
        "postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'your_secret_key'

MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)

# add the admin
setup_admin(app)

# add the admin
setup_commands(app)

# Add all endpoints form the API with a "api" prefix
app.register_blueprint(api, url_prefix='/api')

# Handle/serialize errors like a JSON object


@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# generate sitemap with all your endpoints


@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

# any other endpoint will try to serve it like a static file

@app.route('/forgot-password', methods=['POST'])
def forgot_password():
    email=request.json.get('email')
    user= User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"msg":"Email not found"}), 404
    token=create_access_token(identity=user.id,expires_delta=timedelta(minutes=5))
    template_html = f""" 
    <html>
        <body>
            <h1>Reset your password</h1>
            <p>Click the following link to reset your password:</p>
            <a href="http://localhost:3000/resetPassword?token={token}">Reset password</a>
        </body>
    </html>
    """
    msg=Message(
        "Reset your password",
        sender="noreply@example.com",
        recipients=[user.email],
        html=template_html
    )
    mail.send(msg)
    return jsonify({"msg":"Email sent"}), 200

@app.route('/reset-password', methods=['POST'])
@jwt_required()
def reset_password():

    user_id=get_jwt_identity()
    password=request.json.get('password')
    user=User.query.get(user_id)
    if not user:
        return jsonify({"msg":"User not found"}), 404
    user.password=user.generate_password_hash(password)
    db.session.commit()
    return jsonify({"msg":"Password updated"}), 200

@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0  # avoid cache memory
    return response


# this only runs if `$ python src/main.py` is executed
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)
