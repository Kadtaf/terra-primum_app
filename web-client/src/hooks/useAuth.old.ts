import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  loyaltyPoints?: number;
  totalOrders?: number;
}

interface AuthResponse {
  success: boolean;
  data: User;
  token: string;
  message?: string;
}

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, token, setUser, setToken, logout: storeLogout } = useAuthStore();

  const register = useCallback(
    async (email: string, password: string, firstName: string, lastName: string, phone?: string) => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.post<AuthResponse>('/api/auth/register', {
          email,
          password,
          firstName,
          lastName,
          phone,
        });

        if (response.data.success) {
          setUser(response.data.data);
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
          return response.data;
        }
      } catch (err: any) {
        const message = err.response?.data?.error || 'Erreur lors de l\'inscription';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setUser, setToken]
  );

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.post<AuthResponse>('/api/auth/login', {
          email,
          password,
        });

        if (response.data.success) {
          setUser(response.data.data);
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
          return response.data;
        }
      } catch (err: any) {
        const message = err.response?.data?.error || 'Erreur lors de la connexion';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setUser, setToken]
  );

  const logout = useCallback(() => {
    storeLogout();
    localStorage.removeItem('token');
    setError(null);
  }, [storeLogout]);

  const getCurrentUser = useCallback(async () => {
    try {
      if (!token) return null;

      const response = await axios.get<{ success: boolean; data: User }>('/api/auth/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setUser(response.data.data);
        return response.data.data;
      }
    } catch (err) {
      logout();
      return null;
    }
  }, [token, setUser, logout]);

  const updateProfile = useCallback(
    async (firstName?: string, lastName?: string, phone?: string) => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.put<AuthResponse>('/api/auth/profile', {
          firstName,
          lastName,
          phone,
        });

        if (response.data.success) {
          setUser(response.data.data);
          return response.data;
        }
      } catch (err: any) {
        const message = err.response?.data?.error || 'Erreur lors de la mise à jour';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setUser]
  );

  // Vérifier le token au chargement
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken && !token) {
      setToken(storedToken);
      getCurrentUser();
    }
  }, []);

  return {
    user,
    token,
    loading,
    error,
    register,
    login,
    logout,
    getCurrentUser,
    updateProfile,
    isAuthenticated: !!token && !!user,
  };
}
