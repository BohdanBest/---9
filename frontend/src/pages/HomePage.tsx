import React from 'react';
import { Album } from '../types';
import { useAuth } from '../context/AuthContext';
import { Disc3, ArrowRight, Sparkles, Plus, Music2, Play } from 'lucide-react';

interface HomePageProps {
  albums: Album[];
  onNavigate: (page: string) => void;
  onSelectAlbum: (album: Album) => void;
  onOpenAddAlbum: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  albums,
  onNavigate,
  onSelectAlbum,
  onOpenAddAlbum,
}) => {
  const { user } = useAuth();
  const latestAlbum = albums.length > 0 ? albums[0] : null;

  return (
    <div className="home-page">
      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-background-art"></div>
        <div className="container hero-grid">
          <div className="hero-content">
            <span className="section-tag">
              <Sparkles size={13} />
              Новий етап творчості
            </span>
            <h1 className="hero-title">
              ЗВУК, ЩО <span className="gradient-title">ДИХАЄ</span> СПРАВЖНІМ
            </h1>
            <p className="hero-subtitle">
              Офіційний цифровий архів та дискографія <strong>Lyuda Bielousova</strong> (екс-Lely45). 
              Драматичний інді-рок, кінематографічний саунд та щира рефлексія нашого буття.
            </p>

            <div className="hero-buttons">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => onNavigate('albums')}
              >
                <span>До дискографії</span>
                <ArrowRight size={16} />
              </button>

              {latestAlbum && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => onSelectAlbum(latestAlbum)}
                  style={{ borderColor: 'rgba(229, 179, 106, 0.4)' }}
                >
                  <Play size={16} color="#e5b36a" fill="#e5b36a" />
                  <span>Увімкнути музику</span>
                </button>
              )}

              {user ? (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onOpenAddAlbum}
                >
                  <Plus size={16} color="#e5b36a" />
                  <span>Додати альбом</span>
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => onNavigate('history')}
                >
                  <Disc3 size={16} />
                  <span>Історія</span>
                </button>
              )}
            </div>
          </div>

          {/* HERO VISUAL: 3D-styled Vinyl & Latest Album Sleeve */}
          <div className="hero-visual">
            {latestAlbum && (
              <div
                className="vinyl-wrapper"
                onClick={() => onSelectAlbum(latestAlbum)}
                style={{ cursor: 'pointer' }}
                title="Натисніть для перегляду останнього альбому"
              >
                <div className="vinyl-record animate-spin-slow"></div>
                <div className="cover-sleeve">
                  <img
                    src={latestAlbum.cover_url}
                    alt={latestAlbum.title}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      padding: '1.2rem',
                      background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)',
                      zIndex: 3,
                    }}
                  >
                    <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#e5b36a', letterSpacing: '0.1em' }}>
                      Останній реліз
                    </span>
                    <h3 style={{ fontSize: '1.25rem', margin: '0.2rem 0', color: '#fff' }}>
                      {latestAlbum.title} ({latestAlbum.release_year})
                    </h3>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* EDITORIAL QUOTE / MANIFESTO */}
      <section
        style={{
          padding: '5rem 0',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(15, 15, 20, 0.4)',
        }}
      >
        <div className="container" style={{ textAlign: 'center', maxWidth: '820px' }}>
          <Music2 size={32} color="#e5b36a" style={{ marginBottom: '1.5rem', opacity: 0.8 }} />
          <blockquote
            className="font-editorial"
            style={{
              fontSize: '1.9rem',
              fontStyle: 'italic',
              lineHeight: '1.5',
              color: '#f5f5f7',
              marginBottom: '1.5rem',
            }}
          >
            «Музика не завжди може зупинити бурю навколо, але вона дає силу стояти на ногах і зберігати людське всередині.»
          </blockquote>
          <cite
            style={{
              fontSize: '0.9rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#e5b36a',
              fontStyle: 'normal',
              fontWeight: 600,
            }}
          >
            — Lyuda Bielousova про філософію релізу «РЕТРОспектива»
          </cite>
        </div>
      </section>

      {/* FEATURED DISCOGRAPHY PREVIEW */}
      <section style={{ padding: '6rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
            <div>
              <span className="section-tag">Каталог релізів</span>
              <h2 style={{ fontSize: '2.2rem' }}>Вибрані альбоми</h2>
            </div>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => onNavigate('albums')}
            >
              <span>Переглянути всі ({albums.length})</span>
              <ArrowRight size={16} />
            </button>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2rem',
            }}
          >
            {albums.slice(0, 3).map((alb) => (
              <div
                key={alb.id}
                onClick={() => onSelectAlbum(alb)}
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  gap: '1.2rem',
                  alignItems: 'center',
                }}
                className="featured-item"
              >
                <img
                  src={alb.cover_url}
                  alt={alb.title}
                  style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }}
                />
                <div>
                  <span style={{ fontSize: '0.78rem', color: '#e5b36a', letterSpacing: '0.05em' }}>
                    {alb.release_year} • {alb.genre}
                  </span>
                  <h4 style={{ fontSize: '1.2rem', margin: '0.3rem 0', color: '#fff' }}>{alb.title}</h4>
                  <p style={{ fontSize: '0.85rem', color: '#71717a' }}>{alb.tracklist?.length || 0} композицій</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
