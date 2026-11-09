import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Album } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { AlbumsPage } from './pages/AlbumsPage';
import { HistoryPage } from './pages/HistoryPage';
import { AboutPage } from './pages/AboutPage';
import { AuthModal } from './components/AuthModal';
import { AlbumDetailModal } from './components/AlbumDetailModal';
import { AlbumFormModal } from './components/AlbumFormModal';
import { DeleteModal } from './components/DeleteModal';
import { Loader2 } from 'lucide-react';
import './styles/main.scss';

const MainApp: React.FC = () => {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loadingAlbums, setLoadingAlbums] = useState<boolean>(true);

  // Modals state
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isAlbumFormOpen, setIsAlbumFormOpen] = useState<boolean>(false);
  const [albumToEdit, setAlbumToEdit] = useState<Album | null>(null);

  // Delete modal state
  const [deleteModalState, setDeleteModalState] = useState<{
    isOpen: boolean;
    albumId: number | null;
    albumTitle: string;
    loading: boolean;
  }>({
    isOpen: false,
    albumId: null,
    albumTitle: '',
    loading: false,
  });

  const fetchAlbums = async () => {
    try {
      const res = await fetch('/api/albums');
      if (res.ok) {
        const data = await res.json();
        setAlbums(data);
      }
    } catch (err) {
      console.error('Помилка завантаження альбомів:', err);
    } finally {
      setLoadingAlbums(false);
    }
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  const handleOpenAddAlbum = () => {
    if (!user) {
      setIsAuthModalOpen(true);
    } else {
      setAlbumToEdit(null);
      setIsAlbumFormOpen(true);
    }
  };

  const handleEditAlbum = (album: Album) => {
    if (!user) {
      setIsAuthModalOpen(true);
    } else {
      setAlbumToEdit(album);
      setIsAlbumFormOpen(true);
    }
  };

  const handlePromptDelete = (albumId: number, albumTitle: string) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    setDeleteModalState({
      isOpen: true,
      albumId,
      albumTitle,
      loading: false,
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModalState.albumId) return;

    setDeleteModalState((prev) => ({ ...prev, loading: true }));
    try {
      const res = await fetch(`/api/albums/${deleteModalState.albumId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        await fetchAlbums();
        setDeleteModalState({ isOpen: false, albumId: null, albumTitle: '', loading: false });
        if (selectedAlbum?.id === deleteModalState.albumId) {
          setSelectedAlbum(null);
        }
      } else {
        alert('Помилка при видаленні альбому');
        setDeleteModalState((prev) => ({ ...prev, loading: false }));
      }
    } catch (err) {
      console.error('Помилка видалення:', err);
      setDeleteModalState((prev) => ({ ...prev, loading: false }));
    }
  };

  return (
    <div className="app-wrapper">
      <Navbar
        currentPage={currentPage}
        onNavigate={(page) => {
          setCurrentPage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenAddAlbum={handleOpenAddAlbum}
      />

      <main className="main-content">
        {loadingAlbums ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '60vh',
              gap: '1rem',
            }}
          >
            <Loader2 size={36} color="#e5b36a" className="animate-spin-slow" />
            <p style={{ color: '#a1a1aa', fontSize: '0.95rem' }}>Завантаження простору Lyuda Bielousova...</p>
          </div>
        ) : (
          <>
            {currentPage === 'home' && (
              <HomePage
                albums={albums}
                onNavigate={(page) => {
                  setCurrentPage(page);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onSelectAlbum={(alb) => setSelectedAlbum(alb)}
                onOpenAddAlbum={handleOpenAddAlbum}
              />
            )}

            {currentPage === 'albums' && (
              <AlbumsPage
                albums={albums}
                onSelectAlbum={(alb) => setSelectedAlbum(alb)}
                onEditAlbum={handleEditAlbum}
                onDeleteAlbum={handlePromptDelete}
                onOpenAddAlbum={handleOpenAddAlbum}
              />
            )}

            {currentPage === 'history' && <HistoryPage />}

            {currentPage === 'about' && <AboutPage />}
          </>
        )}
      </main>

      <Footer
        onNavigate={(page) => {
          setCurrentPage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* MODALS */}
      <AlbumDetailModal
        album={selectedAlbum}
        onClose={() => setSelectedAlbum(null)}
        onEdit={handleEditAlbum}
        onDelete={handlePromptDelete}
      />

      <AlbumFormModal
        isOpen={isAlbumFormOpen}
        onClose={() => setIsAlbumFormOpen(false)}
        albumToEdit={albumToEdit}
        onSaveSuccess={fetchAlbums}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      <DeleteModal
        isOpen={deleteModalState.isOpen}
        albumTitle={deleteModalState.albumTitle}
        loading={deleteModalState.loading}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteModalState({ isOpen: false, albumId: null, albumTitle: '', loading: false })}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
};

export default App;

