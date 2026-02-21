import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import axios, { AxiosError } from "axios";
import adminAxios from "@/api/adminAxios";
import { User } from "../types/User";

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isAdmin: boolean;

  register: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    phone?: string
  ) => Promise<void>;

  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loadUser: () => Promise<void>;
  updateProfile: (
    firstName: string,
    lastName: string,
    phone?: string
  ) => Promise<void>;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      isAdmin: false, 

      // REGISTER
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

          const token = response.data.token;
          localStorage.setItem("token", token);

          set({
            token,
            user: response.data.user,
            isAuthenticated: true,
            isAdmin: response.data.user.role === "admin",
            isLoading: false,
          });
        } catch (error: unknown) {
          const err = error as AxiosError<{ error?: string }>;
          set({
            error: err.response?.data?.error || "Erreur lors de l'inscription",
            isLoading: false,
          });
          throw error;
        }
      },

      // LOGIN
      login: async (email, password) => {
        set({ isLoading: true, error: null });

        try {
          const response = await axios.post(`${API_URL}/auth/login`, {
            email,
            password,
          });

          const token = response.data.token;
          const user = response.data.user;
          localStorage.setItem("token", token);

          set({
            token,
            user: response.data.user,
            isAuthenticated: true,
            isAdmin: user.role === "admin",
            isLoading: false,
          });
        } catch (error: unknown) {
          const err = error as AxiosError<{ error?: string }>;
          set({
            error: err.response?.data?.error || "Erreur lors de la connexion",
            isLoading: false,
          });
          throw error;
        }
      },

      // LOGOUT
      logout: () => {
        localStorage.removeItem("token");

        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isAdmin: false,
          error: null,
        });
      },

      // LOAD USER
      loadUser: async () => {
        const token = get().token;
        if (!token) return;

        set({ isLoading: true });

        try {
          const response = await adminAxios.get("/auth/profile");

          set({
            user: response.data,
            isAuthenticated: true,
            isAdmin: response.data.role === "admin",
            isLoading: false,
          });
        } catch {
          localStorage.removeItem("token");

          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      // UPDATE PROFILE
      updateProfile: async (firstName, lastName, phone) => {
        const { token } = get();
        if (!token) throw new Error("Non authentifié");

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
          const err = error as AxiosError<{ error?: string }>;
          set({
            error:
              err.response?.data?.error ||
              "Erreur lors de la mise à jour",
            isLoading: false,
          });
          throw error;
        }
      },
    }),

    {
      name: "auth-store",

      // Zustand 4 — stockage JSON correct
      storage: createJSONStorage(() => localStorage),

      // On persiste seulement ce qui est utile
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        isAdmin: state.isAdmin,
      }),
    }
  )
);