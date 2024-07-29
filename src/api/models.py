from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from sqlalchemy import Column, Integer, String, ForeignKey, Enum
import enum

db=SQLAlchemy()
bcrypt = Bcrypt()

class EventType(enum.Enum):
    concierto = "concierto"
    festival = "festival"


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(120), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    name = db.Column(db.String(120), nullable=True)
    last_name = db.Column(db.String(120), nullable=True)
    phone = db.Column(db.String(120), nullable=True)
    address = db.Column(db.String(120), nullable=True)
    profile_picture = db.Column(db.String(120), nullable=True)

    favoritos = db.relationship('Favoritos', backref='user', lazy=True)

    def __repr__(self):
        return f'<User {self.email}>'

    def generate_password_hash(self, password):
        return bcrypt.generate_password_hash(password).decode('utf-8')

    def verify_password(self, password):
        return bcrypt.check_password_hash(self.password, password)

    def create_new_user(self, email, password, username, name=None, last_name=None, phone=None, address=None, profile_picture=None):
        self.email = email
        self.password = self.generate_password_hash(password)
        self.username = username
        self.name = name
        self.last_name = last_name
        self.phone = phone
        self.address = address
        self.profile_picture = profile_picture

        db.session.add(self)
        db.session.commit()

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "username": self.username,
            "name": self.name,
            "last_name": self.last_name,
            "phone": self.phone,
            "address": self.address,
            "profile_picture": self.profile_picture
        }


class Event(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    description = db.Column(db.String(200), nullable=True)
    date = db.Column(db.String(120), nullable=False)
    location = db.Column(db.String(120), nullable=False)
    event_type = db.Column(db.Enum(EventType), nullable=False)
    genere = db.Column(db.String(120), nullable=False)
    image_url = db.Column(db.String(250), nullable=True)

    favoritos = db.relationship('Favoritos', backref='event', lazy=True)
    precios = db.relationship('PrecioTickets', backref='event', lazy=True)

    def __repr__(self):
        return f'<Event {self.name}>'

    def create_new_event(self, name, description, date, location, event_type, genere, image_url):
        self.name = name
        self.description = description
        self.date = date
        self.location = location
        self.event_type = event_type
        self.genere = genere
        self.image_url = image_url

        db.session.add(self)
        db.session.commit()

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "date": self.date,
            "location": self.location,
            "event_type": self.event_type.value,
            "genere": self.genere,          
            "precios": [precio.serialize() for precio in self.precios],
            "image_url":self.image_url
        }


class TicketsSource(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(250), nullable=False)
    web_url = db.Column(db.String(250), nullable=False)

    precios = db.relationship('PrecioTickets', backref='source', lazy=True)

    def __repr__(self):
        return f'<TicketsSource {self.name}>'

    def create_new_tickets_source(self, name, web_url):
        self.name = name
        self.web_url = web_url

        db.session.add(self)
        db.session.commit()

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "web_url": self.web_url
        }


class PrecioTickets(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    event_id = db.Column(db.Integer, db.ForeignKey('event.id'), nullable=False)
    source_id = db.Column(db.Integer, db.ForeignKey('tickets_source.id'), nullable=False)
    price = db.Column(db.String, nullable=False)
    # url = db.Column(db.String(250), nullable=False)

    def __repr__(self):
        return f'<PrecioTickets {self.price}>'

    def create_new_precio_ticket(self, event_id, source_id, price):
        if event_id is None or source_id is None:
            raise ValueError("Event ID and Source ID cannot be null")
        self.event_id = event_id
        self.source_id = source_id
        self.price = price
        # self.url = url

        db.session.add(self)
        db.session.commit()

    def serialize(self):
        return {
            "id": self.id,
            "price": self.price,
            # # "url": self.url,
            "source": self.source.serialize()  # Incluye la información de la fuente de tickets
        }

class Favoritos(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    event_id = db.Column(db.Integer, db.ForeignKey('event.id'), nullable=False)

    def __repr__(self):
        return f'<Favoritos {self.id}>'

    def create_new_favorito(self, user_id, event_id):
        self.user_id = user_id
        self.event_id = event_id

        db.session.add(self)
        db.session.commit()

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "event_id": self.event_id
        }
