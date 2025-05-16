import { create } from 'zustand';
import { User } from 'firebase/auth';

interface AuthState {
  user: User | null;
  loading: boolean;
  userRole: 'farmer' | 'customer' | null;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setUserRole: (role: 'farmer' | 'customer' | null) => void;
  clearAuthState: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  userRole: null,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  setUserRole: (role) => set({ userRole: role }),
  clearAuthState: () => set({ user: null, userRole: null }),
}));