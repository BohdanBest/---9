import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, LogIn, UserPlus, KeyRound, Loader2, Sparkles } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, register } = useAuth();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (tab === 'login') {
      const res = await login(username, password);
      setLoading(false);
      if (res.success) {
        onClose();
      } else {
        setError(res.error || 'Помилка авторизації');
      }
    } else {
      const res = await register(username, password, email || undefined);
      setLoading(false);
      if (res.success) {
        onClose();
      } else {
        setError(res.error || 'Помилка реєстрації');
      }
    }
  };

  const handleFillDemoAdmin = () => {
    setUsername('admin');
    setPassword('admin123');
    setTab('login');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-dialog"
        style={{ maxWidth: '440px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <KeyRound size={20} color="#e5b36a" />
            <h2 className="modal-title">
              {tab === 'login' ? 'Авторизація' : 'Реєстрація користувача'}
            </h2>
          </div>
          <button type="button" className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Tabs */}
          <div
            style={{
              display: 'flex',
              background: 'rgba(255,255,255,0.04)',
              borderRadius: '8px',
              padding: '4px',
              marginBottom: '1.5rem',
            }}
          >
            <button
              type="button"
              style={{
                flex: 1,
                padding: '0.55rem',
                borderRadius: '6px',
                fontSize: '0.88rem',
                fontWeight: 600,
                background: tab === 'login' ? '#e5b36a' : 'transparent',
                color: tab === 'login' ? '#0b0b0e' : '#a1a1aa',
                transition: 'all 0.2s',
              }}
              onClick={() => {
                setTab('login');
                setError(null);
              }}
            >
              Вхід
            </button>
            <button
              type="button"
              style={{
                flex: 1,
                padding: '0.55rem',
                borderRadius: '6px',
                fontSize: '0.88rem',
                fontWeight: 600,
                background: tab === 'register' ? '#e5b36a' : 'transparent',
                color: tab === 'register' ? '#0b0b0e' : '#a1a1aa',
                transition: 'all 0.2s',
              }}
              onClick={() => {
                setTab('register');
                setError(null);
              }}
            >
              Новий акаунт
            </button>
          </div>

          {error && (
            <div
              style={{
                background: 'rgba(200, 67, 67, 0.15)',
                color: '#ff7878',
                padding: '0.75rem 1rem',
                borderRadius: '6px',
                border: '1px solid rgba(200, 67, 67, 0.3)',
                marginBottom: '1.2rem',
                fontSize: '0.85rem',
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Логін (Username)</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  className="input-control"
                  placeholder="Введіть ваш логін"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            {tab === 'register' && (
              <div className="form-group">
                <label>Email (опціонально)</label>
                <input
                  type="email"
                  className="input-control"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            )}

            <div className="form-group">
              <label>Пароль</label>
              <input
                type="password"
                className="input-control"
                placeholder="Мінімум 6 символів"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '1rem' }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin-slow" />
                  <span>Перевірка...</span>
                </>
              ) : tab === 'login' ? (
                <>
                  <LogIn size={16} />
                  <span>Увійти в систему</span>
                </>
              ) : (
                <>
                  <UserPlus size={16} />
                  <span>Зареєструватися</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Helper */}
          <div
            style={{
              marginTop: '1.5rem',
              paddingTop: '1rem',
              borderTop: '1px solid rgba(255,255,255,0.08)',
              textAlign: 'center',
            }}
          >
            <button
              type="button"
              onClick={handleFillDemoAdmin}
              style={{
                fontSize: '0.8rem',
                color: '#e5b36a',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                background: 'rgba(229, 179, 106, 0.08)',
                padding: '0.35rem 0.8rem',
                borderRadius: '4px',
                border: '1px dashed rgba(229, 179, 106, 0.3)',
              }}
            >
              <Sparkles size={13} />
              <span>Заповнити тестовий акаунт (admin / admin123)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
