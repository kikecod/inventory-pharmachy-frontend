import { create } from 'zustand';
import { User } from '../types';
import { authService } from '../services/api/auth.service';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, apellido: string, email: string, password: string, rol: string) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  checkAuth: () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        set({ user, isAuthenticated: true, isLoading: false });
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    } else {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    
    try {
      const data = await authService.login({ email, password });
      
      // Store token and user data in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({
        id: data.usuario.id.toString(),
        name: data.usuario.nombre,
        email: data.usuario.email,
        role: data.usuario.rol.toLowerCase(),
      }));
      
      set({ 
        user: {
          id: data.usuario.id.toString(),
          name: data.usuario.nombre,
          email: data.usuario.email,
          role: data.usuario.rol.toLowerCase(),
        }, 
        isAuthenticated: true 
      });
    } catch (error) {
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  
  register: async (nombre: string, apellido: string, email: string, password: string, rol: string) => {
    set({ isLoading: true });
    
    try {
      const data = await authService.register({
        nombre,
        apellido,
        email,
        password,
        rol,
      });
      
      // Store token and user data in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({
        id: data.usuario.id.toString(),
        name: data.usuario.nombre,
        email: data.usuario.email,
        role: data.usuario.rol.toLowerCase(),
      }));
      
      set({ 
        user: {
          id: data.usuario.id.toString(),
          name: data.usuario.nombre,
          email: data.usuario.email,
          role: data.usuario.rol.toLowerCase(),
        }, 
        isAuthenticated: true 
      });
    } catch (error) {
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, isAuthenticated: false });
  },
  
  updateProfile: (userData) => {
    set((state) => {
      const updatedUser = state.user ? { ...state.user, ...userData } : null;
      if (updatedUser) {
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      return { user: updatedUser };
    });
  },
}));