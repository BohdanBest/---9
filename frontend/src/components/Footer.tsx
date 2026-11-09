import React from 'react';
import { Disc3, Heart, ExternalLink } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-inner">
          <div className="footer-brand">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.8rem' }}>
              <Disc3 size={22} color="#e5b36a" />
              <span className="f-title" style={{ margin: 0 }}>LYUDA BIELOUSOVA</span>
            </div>
            <p className="f-desc">
              Музичний простір української авторки та співачки Lyuda Bielousova (екс-Lely45). 
              Глибокий інді-рок, екзистенційна поезія та щире переосмислення буття.
            </p>
          </div>

          <div className="footer-links">
            <h4>Навігація</h4>
            <ul>
              <li>
                <a href="#home" onClick={(e) => { e.preventDefault(); onNavigate('home'); }}>Головна</a>
              </li>
              <li>
                <a href="#albums" onClick={(e) => { e.preventDefault(); onNavigate('albums'); }}>Дискографія</a>
              </li>
              <li>
                <a href="#history" onClick={(e) => { e.preventDefault(); onNavigate('history'); }}>Історія гурту</a>
              </li>
              <li>
                <a href="#about" onClick={(e) => { e.preventDefault(); onNavigate('about'); }}>Про проект</a>
              </li>
            </ul>
          </div>

          <div className="footer-links">
            <h4>Стрімінг & Мережі</h4>
            <ul>
              <li>
                <a href="https://open.spotify.com" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  Spotify <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <a href="https://music.apple.com" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  Apple Music <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  YouTube Music <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  Instagram <ExternalLink size={12} />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div>
            © {new Date().getFullYear()} Lyuda Bielousova. Лабораторна робота №9 з Fullstack розробки (Flask + React + TS).
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            Зроблено з любов'ю до української музики <Heart size={14} color="#c84343" fill="#c84343" />
          </div>
        </div>
      </div>
    </footer>
  );
};

