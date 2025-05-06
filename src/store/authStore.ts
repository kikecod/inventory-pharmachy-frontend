import { create } from 'zustand';
import { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, apellido: string, email: string, password: string, rol: string) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => void;
}

const API_URL = 'http://localhost:8082';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      if (!response.ok) {
        throw new Error('Invalid credentials');
      }
      
      const data = await response.json();
      
      // Store token in localStorage
      localStorage.setItem('token', data.token);
      
      // Transform API response to match our User type
      const user: User = {
        id: data.usuario.id.toString(),
        name: data.usuario.nombre,
        email: data.usuario.email,
        role: data.usuario.rol.toLowerCase(),
      };
      
      set({ user, isAuthenticated: true });
    } catch (error) {
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  
  register: async (nombre: string, apellido: string, email: string, password: string, rol: string) => {
    set({ isLoading: true });
    
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre,
          apellido,
          email,
          password,
          rol,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Registration failed');
      }
      
      const data = await response.json();
      
      // Store token in localStorage
      localStorage.setItem('token', data.token);
      
      // Transform API response to match our User type
      const user: User = {
        id: data.usuario.id.toString(),
        name: data.usuario.nombre,
        email: data.usuario.email,
        role: data.usuario.rol.toLowerCase(),
      };
      
      set({ user, isAuthenticated: true });
    } catch (error) {
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, isAuthenticated: false });
  },
  
  updateProfile: (userData) => {
    set((state) => ({
      user: state.user ? { ...state.user, ...userData } : null,
    }));
  },
}));