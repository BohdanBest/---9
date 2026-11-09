import React, { useState, useEffect } from 'react';
import { Album, Track } from '../types';
import { X, Plus, Trash2, Upload, Link as LinkIcon, Disc3, Loader2 } from 'lucide-react';

interface AlbumFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  albumToEdit?: Album | null;
  onSaveSuccess: () => void;
}

export const AlbumFormModal: React.FC<AlbumFormModalProps> = ({
  isOpen,
  onClose,
  albumToEdit,
  onSaveSuccess,
}) => {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('Lyuda Bielousova');
  const [releaseYear, setReleaseYear] = useState<number | string>(new Date().getFullYear());
  const [genre, setGenre] = useState('Indie Rock / Alternative Pop');
  const [description, setDescription] = useState('');
  const [coverType, setCoverType] = useState<'url' | 'file'>('url');
  const [coverUrl, setCoverUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [spotifyUrl, setSpotifyUrl] = useState('');
  const [appleMusicUrl, setAppleMusicUrl] = useState('');
  const [tracklist, setTracklist] = useState<Track[]>([]);
  const [newTrackTitle, setNewTrackTitle] = useState('');
  const [newTrackDuration, setNewTrackDuration] = useState('3:15');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (albumToEdit) {
      setTitle(albumToEdit.title || '');
      setArtist(albumToEdit.artist || 'Lyuda Bielousova');
      setReleaseYear(albumToEdit.release_year || new Date().getFullYear());
      setGenre(albumToEdit.genre || 'Indie Rock / Alternative Pop');
      setDescription(albumToEdit.description || '');
      setCoverUrl(albumToEdit.cover_url || '');
      setSpotifyUrl(albumToEdit.spotify_url || '');
      setAppleMusicUrl(albumToEdit.apple_music_url || '');
      setTracklist(albumToEdit.tracklist || []);
      setCoverType('url');
      setSelectedFile(null);
      setFilePreview(null);
    } else {
      // Reset for new album
      setTitle('');
      setArtist('Lyuda Bielousova');
      setReleaseYear(new Date().getFullYear());
      setGenre('Indie Rock / Alternative Pop');
      setDescription('');
      setCoverUrl('https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=80');
      setSpotifyUrl('');
      setAppleMusicUrl('');
      setTracklist([
        { number: 1, title: 'Вступ / Інтро', duration: '1:45' },
        { number: 2, title: 'Головний сингл', duration: '3:20' }
      ]);
      setCoverType('url');
      setSelectedFile(null);
      setFilePreview(null);
    }
    setError(null);
  }, [albumToEdit, isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setFilePreview(objectUrl);
    }
  };

  const handleAddTrack = () => {
    if (!newTrackTitle.trim()) return;
    const newTrack: Track = {
      number: tracklist.length + 1,
      title: newTrackTitle.trim(),
      duration: newTrackDuration.trim() || '3:00',
    };
    setTracklist([...tracklist, newTrack]);
    setNewTrackTitle('');
    setNewTrackDuration('3:15');
  };

  const handleRemoveTrack = (index: number) => {
    const updated = tracklist.filter((_, idx) => idx !== index).map((track, idx) => ({
      ...track,
      number: idx + 1,
    }));
    setTracklist(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Назва альбому є обов’язковою');
      return;
    }

    if (!releaseYear || isNaN(Number(releaseYear))) {
      setError('Вкажіть коректний рік релізу');
      return;
    }

    setLoading(true);

    try {
      const isEditing = !!albumToEdit;
      const url = isEditing ? `/api/albums/${albumToEdit.id}` : '/api/albums';
      const method = isEditing ? 'PUT' : 'POST';

      let response: Response;

      if (coverType === 'file' && selectedFile) {
        // Send as FormData
        const formData = new FormData();
        formData.append('title', title.trim());
        formData.append('artist', artist.trim());
        formData.append('release_year', String(releaseYear));
        formData.append('genre', genre.trim());
        formData.append('description', description.trim());
        formData.append('cover_file', selectedFile);
        formData.append('spotify_url', spotifyUrl.trim());
        formData.append('apple_music_url', appleMusicUrl.trim());
        formData.append('tracklist', JSON.stringify(tracklist));

        response = await fetch(url, {
          method,
          body: formData,
          credentials: 'include',
        });
      } else {
        // Send as JSON
        const payload = {
          title: title.trim(),
          artist: artist.trim(),
          release_year: Number(releaseYear),
          genre: genre.trim(),
          description: description.trim(),
          cover_url: coverUrl.trim(),
          spotify_url: spotifyUrl.trim(),
          apple_music_url: appleMusicUrl.trim(),
          tracklist,
        };

        response = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          credentials: 'include',
        });
      }

      const resData = await response.json();

      if (!response.ok) {
        setError(resData.error || 'Помилка при збереженні альбому');
        setLoading(false);
        return;
      }

      setLoading(false);
      onSaveSuccess();
      onClose();
    } catch {
      setError("Помилка з'єднання із сервером");
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-dialog"
        style={{ maxWidth: '680px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Disc3 size={20} color="#e5b36a" />
            <h2 className="modal-title">
              {albumToEdit ? 'Редагувати альбом' : 'Додати новий альбом'}
            </h2>
          </div>
          <button type="button" className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {error && (
            <div
              style={{
                background: 'rgba(200, 67, 67, 0.15)',
                color: '#ff7878',
                padding: '0.8rem 1rem',
                borderRadius: '6px',
                border: '1px solid rgba(200, 67, 67, 0.3)',
                marginBottom: '1.2rem',
                fontSize: '0.9rem',
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Назва альбому *</label>
                <input
                  type="text"
                  className="input-control"
                  placeholder="напр. РЕТРОспектива"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Рік випуску *</label>
                <input
                  type="number"
                  className="input-control"
                  placeholder="2024"
                  value={releaseYear}
                  onChange={(e) => setReleaseYear(e.target.value)}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Виконавець</label>
                <input
                  type="text"
                  className="input-control"
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Жанр</label>
                <input
                  type="text"
                  className="input-control"
                  placeholder="Indie Rock / Alternative"
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Опис та концепція платівки</label>
              <textarea
                className="input-control"
                placeholder="Історія створення, посил, філософія звуку..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            {/* Dual Cover Image Selector */}
            <div className="form-group">
              <label>Обкладинка альбому</label>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.8rem' }}>
                <button
                  type="button"
                  className={`btn btn-sm ${coverType === 'url' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setCoverType('url')}
                >
                  <LinkIcon size={14} />
                  <span>Вказати URL-посилання</span>
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${coverType === 'file' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setCoverType('file')}
                >
                  <Upload size={14} />
                  <span>Завантажити файл</span>
                </button>
              </div>

              {coverType === 'url' ? (
                <div>
                  <input
                    type="url"
                    className="input-control"
                    placeholder="https://images.unsplash.com/..."
                    value={coverUrl}
                    onChange={(e) => setCoverUrl(e.target.value)}
                  />
                  <p className="hint">Підтримуються прямі посилання на JPEG, PNG або WebP зображення.</p>
                </div>
              ) : (
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    className="input-control"
                    onChange={handleFileChange}
                    style={{ padding: '0.5rem' }}
                  />
                  {filePreview && (
                    <div style={{ marginTop: '0.8rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <img
                        src={filePreview}
                        alt="Прев'ю"
                        style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '6px' }}
                      />
                      <span style={{ fontSize: '0.8rem', color: '#e5b36a' }}>Файл обрано для завантаження</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Streaming Links */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Spotify URL (опціонально)</label>
                <input
                  type="url"
                  className="input-control"
                  placeholder="https://open.spotify.com/album/..."
                  value={spotifyUrl}
                  onChange={(e) => setSpotifyUrl(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Apple Music URL (опціонально)</label>
                <input
                  type="url"
                  className="input-control"
                  placeholder="https://music.apple.com/..."
                  value={appleMusicUrl}
                  onChange={(e) => setAppleMusicUrl(e.target.value)}
                />
              </div>
            </div>

            {/* Interactive Tracklist Editor */}
            <div className="form-group" style={{ marginTop: '1.5rem', paddingTop: '1.2rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <label style={{ fontSize: '0.95rem', color: '#fff', marginBottom: '0.8rem' }}>
                Трекліст альбому ({tracklist.length})
              </label>

              {tracklist.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1rem' }}>
                  {tracklist.map((track, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.5rem 0.8rem',
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: '6px',
                        fontSize: '0.88rem',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <span style={{ color: '#71717a', width: '20px' }}>{track.number}.</span>
                        <span>{track.title}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                        <span style={{ color: '#71717a', fontFamily: 'monospace' }}>{track.duration}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTrack(idx)}
                          style={{ color: '#ff7878' }}
                          title="Видалити трек"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Track Inputs */}
              <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                <input
                  type="text"
                  className="input-control"
                  placeholder="Назва композиції"
                  value={newTrackTitle}
                  onChange={(e) => setNewTrackTitle(e.target.value)}
                  style={{ flex: 2 }}
                />
                <input
                  type="text"
                  className="input-control"
                  placeholder="3:20"
                  value={newTrackDuration}
                  onChange={(e) => setNewTrackDuration(e.target.value)}
                  style={{ flex: 1, maxWidth: '90px' }}
                />
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={handleAddTrack}
                  style={{ height: '42px', padding: '0 1rem' }}
                >
                  <Plus size={16} />
                  <span>Додати трек</span>
                </button>
              </div>
            </div>

            {/* Submit / Cancel Buttons */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '1rem',
                marginTop: '2rem',
                paddingTop: '1.2rem',
                borderTop: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={loading}
              >
                Скасувати
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin-slow" />
                    <span>Збереження...</span>
                  </>
                ) : (
                  <span>{albumToEdit ? 'Зберегти зміни' : 'Опублікувати альбом'}</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

