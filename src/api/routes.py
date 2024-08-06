"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Event, TicketsSource, PrecioTickets, Favoritos
from api.utils import generate_sitemap, APIException, validate_password, standard_date, get_formatted_events
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

# @api.route('/events', methods=['GET'])
# def get_events():
#     events = Event.query.all()
#     combined_events = {}

#     def is_substring(str1, str2):
#         str1 = str1.lower()
#         str2 = str2.lower()
#         return str1 in str2 or str2 in str1

#     def find_matching_key(new_key, existing_keys):
#         for key in existing_keys:
#             if key[0] == new_key[0]:
#                 if is_substring(key[1], new_key[1]):
#                     return key
#         return None


#     for event in events:
        
#         key = (event.name, event.date)
#         match_key= find_matching_key(key, combined_events.keys())
#         if match_key:
#             key = match_key


#         if key not in combined_events:
#             combined_events[key] = {
#                 'id': [event.id],
#                 'title': event.name,
#                 'date': event.date,
#                 'place': event.location,
#                 'genere': event.genere,
#                 'image_url': event.image_url,
#                 'prices': [event.precios[0].price],
#                 'buy_urls': [event.precios[0].source.web_url],
#                 'source': [event.precios[0].source.name]
#             }
#         else:
#             combined_events[key]['id'].append(event.id)
#             combined_events[key]['prices'].append(event.precios[0].price)
#             combined_events[key]['buy_urls'].append(event.precios[0].source.web_url)
#             combined_events[key]['source'].append(event.precios[0].source.name)

#     final_events = [
#         {
#             'id': ids[0],
#             'title': details['title'],
#             'date': details['date'],
#             'place': details['place'],
#             'genere': details['genere'],
#             'image_url': details['image_url'],
#             'price':details['prices'],
#             'buy_url': details['buy_urls'],
#             'source': details['source']
#         }
#         for ids, details in [(v['id'], v) for v in combined_events.values()]
#     ]

#     return jsonify(final_events), 200

@api.route('/events', methods=['GET'])
def get_events():
    events = Event.query.all()
    formatted_events = get_formatted_events(events)
    return jsonify(formatted_events), 200

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

    # Verificar que el cuerpo de la solicitud contiene los campos necesarios
    user_id = request_body.get("user_id")
    event_id = request_body.get("event_id")

    if user_id is None or event_id is None:
        return jsonify({"msg": "Request body must contain 'user_id' and 'event_id'"}), 400


    # Obtener el usuario y el evento desde la base de datos
    user = User.query.get(user_id)
    event = Event.query.get(event_id)
    
    if user is None:
        return jsonify({"msg": "User not found"}), 404

    if event is None:
        return jsonify({"msg": "Event not found"}), 404

    # Verificar si el favorito ya existe para evitar duplicados
    existing_favorite = Favoritos.query.filter_by(user_id=user.id, event_id=event.id).first()
    if existing_favorite:
        return jsonify({"msg": "Event is already in favorites"}), 400

    # Crear nuevo favorito y agregarlo a la base de datos
    favorite = Favoritos(user_id=user.id, event_id=event.id)
    db.session.add(favorite)
    db.session.commit()

    return jsonify({"msg": "Favorite added successfully"}), 201

#-------------------- RUTA DE OBTENER FAVORITOS --------------------

# @api.route('/favorites', methods=['GET'])
# @jwt_required()
# def get_favorites():
#     user_id = get_jwt_identity().get('id')
#     user = User.query.get(user_id)
#     if user is None:
#         return jsonify({"msg": "User not found"}), 404

#     favorites = Favoritos.query.filter_by(user_id=user.id).all()

#     if not favorites:
#         return jsonify([]), 200 
    
#     event_id= [favorite.event_id for favorite in favorites]

#     events = Event.query.filter(Event.id.in_(event_id)).all()
#     events = list(map(lambda event: event.serialize(), events))
#     return jsonify(events), 200

# @api.route('/favorites', methods=['GET'])
# @jwt_required()
# def get_favorites():
#     user_id = get_jwt_identity().get('id')
#     user = User.query.get(user_id)
#     if user is None:
#         return jsonify({"msg": "User not found"}), 404

#     favorite_events_ids = {fav.event_id for fav in Favoritos.query.filter_by(user_id=user.id).all()}
#     if not favorite_events_ids:
#         return jsonify([]), 200
    
#     all_events = Event.query.all()
    
#     formatted_all_events = get_formatted_events(all_events)

#     favorite_events = [event for event in formatted_all_events if event['id'] in favorite_events_ids]

#     return jsonify(favorite_events), 200
@api.route('/favorites', methods=['GET'])
@jwt_required()
def get_favorites():
    user_id = get_jwt_identity().get('id')
    user = User.query.get(user_id)
    if user is None:
        return jsonify({"msg": "User not found"}), 404

    favoritos = Favoritos.query.filter_by(user_id=user.id).all()
    if not favoritos:
        return jsonify([]), 200
    
    favorite_events_ids = {fav.event_id for fav in favoritos}
    all_events = Event.query.all()
    
    formatted_all_events = get_formatted_events(all_events)

    # Crear un diccionario para obtener el ID del favorito por event_id
    favorite_events_dict = {fav.event_id: fav.id for fav in favoritos}
    
    # Incluir el ID del favorito y el user_id en la respuesta
    favorite_events = []
    for event in formatted_all_events:
        if event['id'] in favorite_events_ids:
            event_with_fav_id = event.copy()  # Crear una copia del evento para no modificar el original
            event_with_fav_id['favorite_id'] = favorite_events_dict[event['id']]
            event_with_fav_id['user_id'] = user.id  # Incluir el user_id
            favorite_events.append(event_with_fav_id)

    return jsonify(favorite_events), 200


#-------------------- RUTA DE ELIMINAR FAVORITO --------------------
@api.route('/favorite/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_favorite(id):
    favorite = Favoritos.query.get(id)
    if favorite is None:
        return jsonify({"msg": "Favorite not found"}), 404

    db.session.delete(favorite)
    db.session.commit()

    return jsonify({"msg": "Favorite deleted"}), 200
