import sys
import os

backend_dir = os.path.abspath(os.path.dirname(__file__))
root_dir = os.path.abspath(os.path.join(backend_dir, '..'))
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

try:
    from backend.database import db
    from backend.models import User, Album
except ImportError:
    from database import db
    from models import User, Album

def seed_database():
    admin = User.query.filter_by(username='admin').first()
    if not admin:
        admin = User(username='admin', email='admin@bielousova.music')
        admin.set_password('admin123')
        db.session.add(admin)
        db.session.commit()
        print("✓ Користувача 'admin' успішно створено (пароль: admin123)")
    else:
        print("✓ Користувач 'admin' вже існує")

    if Album.query.count() > 0:
        print("✓ Альбоми вже присутні в базі даних, пропуск наповнення.")
        return

    albums_data = [
        {
            "title": "РЕТРОспектива",
            "artist": "Lyuda Bielousova",
            "release_year": 2024,
            "genre": "Indie Rock / Alternative Pop",
            "description": "Перша масштабна платівка за два роки та дебютний реліз під власним іменем Lyuda Bielousova (екс-Lely45). Альбом являє собою глибоке доросле переосмислення плину часу, реальності війни та збереження власного внутрішнього світла. Знаковий трек — «Переслідувати час».",
            "cover_url": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=80",
            "spotify_url": "https://open.spotify.com/artist/3S2ZPs0ccEwknZLPQDbGSw",
            "apple_music_url": "https://music.apple.com",
            "tracklist": [
                {"number": 1, "title": "Переслідувати час", "duration": "3:18"},
                {"number": 2, "title": "Ретроспектива", "duration": "3:42"},
                {"number": 3, "title": "Тіні старого міста", "duration": "2:54"},
                {"number": 4, "title": "Забутий діалог", "duration": "3:20"},
                {"number": 5, "title": "Дзеркала", "duration": "3:05"},
                {"number": 6, "title": "Не відпускай", "duration": "4:02"},
                {"number": 7, "title": "Тиша після бурі", "duration": "3:35"}
            ]
        },
        {
            "title": "Всі дівчата хороші",
            "artist": "Lely45 (LB Era)",
            "release_year": 2023,
            "genre": "Indie Pop / Post-Punk",
            "description": "Концептуальний альбом-маніфест, що розкриває жіночу силу, ранимість та право бути собою без огляду на суспільні очікування. Драйвовий гітарний звук у поєднанні з фірмовим хрипким вокалом.",
            "cover_url": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1000&q=80",
            "spotify_url": "https://open.spotify.com/artist/3S2ZPs0ccEwknZLPQDbGSw",
            "apple_music_url": "https://music.apple.com",
            "tracklist": [
                {"number": 1, "title": "Всі дівчата хороші", "duration": "2:48"},
                {"number": 2, "title": "Хто тут головний", "duration": "3:12"},
                {"number": 3, "title": "Нічні дзвінки", "duration": "2:59"},
                {"number": 4, "title": "Червона помада", "duration": "3:25"},
                {"number": 5, "title": "Сльози на танцполі", "duration": "3:04"}
            ]
        },
        {
            "title": "Коли сонце сідає за схил",
            "artist": "Lely45 (LB Era)",
            "release_year": 2022,
            "genre": "Indie Rock / War Poetry",
            "description": "Платівка, написана під час перших місяців повномасштабного вторгнення. Це літопис болю, незламності, підтримки та віри у світанок після найтемнішої ночі. Пронизлива поезія та камерне живе звучання.",
            "cover_url": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1000&q=80",
            "spotify_url": "https://open.spotify.com/artist/3S2ZPs0ccEwknZLPQDbGSw",
            "apple_music_url": "https://music.apple.com",
            "tracklist": [
                {"number": 1, "title": "Коли сонце сідає за схил", "duration": "3:30"},
                {"number": 2, "title": "Поруч з тобою", "duration": "3:15"},
                {"number": 3, "title": "Моя душа", "duration": "3:45"},
                {"number": 4, "title": "Світанок", "duration": "2:58"},
                {"number": 5, "title": "Листи додому", "duration": "4:10"}
            ]
        },
        {
            "title": "Дівчинка на дискотеці",
            "artist": "Lely45 (LB Era)",
            "release_year": 2021,
            "genre": "Indie Pop / Synthwave",
            "description": "Культовий дебютний альбом, який відкрив співачку сотням тисяч слухачів. Драматичні ритми, психологізм та юнацький бунт проти сірості буденності. Золотий фонд українського інді-попу.",
            "cover_url": "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?auto=format&fit=crop&w=1000&q=80",
            "spotify_url": "https://open.spotify.com/artist/3S2ZPs0ccEwknZLPQDbGSw",
            "apple_music_url": "https://music.apple.com",
            "tracklist": [
                {"number": 1, "title": "Вісім", "duration": "3:02"},
                {"number": 2, "title": "Спробуй купи мене", "duration": "2:50"},
                {"number": 3, "title": "Дівчинка на дискотеці", "duration": "3:14"},
                {"number": 4, "title": "Холодні стіни", "duration": "3:22"},
                {"number": 5, "title": "Північ", "duration": "3:40"}
            ]
        },
        {
            "title": "Слухай моє серце",
            "artist": "Lely45 (LB Era)",
            "release_year": 2022,
            "genre": "Acoustic / Indie Soul",
            "description": "Акустично-електронний реліз, де кожна композиція звучить як особистий аудіо-щоденник та безкомпромісно відверта сповідь.",
            "cover_url": "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=1000&q=80",
            "spotify_url": "https://open.spotify.com/artist/3S2ZPs0ccEwknZLPQDbGSw",
            "apple_music_url": "https://music.apple.com",
            "tracklist": [
                {"number": 1, "title": "Слухай моє серце", "duration": "3:11"},
                {"number": 2, "title": "Твій голос", "duration": "2:45"},
                {"number": 3, "title": "Зорепад", "duration": "3:33"},
                {"number": 4, "title": "Крок у невідомість", "duration": "3:08"}
            ]
        }
    ]

    for data in albums_data:
        album = Album(
            title=data["title"],
            artist=data["artist"],
            release_year=data["release_year"],
            genre=data["genre"],
            description=data["description"],
            cover_url=data["cover_url"],
            spotify_url=data.get("spotify_url"),
            apple_music_url=data.get("apple_music_url"),
            user_id=admin.id
        )
        album.tracklist = data["tracklist"]
        db.session.add(album)

    db.session.commit()
    print(f"✓ Успішно додано {len(albums_data)} альбомів у дискографію.")

if __name__ == '__main__':
    try:
        from backend.app import create_app
    except ImportError:
        from app import create_app
    app = create_app()
    with app.app_context():
        db.create_all()
        seed_database()

