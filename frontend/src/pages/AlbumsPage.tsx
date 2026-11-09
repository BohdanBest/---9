import React, { useState, useMemo } from 'react';
import { Album } from '../types';
import { useAuth } from '../context/AuthContext';
import { AlbumCard } from '../components/AlbumCard';
import { Plus, Search, Disc3, X } from 'lucide-react';

interface AlbumsPageProps {
  albums: Album[];
  onSelectAlbum: (album: Album) => void;
  onEditAlbum: (album: Album) => void;
  onDeleteAlbum: (albumId: number, albumTitle: string) => void;
  onOpenAddAlbum: () => void;
}

export const AlbumsPage: React.FC<AlbumsPageProps> = ({
  albums,
  onSelectAlbum,
  onEditAlbum,
  onDeleteAlbum,
  onOpenAddAlbum,
}) => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterEra, setFilterEra] = useState<'all' | 'lb' | 'lely45'>('all');

  const filteredAlbums = useMemo(() => {
    return albums.filter((alb) => {
      // Search matching
      const matchesSearch =
        alb.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alb.genre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alb.description.toLowerCase().includes(searchQuery.toLowerCase());

      // Era filter
      let matchesEra = true;
      if (filterEra === 'lb') {
        matchesEra = alb.release_year >= 2024;
      } else if (filterEra === 'lely45') {
        matchesEra = alb.release_year < 2024;
      }

      return matchesSearch && matchesEra;
    });
  }, [albums, searchQuery, filterEra]);

  return (
    <div className="albums-page" style={{ padding: '3rem 0 6rem 0' }}>
      <div className="container">
        {/* Header Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '1.5rem',
            marginBottom: '3rem',
          }}
        >
          <div>
            <span className="section-tag">Каталог альбомів</span>
            <h1 style={{ fontSize: '2.8rem', marginBottom: '0.6rem' }}>Дискографія</h1>
            <p style={{ color: '#a1a1aa', maxWidth: '600px', fontSize: '1rem' }}>
              Хронологія офіційних альбомів, концептуальних лонгплеїв та сольних релізів.
            </p>
          </div>

          {user && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={onOpenAddAlbum}
              style={{ padding: '0.8rem 1.6rem' }}
            >
              <Plus size={18} />
              <span>Додати новий альбом</span>
            </button>
          )}
        </div>

        {/* Filter and Search Controls */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.07)',
            padding: '1rem 1.4rem',
            borderRadius: '10px',
            marginBottom: '2.5rem',
          }}
        >
          {/* Era Filter Buttons */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              className={`btn btn-sm ${filterEra === 'all' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilterEra('all')}
            >
              Всі релізи ({albums.length})
            </button>
            <button
              type="button"
              className={`btn btn-sm ${filterEra === 'lb' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilterEra('lb')}
            >
              Lyuda Bielousova (2024+)
            </button>
            <button
              type="button"
              className={`btn btn-sm ${filterEra === 'lely45' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilterEra('lely45')}
            >
              Епоха Lely45 (2021-2023)
            </button>
          </div>

          {/* Search Box */}
          <div className="search-box-wrapper">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Пошук за назвою або жанром..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => setSearchQuery('')}
                title="Очистити пошук"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Albums Grid */}
        {filteredAlbums.length > 0 ? (
          <div className="albums-grid">
            {filteredAlbums.map((album) => (
              <AlbumCard
                key={album.id}
                album={album}
                onSelect={onSelectAlbum}
                onEdit={onEditAlbum}
                onDelete={onDeleteAlbum}
              />
            ))}
          </div>
        ) : (
          <div
            style={{
              textAlign: 'center',
              padding: '5rem 1rem',
              background: 'rgba(255,255,255,0.02)',
              borderRadius: '12px',
              border: '1px dashed rgba(255,255,255,0.1)',
            }}
          >
            <Disc3 size={48} color="#71717a" style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <h3 style={{ color: '#fff', fontSize: '1.3rem', marginBottom: '0.5rem' }}>
              Альбомів не знайдено
            </h3>
            <p style={{ color: '#71717a', fontSize: '0.92rem' }}>
              Спробуйте змінити пошуковий запит або скинути фільтри.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
