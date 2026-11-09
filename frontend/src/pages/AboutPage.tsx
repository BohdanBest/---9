import React from 'react';
import { Code2, Server, Database, ShieldCheck, Sparkles } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="about-page" style={{ padding: '3rem 0 6rem 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ maxWidth: '800px', marginBottom: '4rem' }}>
          <span className="section-tag">
            <Sparkles size={13} />
            Архітектура та концепція
          </span>
          <h1 style={{ fontSize: '3rem', lineHeight: '1.15', marginBottom: '1.2rem' }}>
            ПРО ПРОЕКТ
          </h1>
          <p style={{ color: '#a1a1aa', fontSize: '1.1rem', lineHeight: '1.7' }}>
            Даний веб-додаток розроблено в рамках <strong>Лабораторної роботи №9</strong> з дисципліни 
            «Fullstack розробка» та присвячено творчості української виконавиці <strong>Lyuda Bielousova</strong>.
          </p>
        </div>

        {/* Technical Architecture Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem',
            marginBottom: '4rem',
          }}
        >
          {/* Backend Stack */}
          <div
            style={{
              background: 'rgba(22, 22, 28, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              padding: '2rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.2rem' }}>
              <Server size={24} color="#e5b36a" />
              <h3 style={{ fontSize: '1.35rem', color: '#fff' }}>Backend (Flask API)</h3>
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.8rem', color: '#a1a1aa', fontSize: '0.92rem' }}>
              <li>• <strong>Flask 3.1</strong> — маршрутизація, обробка REST API запитів.</li>
              <li>• <strong>Flask-SQLAlchemy</strong> — ORM моделі User та Album.</li>
              <li>• <strong>Flask-Login</strong> — захист маршрутів, сесійна аутентифікація.</li>
              <li>• <strong>Werkzeug Security</strong> — безпечне PBKDF2/SHA256 хешування паролів.</li>
              <li>• <strong>Gunicorn</strong> — production WSGI сервер під Heroku/Render.</li>
            </ul>
          </div>

          {/* Frontend Stack */}
          <div
            style={{
              background: 'rgba(22, 22, 28, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              padding: '2rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.2rem' }}>
              <Code2 size={24} color="#e5b36a" />
              <h3 style={{ fontSize: '1.35rem', color: '#fff' }}>Frontend (Client SPA)</h3>
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.8rem', color: '#a1a1aa', fontSize: '0.92rem' }}>
              <li>• <strong>React 19 + TypeScript</strong> — строга типізація, реактивний інтерфейс.</li>
              <li>• <strong>Sass (SCSS)</strong> — компонентна модульна стилізація, темна інді-тема.</li>
              <li>• <strong>Vite 6</strong> — швидка збірка, HMR та проксі для API.</li>
              <li>• <strong>Editorial Design</strong> — шрифти Cinzel & Playfair Display, мікроанімації вінілу.</li>
              <li>• <strong>Lucide Icons</strong> — легка векторна графіка інтерфейсу.</li>
            </ul>
          </div>

          {/* Database & Storage */}
          <div
            style={{
              background: 'rgba(22, 22, 28, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              padding: '2rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.2rem' }}>
              <Database size={24} color="#e5b36a" />
              <h3 style={{ fontSize: '1.35rem', color: '#fff' }}>База даних & Медіа</h3>
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.8rem', color: '#a1a1aa', fontSize: '0.92rem' }}>
              <li>• <strong>SQLite</strong> — локальна база даних у середовищі розробки.</li>
              <li>• <strong>PostgreSQL</strong> — автоматична підтримка при деплої на Render.</li>
              <li>• <strong>Комбіноване збереження</strong> — підтримка зовнішніх URL або завантаження файлів обкладинок (Multipart form-data).</li>
              <li>• <strong>JSON Tracklists</strong> — збереження динамічних треклістів із тривалістю.</li>
            </ul>
          </div>
        </div>

        {/* Demo Credentials Box */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(229, 179, 106, 0.1) 0%, rgba(20, 20, 26, 0.8) 100%)',
            border: '1px solid rgba(229, 179, 106, 0.3)',
            borderRadius: '12px',
            padding: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.5rem',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
              <ShieldCheck size={20} color="#e5b36a" />
              <h4 style={{ fontSize: '1.2rem', color: '#fff' }}>
                Тестові дані для перевірки авторизації
              </h4>
            </div>
            <p style={{ color: '#a1a1aa', fontSize: '0.92rem' }}>
              Для тестування CRUD-операцій (створення, редагування та видалення альбомів) в системі попередньо створено обліковий запис:
            </p>
          </div>

          <div
            style={{
              background: '#0e0e13',
              padding: '0.8rem 1.4rem',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.1)',
              fontFamily: 'monospace',
              fontSize: '0.95rem',
            }}
          >
            <div>Логін: <span style={{ color: '#e5b36a' }}>admin</span></div>
            <div>Пароль: <span style={{ color: '#e5b36a' }}>admin123</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};
