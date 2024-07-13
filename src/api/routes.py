"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200



@api.route('/register', methods=['POST'])
def register():
    request_body = request.get_json()

    if request_body is None:
        return jsonify({"msg": "The request body is null"}), 400
    if "email" not in request_body:
        return jsonify({"msg": "Email is required"}), 400
    if "password" not in request_body:
        return jsonify({"msg": "Password is required"}), 400
    if "username" not in request_body:
        return jsonify({"msg": "Username is required"}), 400

    # Verificar si el usuario o el correo ya existen
    if User.query.filter_by(email=request_body["email"]).first():
        return jsonify({"msg": "Email already exists"}), 409
    if User.query.filter_by(username=request_body["username"]).first():
        return jsonify({"msg": "Username already exists"}), 409

    # Crear el usuario
    user = User()
    user.create_new_user(
        email=request_body["email"],
        password=request_body["password"],
        username=request_body["username"],
        name=request_body.get("name"),
        last_name=request_body.get("last_name"),
        phone=request_body.get("phone"),
        address=request_body.get("address"),
        profile_picture=request_body.get("profile_picture")
    )

    return jsonify({"msg": "User created", "user": user.serialize()}), 201

@api.route('/login', methods=['POST'])
def login():
    request_body = request.json
    user= User.query.filter_by(email=request_body["email"]).first()
    if user is None:
        return jsonify({"msg": "Invalid email"}), 401
    
    if user and user.verify_password(request_body["password"]) is True:
        access_token = create_access_token(identity=user.serialize())

        return jsonify({"msg": "User logged in", "user": user.serialize(), "access_token": access_token}), 200
    else:
        return jsonify({"msg": "Invalid credential"}), 401
