import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

interface User {
  id: string;
  email: string;
  role: 'user' | 'admin';
  firstName: string;
  lastName: string;
  loyaltyPoints: number;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  register: (email: string, password: string, firstName: string, lastName: string, phone?: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loadUser: () => Promise<void>;
  updateProfile: (firstName: string, lastName: string, phone?: string) => Promise<void>;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      register: async (email, password, firstName, lastName, phone) => {
        set({ isLoading: true, error: null });

        try {
          const response = await axios.post(`${API_URL}/auth/register`, {
            email,
            password,
            firstName,
            lastName,
            phone,
          });

          set({
            token: response.data.token,
            user: response.data.user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: unknown) {
          if (axios.isAxiosError(error)) {
            set({
              error: error.response?.data?.error || "Erreur lors de l'inscription",
              isLoading: false,
            });
          } else if (error instanceof Error) {
            set({
              error: error.message,
              isLoading: false,
            });
          } else {
            set({
              error: "Erreur inconnue",
              isLoading: false,
            });
          }
          throw error;
        }
      },

      login: async (email, password) => {
        set({ isLoading: true, error: null });

        try {
          const response = await axios.post(`${API_URL}/auth/login`, {
            email,
            password,
          });

          set({
            token: response.data.token,
            user: response.data.user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: unknown) {
          if (axios.isAxiosError(error)) {
            set({
              error: error.response?.data?.error || "Erreur lors de la connexion",
              isLoading: false,
            });
          } else if (error instanceof Error) {
            set({
              error: error.message,
              isLoading: false,
            });
          } else {
            set({
              error: "Erreur inconnue",
              isLoading: false,
            });
          }
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      loadUser: async () => {
        const token = get().token;
        if (!token) return;

        try {
          const response = await axios.get(`${API_URL}/auth/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          set({
            user: response.data,
            isAuthenticated: true,
          });
        } catch {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
          });
        }
      },

      updateProfile: async (firstName, lastName, phone) => {
        const { token } = get();
        if (!token) throw new Error('Non authentifié');

        set({ isLoading: true, error: null });

        try {
          const response = await axios.put(
            `${API_URL}/auth/profile`,
            { firstName, lastName, phone },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          set({
            user: response.data.user,
            isLoading: false,
          });
        } catch (error: unknown) {
          if (axios.isAxiosError(error)) {
            set({
              error: error.response?.data?.error || "Erreur lors de la mise à jour",
              isLoading: false,
            });
          } else if (error instanceof Error) {
            set({
              error: error.message,
              isLoading: false,
            });
          } else {
            set({
              error: "Erreur inconnue",
              isLoading: false,
            });
          }
          throw error;
        }
      },
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);