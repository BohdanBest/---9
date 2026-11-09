import React from 'react';
import { Album } from '../types';
import { useAuth } from '../context/AuthContext';
import { Edit3, Trash2, ArrowUpRight } from 'lucide-react';

interface AlbumCardProps {
  album: Album;
  onSelect: (album: Album) => void;
  onEdit: (album: Album) => void;
  onDelete: (albumId: number, albumTitle: string) => void;
}

export const AlbumCard: React.FC<AlbumCardProps> = ({
  album,
  onSelect,
  onEdit,
  onDelete,
}) => {
  const { user } = useAuth();

  // Fallback image if cover_url is missing
  const coverSrc = album.cover_url || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80';

  return (
    <article className="album-card">
      <div className="card-media" onClick={() => onSelect(album)} style={{ cursor: 'pointer' }}>
        <div className="badge-year">{album.release_year}</div>
        <div className="vinyl-slide"></div>
        <img
          src={coverSrc}
          alt={album.title}
          className="cover-img"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80';
          }}
        />
      </div>

      <div className="card-body">
        <span className="album-artist">{album.artist}</span>
        <h3
          className="album-title"
          onClick={() => onSelect(album)}
          style={{ cursor: 'pointer' }}
          title={album.title}
        >
          {album.title}
        </h3>
        <p className="album-genre">{album.genre}</p>

        {album.description && (
          <p className="album-desc">{album.description}</p>
        )}

        <div className="card-footer">
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => onSelect(album)}
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
          >
            <span>Треклист</span>
            <ArrowUpRight size={14} />
          </button>

          {user && (
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(album);
                }}
                title="Редагувати альбом"
                style={{ padding: '0.4rem' }}
              >
                <Edit3 size={15} color="#e5b36a" />
              </button>
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(album.id, album.title);
                }}
                title="Видалити альбом"
                style={{ padding: '0.4rem' }}
              >
                <Trash2 size={15} />
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};
