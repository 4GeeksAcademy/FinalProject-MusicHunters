"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Event, TicketsSource, PrecioTickets, Favoritos
from api.utils import generate_sitemap, APIException, validate_password
from flask_cors import CORS
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


######################## USERS ########################
#-------------------- RUTA DE REGISTRO --------------------

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
    
    is_valid, message = validate_password(request_body["password"])
    if not is_valid:
        return jsonify({"msg": message}), 400
    
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


#-------------------- RUTA DE LOGIN --------------------

@api.route('/login', methods=['POST'])
def login():
    request_body = request.json
    user= User.query.filter_by(email=request_body["email"]).first()
    
    if user and user.verify_password(request_body["password"]) is True:
        access_token = create_access_token(identity=user.serialize())

        return jsonify({"msg": "User logged in", "user": user.serialize(), "access_token": access_token}), 200
    else:
        return jsonify({"msg": "Incorrect email or password"}), 401



#-------------------- RUTA DE EDIT USER --------------------
@api.route('/user/<int:id>', methods=['PUT'])
@jwt_required()
def edit_user():
    request_body = request.json
    user = User.query.get(id)
    if user is None:
        return jsonify({"msg": "User not found"}), 404

    if "email" in request_body:
        user.email = request_body["email"]
    if "password" in request_body:
        user.password = user.generate_password_hash(request_body["password"])
    if "username" in request_body:
        user.username = request_body["username"]
    if "name" in request_body:
        user.name = request_body["name"]
    if "last_name" in request_body:
        user.last_name = request_body["last_name"]
    if "phone" in request_body:
        user.phone = request_body["phone"]
    if "address" in request_body:
        user.address = request_body["address"]
    if "profile_picture" in request_body:
        user.profile_picture = request_body["profile_picture"]

    db.session.commit()

    return jsonify({"msg": "User updated", "user": user.serialize()}), 200

#-------------------- RUTA DE DELETE USER --------------------
@api.route('/user/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_user():
    user = User.query.get(id)
    if user is None:
        return jsonify({"msg": "User not found"}), 404

    db.session.delete(user)
    db.session.commit()

    return jsonify({"msg": "User deleted"}), 200

######################## EVENTS ########################
#-------------------- RUTA DE OBTENER EVENTOS --------------------
@api.route('/events', methods=['GET'])
def get_events():
    events = Event.query.all()
    events = list(map(lambda event: event.serialize(), events))
    return jsonify(events), 200

#-------------------- RUTA DE OBTENER EVENTO POR ID --------------------
#                       Para la vista de detalle                       
@api.route('/event/<int:id>', methods=['GET'])
def get_event(id):
    event = Event.query.get(id)
    if event is None:
        return jsonify({"msg": "Event not found"}), 404

    return jsonify(event.serialize()), 200

#-------------------- RUTA DE OBTENER EVENTOS POR TIPO  DE MUSICA --------------------
#                       Para un posible filtro de eventos por tipo de música
@api.route('/events/<genere>', methods=['GET'])
def get_events_by_genere(genere):
    events = Event.query.filter_by(genere=genere).all()
    events = list(map(lambda event: event.serialize(), events))
    return jsonify(events), 200
