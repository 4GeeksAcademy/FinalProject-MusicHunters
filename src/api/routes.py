"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Event, TicketsSource, PrecioTickets, Favoritos
from api.utils import generate_sitemap, APIException, validate_password, standard_date
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

#-------------------- RUTA DE OBTENER USUARIOS --------------------
@api.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    users = list(map(lambda user: user.serialize(), users))
    return jsonify(users), 200

#-------------------- RUTA DE OBTENER USUARIO POR ID --------------------
@api.route('/user/<int:id>', methods=['GET'])
def get_user(id):
    user = User.query.get(id)
    if user is None: 
        return jsonify({"msg": "User not found"}), 404

    return jsonify(user.serialize()), 200

#-------------------- RUTA DE EDIT USER --------------------
@api.route('/user/<int:id>', methods=['PUT'])
@jwt_required()
def edit_user(id):
    request_body = request.json
    user = User.query.get(id)
    if user is None:
        return jsonify({"msg": "User not found"}), 404

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
#-------------------- RUTA DE CREAR EVENTO --------------------
#           Se hace desde Python con la librerya asyncio
@api.route('/events', methods=['POST'])
def add_event():
    try:
        request_body = request.json
        print(request_body)
        
        if not isinstance(request_body, list):
            return jsonify({"msg": "Request body must be a list of events"}), 400

        for item in request_body:
            # if not all(key in item for key in ["name", "description", "date", "location", "event_type", "genere", "image_url", "tickets_source", "web_url", "price"]):
            #     return jsonify({"msg": "Missing required fields"}), 400

            event = Event()
            tickets_source = TicketsSource()
            precio_tickets = PrecioTickets()  

            event.create_new_event(
                name=item["title"],
                description="",
                date = standard_date(item["date"]),
                location=item["place"],
                event_type="concierto",
                genere=item["product_type"],
                image_url=item["image_url"]
            )

            db.session.add(event)
            db.session.commit()

            tickets_source.create_new_tickets_source(
                name=item["source"],
                web_url=item["buy_url"]
            )

            db.session.add(tickets_source)
            db.session.commit()

            precio_tickets.create_new_precio_ticket(
                event_id=event.id,
                source_id=tickets_source.id,
                price=item["price"]
            )
            db.session.add(precio_tickets)
            db.session.commit()
        
        return jsonify({"msg": "Events created successfully"}), 201

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"msg": "An error occurred while processing the request"}), 500

#-------------------- RUTA DE OBTENER EVENTOS --------------------
# @api.route('/events', methods=['GET'])
# def get_events():
#     events = Event.query.all()
#     events = list(map(lambda event: event.serialize(), events))
#     return jsonify(events), 200

@api.route('/events', methods=['GET'])
def get_events():
    events = Event.query.all()
    combined_events = {}

    def is_substring(str1, str2):
        str1 = str1.lower()
        str2 = str2.lower()
        return str1 in str2 or str2 in str1

    def find_matching_key(new_key, existing_keys):
        for key in existing_keys:
            if key[0] == new_key[0]:
                if is_substring(key[1], new_key[1]):
                    return key
        return None


    for event in events:
        # Usamos fecha y nombre como clave para agrupar los eventos
        key = (event.name)
        match_key= find_matching_key(key, combined_events.keys())
        if match_key:
            key = match_key


        if key not in combined_events:
            combined_events[key] = {
                'title': event.name,
                'date': event.date,
                'place': event.location,
                'genere': event.genere,
                'image_url': event.image_url,
                'prices': [event.precios[0].price],
                'buy_urls': [event.precios[0].source.web_url],
                'source': [event.precios[0].source.name]
            }
        else:
            combined_events[key]['prices'].append(event.precios[0].price)
            # combined_events[key]['buy_urls'].append(event.precios[0]['source']['web_url'])
            # combined_events[key]['source'].append(event.precios[0]['source']['name'])

    final_events = [
        {
            'title': details['title'],
            'date': details['date'],
            'place': details['place'],
            'genere': details['genere'],
            'image_url': details['image_url'],
            'price': ", ".join(details['prices']),
            # 'buy_url': ", ".join(details['buy_urls']),
            # 'source': ", ".join(details['source'])
        }
        for details in combined_events.values()
    ]

    return jsonify(final_events), 200

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

#-------------------- RUTA DE OBTENER EVENTOS POR FECHA --------------------
@api.route('/events/<date>', methods=['GET'])
def get_events_by_date(date):
    events = Event.query.filter_by(date=date).all()
    events = list(map(lambda event: event.serialize(), events))
    return jsonify(events), 200

######################## FAVORITES ########################
#-------------------- RUTA DE AGREGAR FAVORITO --------------------
@api.route('/favorites', methods=['POST'])
@jwt_required()
def add_favorite():
    request_body = request.json
    user = User.query.get(get_jwt_identity())

    if not isinstance(request_body, list):
        return jsonify({"msg": "Request body must be a list of events"}), 400

    for item in request_body:
        event = Event.query.get(item["event_id"])
        if event is None:
            return jsonify({"msg": "Event not found"}), 404

        favorite = Favoritos()
        favorite.create_new_favorite(
            user_id=user.id,
            event_id=event.id
        )

        db.session.add(favorite)
        db.session.commit()

    return jsonify({"msg": "Favorites added successfully"}), 201
