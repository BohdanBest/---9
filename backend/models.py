from typing import Optional, List, Dict, Any
from datetime import datetime
import json
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin

try:
    from .database import db
except (ImportError, ValueError):
    try:
        from backend.database import db
    except ImportError:
        from database import db


class User(UserMixin, db.Model):
    __tablename__ = 'users'
    __allow_unmapped__ = True

    id: Any = db.Column(db.Integer, primary_key=True)
    username: Any = db.Column(db.String(80), unique=True, nullable=False, index=True)
    email: Any = db.Column(db.String(120), unique=True, nullable=True)
    password_hash: Any = db.Column(db.String(255), nullable=False)
    created_at: Any = db.Column(db.DateTime, default=datetime.utcnow)

    albums: Any = db.relationship('Album', backref='author', lazy=True)

    def __init__(self, username: str, email: Optional[str] = None, **kwargs: Any):
        super().__init__(**kwargs)
        self.username = username
        self.email = email

    def set_password(self, password: str) -> None:
        self.password_hash = generate_password_hash(password)

    def check_password(self, password: str) -> bool:
        return check_password_hash(self.password_hash, password)

    def to_dict(self) -> Dict[str, Any]:
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class Album(db.Model):
    __tablename__ = 'albums'
    __allow_unmapped__ = True

    id: Any = db.Column(db.Integer, primary_key=True)
    title: Any = db.Column(db.String(150), nullable=False)
    artist: Any = db.Column(db.String(100), default='Lyuda Bielousova', nullable=False)
    release_year: Any = db.Column(db.Integer, nullable=False)
    genre: Any = db.Column(db.String(80), default='Indie Rock / Alternative Pop')
    description: Any = db.Column(db.Text, nullable=True)
    cover_url: Any = db.Column(db.String(500), nullable=True)
    spotify_url: Any = db.Column(db.String(500), nullable=True)
    apple_music_url: Any = db.Column(db.String(500), nullable=True)
    tracklist_json: Any = db.Column(db.Text, default='[]')
    created_at: Any = db.Column(db.DateTime, default=datetime.utcnow)
    user_id: Any = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)

    author: Optional[User] = None

    def __init__(
        self,
        title: str,
        release_year: int,
        artist: str = 'Lyuda Bielousova',
        genre: str = 'Indie Rock / Alternative Pop',
        description: Optional[str] = None,
        cover_url: Optional[str] = None,
        spotify_url: Optional[str] = None,
        apple_music_url: Optional[str] = None,
        user_id: Optional[int] = None,
        **kwargs: Any
    ):
        super().__init__(**kwargs)
        self.title = title
        self.artist = artist
        self.release_year = release_year
        self.genre = genre
        self.description = description
        self.cover_url = cover_url
        self.spotify_url = spotify_url
        self.apple_music_url = apple_music_url
        self.user_id = user_id

    @property
    def tracklist(self) -> List[Dict[str, Any]]:
        try:
            return json.loads(self.tracklist_json) if self.tracklist_json else []
        except Exception:
            return []

    @tracklist.setter
    def tracklist(self, value: Any) -> None:
        if isinstance(value, list):
            self.tracklist_json = json.dumps(value, ensure_ascii=False)
        elif isinstance(value, str):
            self.tracklist_json = value
        else:
            self.tracklist_json = '[]'

    def to_dict(self) -> Dict[str, Any]:
        author_name = self.author.username if self.author else 'System'
        return {
            'id': self.id,
            'title': self.title,
            'artist': self.artist,
            'release_year': self.release_year,
            'genre': self.genre,
            'description': self.description,
            'cover_url': self.cover_url,
            'spotify_url': self.spotify_url,
            'apple_music_url': self.apple_music_url,
            'tracklist': self.tracklist,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'author_username': author_name
        }
