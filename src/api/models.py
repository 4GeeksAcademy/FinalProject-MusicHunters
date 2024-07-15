from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt

db = SQLAlchemy()
bcrypt = Bcrypt()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(120), unique=True, nullable=False)  # Campo requerido
    email = db.Column(db.String(120), unique=True, nullable=False)     # Campo requerido
    password = db.Column(db.String(200), nullable=False)                # Campo requerido
    name = db.Column(db.String(120), nullable=True)                    # Campo opcional
    last_name = db.Column(db.String(120), nullable=True)               # Campo opcional
    phone = db.Column(db.String(120), nullable=True)                   # Campo opcional
    address = db.Column(db.String(120), nullable=True)                 # Campo opcional
    profile_picture = db.Column(db.String(120), nullable=True)         # Campo opcional

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
            # No se serializa la contraseña por razones de seguridad
        }
