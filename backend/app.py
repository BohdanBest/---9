import os
import sys
import json
import uuid
from werkzeug.utils import secure_filename
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from flask_login import login_user, logout_user, login_required, current_user

backend_dir = os.path.abspath(os.path.dirname(__file__))
root_dir = os.path.abspath(os.path.join(backend_dir, '..'))
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

try:
    from .database import db, login_manager
    from .models import User, Album
except (ImportError, ValueError):
    try:
        from backend.database import db, login_manager
        from backend.models import User, Album
    except ImportError:
        from database import db, login_manager
        from models import User, Album

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def create_app():
    app = Flask(__name__)
    basedir = os.path.abspath(os.path.dirname(__file__))

    # Створення директорій для БД та завантажень
    instance_path = os.path.join(basedir, 'instance')
    upload_path = os.path.join(basedir, 'uploads')
    os.makedirs(instance_path, exist_ok=True)
    os.makedirs(upload_path, exist_ok=True)

    # Налаштування БД (Підтримка SQLite локально та PostgreSQL на Render/Heroku)
    db_uri = os.environ.get('DATABASE_URL', f"sqlite:///{os.path.join(instance_path, 'bielousova.db')}")
    if db_uri.startswith("postgres://"):
        db_uri = db_uri.replace("postgres://", "postgresql://", 1)

    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'lyuda-bielousova-super-secret-key-2026')
    app.config['SQLALCHEMY_DATABASE_URI'] = db_uri
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['UPLOAD_FOLDER'] = upload_path
    app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16 MB max
    app.config['SESSION_COOKIE_HTTPONLY'] = True
    app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'

    db.init_app(app)
    login_manager.init_app(app)

    CORS(app, supports_credentials=True, origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5000",
        "http://127.0.0.1:5000"
    ])

    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))

    @login_manager.unauthorized_handler
    def unauthorized():
        return jsonify({'error': 'Потрібна авторизація для виконання цієї дії'}), 401

    @app.route('/uploads/<filename>')
    def uploaded_file(filename):
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

    @app.route('/api/auth/register', methods=['POST'])
    def register():
        data = request.get_json() or {}
        username = (data.get('username') or '').strip()
        password = (data.get('password') or '').strip()
        email = (data.get('email') or '').strip() or None

        if not username or not password:
            return jsonify({'error': "Ім'я користувача та пароль є обов'язковими"}), 400

        if len(username) < 3:
            return jsonify({'error': "Ім'я користувача повинно містити мінімум 3 символи"}), 400

        if len(password) < 6:
            return jsonify({'error': "Пароль повинен містити мінімум 6 символів"}), 400

        if User.query.filter_by(username=username).first():
            return jsonify({'error': f"Користувач із логіном '{username}' вже існує"}), 409

        if email and User.query.filter_by(email=email).first():
            return jsonify({'error': f"Користувач з email '{email}' вже існує"}), 409

        user = User(username=username, email=email)
        user.set_password(password)
        db.session.add(user)
        db.session.commit()

        login_user(user, remember=True)
        return jsonify({
            'message': 'Реєстрація успішна',
            'user': user.to_dict()
        }), 201

    @app.route('/api/auth/login', methods=['POST'])
    def login():
        data = request.get_json() or {}
        username = (data.get('username') or '').strip()
        password = (data.get('password') or '').strip()

        if not username or not password:
            return jsonify({'error': "Введіть логін та пароль"}), 400

        user = User.query.filter_by(username=username).first()
        if not user or not user.check_password(password):
            return jsonify({'error': 'Невірний логін або пароль'}), 401

        login_user(user, remember=True)
        return jsonify({
            'message': 'Авторизація успішна',
            'user': user.to_dict()
        }), 200

    @app.route('/api/auth/logout', methods=['POST'])
    def logout():
        if current_user.is_authenticated:
            logout_user()
        return jsonify({'message': 'Ви успішно вийшли з системи'}), 200

    @app.route('/api/auth/me', methods=['GET'])
    def current_auth_user():
        if current_user.is_authenticated:
            return jsonify({
                'authenticated': True,
                'user': current_user.to_dict()
            }), 200
        return jsonify({
            'authenticated': False,
            'user': None
        }), 200

    @app.route('/api/albums', methods=['GET'])
    def get_albums():
        albums = Album.query.order_by(Album.release_year.desc(), Album.id.desc()).all()
        return jsonify([album.to_dict() for album in albums]), 200

    @app.route('/api/albums/<int:album_id>', methods=['GET'])
    def get_album(album_id):
        album = Album.query.get_or_404(album_id)
        return jsonify(album.to_dict()), 200

    def _process_album_data():
        if request.is_json:
            data = request.get_json() or {}
            cover_url = data.get('cover_url')
            title = data.get('title')
            artist = data.get('artist', 'Lyuda Bielousova')
            release_year = data.get('release_year')
            genre = data.get('genre', 'Indie Rock / Alternative')
            description = data.get('description', '')
            spotify_url = data.get('spotify_url', '')
            apple_music_url = data.get('apple_music_url', '')
            tracklist = data.get('tracklist', [])
        else:
            title = request.form.get('title')
            artist = request.form.get('artist', 'Lyuda Bielousova')
            release_year = request.form.get('release_year')
            genre = request.form.get('genre', 'Indie Rock / Alternative')
            description = request.form.get('description', '')
            spotify_url = request.form.get('spotify_url', '')
            apple_music_url = request.form.get('apple_music_url', '')
            cover_url = request.form.get('cover_url')

            raw_tracklist = request.form.get('tracklist', '[]')
            try:
                tracklist = json.loads(raw_tracklist) if isinstance(raw_tracklist, str) else []
            except Exception:
                tracklist = []

            # Перевірка на завантажений файл обкладинки
            if 'cover_file' in request.files:
                file = request.files['cover_file']
                if file and file.filename and allowed_file(file.filename):
                    filename = secure_filename(file.filename)
                    unique_filename = f"{uuid.uuid4().hex[:10]}_{filename}"
                    file.save(os.path.join(app.config['UPLOAD_FOLDER'], unique_filename))
                    cover_url = f"/uploads/{unique_filename}"

        return {
            'title': (title or '').strip(),
            'artist': (artist or '').strip(),
            'release_year': int(str(release_year)) if str(release_year).isdigit() else None,
            'genre': (genre or '').strip(),
            'description': (description or '').strip(),
            'cover_url': cover_url,
            'spotify_url': (spotify_url or '').strip(),
            'apple_music_url': (apple_music_url or '').strip(),
            'tracklist': tracklist
        }

    @app.route('/api/albums', methods=['POST'])
    @login_required
    def create_album():
        try:
            fields = _process_album_data()
        except Exception as e:
            return jsonify({'error': f'Помилка обробки запиту: {str(e)}'}), 400

        if not fields['title']:
            return jsonify({'error': 'Назва альбому є обов’язковою'}), 400
        if not fields['release_year']:
            return jsonify({'error': 'Вкажіть коректний рік релізу'}), 400

        album = Album(
            title=fields['title'],
            artist=fields['artist'] or 'Lyuda Bielousova',
            release_year=fields['release_year'],
            genre=fields['genre'] or 'Indie Rock',
            description=fields['description'],
            cover_url=fields['cover_url'],
            spotify_url=fields['spotify_url'],
            apple_music_url=fields['apple_music_url'],
            user_id=current_user.id
        )
        album.tracklist = fields['tracklist']

        db.session.add(album)
        db.session.commit()
        return jsonify({
            'message': 'Альбом успішно додано',
            'album': album.to_dict()
        }), 201

    @app.route('/api/albums/<int:album_id>', methods=['PUT'])
    @login_required
    def update_album(album_id):
        album = Album.query.get_or_404(album_id)

        try:
            fields = _process_album_data()
        except Exception as e:
            return jsonify({'error': f'Помилка обробки запиту: {str(e)}'}), 400

        if not fields['title']:
            return jsonify({'error': 'Назва альбому є обов’язковою'}), 400
        if not fields['release_year']:
            return jsonify({'error': 'Вкажіть коректний рік релізу'}), 400

        album.title = fields['title']
        if fields['artist']:
            album.artist = fields['artist']
        album.release_year = fields['release_year']
        album.genre = fields['genre']
        album.description = fields['description']
        if fields['cover_url']:
            album.cover_url = fields['cover_url']
        album.spotify_url = fields['spotify_url']
        album.apple_music_url = fields['apple_music_url']
        album.tracklist = fields['tracklist']

        db.session.commit()
        return jsonify({
            'message': 'Альбом успішно оновлено',
            'album': album.to_dict()
        }), 200

    @app.route('/api/albums/<int:album_id>', methods=['DELETE'])
    @login_required
    def delete_album(album_id):
        album = Album.query.get_or_404(album_id)
        db.session.delete(album)
        db.session.commit()
        return jsonify({'message': f'Альбом "{album.title}" успішно видалено'}), 200

    frontend_dist = os.path.abspath(os.path.join(basedir, '..', 'frontend', 'dist'))

    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve_frontend(path):
        if os.path.exists(frontend_dist):
            target_path = os.path.join(frontend_dist, path)
            if path and os.path.exists(target_path) and os.path.isfile(target_path):
                return send_from_directory(frontend_dist, path)
            return send_from_directory(frontend_dist, 'index.html')
        return jsonify({
            'message': 'API сервера працює успішно. Зберіть фронтенд за допомогою `npm run build` або запустіть Vite dev server.'
        }), 200

    return app

if __name__ == '__main__':
    application = create_app()
    with application.app_context():
        db.create_all()
    application.run(host='0.0.0.0', port=5000, debug=True)

