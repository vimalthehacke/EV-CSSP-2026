import { create } from 'zustand';
import { User } from '../types';
import { getData, setData, removeData } from '../lib/storage';

interface AuthState {
  user: User | null;
  error: string | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => {
  // Load initial session on startup
  const cachedUser = getData<User>('ev_user');

  return {
    user: cachedUser,
    error: null,
    login: (username: string, password: string) => {
      const sanitizedUsername = username.trim();
      
      if (!sanitizedUsername) {
        set({ error: 'CRITICAL_ERROR: USERNAME_CANNOT_BE_EMPTY' });
        return false;
      }
      
      if (password !== 'ev2026') {
        set({ error: 'AUTH_FAILURE: INVALID_MENTOR_PASSCODE' });
        return false;
      }

      const freshUser: User = {
        username: sanitizedUsername,
        loggedIn: true,
        createdAt: new Date().toISOString(),
      };

      setData('ev_user', freshUser);
      set({ user: freshUser, error: null });
      return true;
    },
    logout: () => {
      removeData('ev_user');
      set({ user: null, error: null });
    },
    clearError: () => set({ error: null }),
  };
});
