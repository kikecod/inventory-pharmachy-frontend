import React, { createContext, useContext, useState } from 'react';
import { User } from '../types';

interface AuthContextProps {
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (token: string, user: User) => {
    localStorage.setItem('token', token); // Guarda el token en el almacenamiento local
    setUser(user); // Actualiza el estado del usuario
  };

  const logout = () => {
    localStorage.removeItem('token'); // Elimina el token
    setUser(null); // Limpia el estado del usuario
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};