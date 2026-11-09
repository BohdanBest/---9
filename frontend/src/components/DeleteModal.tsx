import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface DeleteModalProps {
  isOpen: boolean;
  albumTitle: string;
  onConfirm: () => void;
  onClose: () => void;
  loading: boolean;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  albumTitle,
  onConfirm,
  onClose,
  loading,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-dialog"
        style={{ maxWidth: '440px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <AlertTriangle size={20} color="#ff7878" />
            <h3 className="modal-title" style={{ fontSize: '1.2rem', color: '#ff7878' }}>
              Підтвердження видалення
            </h3>
          </div>
          <button type="button" className="close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ color: '#d1d1d6', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
            Ви впевнені, що бажаєте безповоротно видалити альбом{' '}
            <strong style={{ color: '#fff' }}>«{albumTitle}»</strong> разом із треклістом?
          </p>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={onClose}
              disabled={loading}
            >
              Скасувати
            </button>
            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={onConfirm}
              disabled={loading}
            >
              <Trash2 size={15} />
              <span>{loading ? 'Видалення...' : 'Так, видалити'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

