import React, { useState } from 'react';
import { Album } from '../types';
import { useAuth } from '../context/AuthContext';
import { X, Play, Pause, ExternalLink, Edit3, Trash2, Disc3, Clock, Radio, ListMusic } from 'lucide-react';

interface AlbumDetailModalProps {
  album: Album | null;
  onClose: () => void;
  onEdit: (album: Album) => void;
  onDelete: (albumId: number, albumTitle: string) => void;
}

export const AlbumDetailModal: React.FC<AlbumDetailModalProps> = ({
  album,
  onClose,
  onEdit,
  onDelete,
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'spotify' | 'tracklist'>('spotify');
  const [playingTrack, setPlayingTrack] = useState<number | null>(null);

  if (!album) return null;

  const togglePlayTrack = (trackNumber: number) => {
    if (playingTrack === trackNumber) {
      setPlayingTrack(null);
    } else {
      setPlayingTrack(trackNumber);
    }
  };

  const getSpotifyEmbedUrl = (url?: string) => {
    if (!url) {
      return 'https://open.spotify.com/embed/artist/3S2ZPs0ccEwknZLPQDbGSw?utm_source=generator&theme=0';
    }
    if (url.includes('open.spotify.com/embed/')) {
      return url;
    }
    const match = url.match(/open\.spotify\.com\/(album|track|artist|playlist)\/([a-zA-Z0-9]+)/);
    if (match) {
      return `https://open.spotify.com/embed/${match[1]}/${match[2]}?utm_source=generator&theme=0`;
    }
    return 'https://open.spotify.com/embed/artist/3S2ZPs0ccEwknZLPQDbGSw?utm_source=generator&theme=0';
  };

  const coverSrc = album.cover_url || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=80';
  const spotifyEmbedUrl = getSpotifyEmbedUrl(album.spotify_url);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-dialog"
        style={{ maxWidth: '880px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Disc3 size={20} color="#e5b36a" className="animate-spin-slow" />
            <span className="modal-title">{album.title}</span>
          </div>
          <button type="button" className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(250px, 300px) 1fr',
              gap: '2.5rem',
              alignItems: 'start',
            }}
            className="detail-layout"
          >
            {/* Left Column: Cover & Links */}
            <div>
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '1/1',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  marginBottom: '1.2rem',
                }}
              >
                <img
                  src={coverSrc}
                  alt={album.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              {/* Streaming Links */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {album.spotify_url && (
                  <a
                    href={album.spotify_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary btn-sm"
                    style={{ width: '100%', justifyContent: 'space-between' }}
                  >
                    <span>Відкрити в додатку Spotify</span>
                    <ExternalLink size={14} />
                  </a>
                )}
                {album.apple_music_url && (
                  <a
                    href={album.apple_music_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary btn-sm"
                    style={{ width: '100%', justifyContent: 'space-between' }}
                  >
                    <span>Слухати в Apple Music</span>
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>

              {/* Admin Actions */}
              {user && (
                <div
                  style={{
                    display: 'flex',
                    gap: '0.8rem',
                    marginTop: '1.2rem',
                    paddingTop: '1.2rem',
                    borderTop: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    style={{ flex: 1 }}
                    onClick={() => {
                      onClose();
                      onEdit(album);
                    }}
                  >
                    <Edit3 size={15} color="#e5b36a" />
                    <span>Редагувати</span>
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => {
                      onClose();
                      onDelete(album.id, album.title);
                    }}
                  >
                    <Trash2 size={15} />
                    <span>Видалити</span>
                  </button>
                </div>
              )}
            </div>

            {/* Right Column: Details, Live Player & Tracklist */}
            <div>
              <div style={{ marginBottom: '1.2rem' }}>
                <span className="section-tag" style={{ marginBottom: '0.6rem' }}>
                  {album.release_year} • {album.genre}
                </span>
                <h1 style={{ fontSize: '2.2rem', lineHeight: '1.2', marginBottom: '0.4rem' }}>
                  {album.title}
                </h1>
                <p style={{ color: '#e5b36a', letterSpacing: '0.08em', textTransform: 'uppercase', fontSize: '0.9rem', fontWeight: 600 }}>
                  {album.artist}
                </p>
              </div>

              {album.description && (
                <div
                  style={{
                    color: '#a1a1aa',
                    lineHeight: '1.7',
                    fontSize: '0.92rem',
                    marginBottom: '1.5rem',
                    padding: '0.9rem 1.1rem',
                    background: 'rgba(255,255,255,0.02)',
                    borderRadius: '8px',
                    borderLeft: '3px solid #e5b36a',
                  }}
                >
                  {album.description}
                </div>
              )}

              {/* Tabs: Live Spotify Player vs Tracklist */}
              <div
                style={{
                  display: 'flex',
                  background: 'rgba(255,255,255,0.04)',
                  borderRadius: '8px',
                  padding: '4px',
                  marginBottom: '1.2rem',
                }}
              >
                <button
                  type="button"
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    padding: '0.6rem',
                    borderRadius: '6px',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    background: activeTab === 'spotify' ? '#e5b36a' : 'transparent',
                    color: activeTab === 'spotify' ? '#0b0b0e' : '#a1a1aa',
                    transition: 'all 0.2s',
                  }}
                  onClick={() => setActiveTab('spotify')}
                >
                  <Radio size={16} />
                  <span>Справжня музика (Spotify Player)</span>
                </button>

                <button
                  type="button"
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    padding: '0.6rem',
                    borderRadius: '6px',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    background: activeTab === 'tracklist' ? '#e5b36a' : 'transparent',
                    color: activeTab === 'tracklist' ? '#0b0b0e' : '#a1a1aa',
                    transition: 'all 0.2s',
                  }}
                  onClick={() => setActiveTab('tracklist')}
                >
                  <ListMusic size={16} />
                  <span>Список треків ({album.tracklist?.length || 0})</span>
                </button>
              </div>

              {/* TAB 1: SPOTIFY LIVE EMBED PLAYER */}
              {activeTab === 'spotify' && (
                <div style={{ animation: 'fadeIn 0.3s ease' }}>
                  <div
                    style={{
                      borderRadius: '12px',
                      overflow: 'hidden',
                      boxShadow: '0 12px 35px rgba(0,0,0,0.6)',
                      background: '#121216',
                      border: '1px solid rgba(255,255,255,0.08)',
                    }}
                  >
                    <iframe
                      style={{ borderRadius: '12px', display: 'block' }}
                      src={spotifyEmbedUrl}
                      width="100%"
                      height="352"
                      frameBorder="0"
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      loading="lazy"
                      title={`Spotify Player - ${album.title}`}
                    ></iframe>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: '#71717a', marginTop: '0.6rem', textAlign: 'center' }}>
                    🎵 Натисніть кнопку <strong>Play</strong> у віджеті для відтворення оригінальних студійних треків співачки.
                  </p>
                </div>
              )}

              {/* TAB 2: DETAILED TRACKLIST */}
              {activeTab === 'tracklist' && (
                <div style={{ animation: 'fadeIn 0.3s ease' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '0.8rem',
                      paddingBottom: '0.5rem',
                      borderBottom: '1px solid rgba(255,255,255,0.08)',
                    }}
                  >
                    <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#fff' }}>
                      Композиції
                    </h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#71717a', fontSize: '0.78rem' }}>
                      <Clock size={13} />
                      <span>Тривалість</span>
                    </div>
                  </div>

                  {album.tracklist && album.tracklist.length > 0 ? (
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      {album.tracklist.map((track, idx) => {
                        const isPlaying = playingTrack === (track.number || idx + 1);
                        return (
                          <li
                            key={idx}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '0.65rem 0.9rem',
                              borderRadius: '6px',
                              background: isPlaying ? 'rgba(229, 179, 106, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                              border: isPlaying ? '1px solid rgba(229, 179, 106, 0.3)' : '1px solid transparent',
                              transition: 'all 0.2s ease',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                              <button
                                type="button"
                                onClick={() => togglePlayTrack(track.number || idx + 1)}
                                style={{
                                  width: '28px',
                                  height: '28px',
                                  borderRadius: '50%',
                                  background: isPlaying ? '#e5b36a' : 'rgba(255,255,255,0.08)',
                                  color: isPlaying ? '#0b0b0e' : '#fff',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  transition: 'all 0.2s',
                                }}
                                title={isPlaying ? 'Пауза' : 'Слухати'}
                              >
                                {isPlaying ? <Pause size={13} /> : <Play size={13} style={{ marginLeft: '2px' }} />}
                              </button>

                              <span style={{ color: '#71717a', fontSize: '0.85rem', width: '18px' }}>
                                {track.number || idx + 1}.
                              </span>

                              <span style={{ fontWeight: 500, color: isPlaying ? '#e5b36a' : '#fff', fontSize: '0.92rem' }}>
                                {track.title}
                              </span>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                              {isPlaying && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                                  <span style={{ width: '3px', height: '14px', background: '#e5b36a', animation: 'soundWave 0.8s ease-in-out infinite' }}></span>
                                  <span style={{ width: '3px', height: '8px', background: '#e5b36a', animation: 'soundWave 0.6s ease-in-out 0.2s infinite' }}></span>
                                  <span style={{ width: '3px', height: '18px', background: '#e5b36a', animation: 'soundWave 0.9s ease-in-out 0.4s infinite' }}></span>
                                </div>
                              )}
                              <span style={{ color: '#71717a', fontSize: '0.85rem', fontFamily: 'monospace' }}>
                                {track.duration}
                              </span>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p style={{ color: '#71717a', fontSize: '0.9rem', fontStyle: 'italic' }}>
                      Трекліст поки що не додано до цього альбому.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
