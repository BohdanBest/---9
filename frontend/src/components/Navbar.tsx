import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogIn, LogOut, Plus, User as UserIcon, Menu, X } from 'lucide-react';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onOpenAuth: () => void;
  onOpenAddAlbum: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  onOpenAuth,
  onOpenAddAlbum,
}) => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Головна' },
    { id: 'albums', label: 'Дискографія' },
    { id: 'history', label: 'Історія гурту' },
    { id: 'about', label: 'Про проект' },
  ];

  const handleNavClick = (pageId: string) => {
    onNavigate(pageId);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="container nav-inner">
        {/* Brand / Logo */}
        <div
          className="nav-brand"
          style={{ cursor: 'pointer' }}
          onClick={() => handleNavClick('home')}
        >
          <div className="brand-monogram">LB</div>
          <div className="brand-text">
            <span className="brand-name">LYUDA BIELOUSOVA</span>
            <span className="brand-sub">Official Web Space</span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <ul className="nav-links">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                className={`nav-link ${currentPage === item.id ? 'active' : ''}`}
                onClick={() => handleNavClick(item.id)}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>

        {/* Desktop User Actions */}
        <div className="nav-actions">
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={onOpenAddAlbum}
                title="Додати новий альбом"
              >
                <Plus size={16} />
                <span className="desktop-only">Новий альбом</span>
              </button>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.35rem 0.75rem',
                  background: 'rgba(255,255,255,0.06)',
                  borderRadius: '20px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  fontSize: '0.82rem',
                }}
              >
                <UserIcon size={14} color="#e5b36a" />
                <span style={{ color: '#fff', fontWeight: 600 }}>{user.username}</span>
              </div>

              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={logout}
                title="Вийти з системи"
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={onOpenAuth}
            >
              <LogIn size={15} />
              <span>Авторизація</span>
            </button>
          )}

          {/* Mobile hamburger button */}
          <button
            type="button"
            className="mobile-toggle"
            style={{
              display: 'none',
              color: '#fff',
              padding: '0.4rem',
            }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div
          style={{
            background: '#101015',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              style={{
                textAlign: 'left',
                fontSize: '1.05rem',
                color: currentPage === item.id ? '#e5b36a' : '#fff',
                padding: '0.5rem 0',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
              }}
              onClick={() => handleNavClick(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};
