export interface User {
  id: number;
  username: string;
  email?: string | null;
  created_at?: string;
}

export interface Track {
  number: number;
  title: string;
  duration: string;
}

export interface Album {
  id: number;
  title: string;
  artist: string;
  release_year: number;
  genre: string;
  description: string;
  cover_url: string;
  spotify_url?: string;
  apple_music_url?: string;
  tracklist: Track[];
  created_at?: string;
  author_username?: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (username: string, password: string, email?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

