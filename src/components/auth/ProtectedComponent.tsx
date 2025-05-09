import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';

interface ProtectedComponentProps {
  rolesAllowed: string[];
  children: React.ReactNode;
}

const ProtectedComponent: React.FC<ProtectedComponentProps> = ({ rolesAllowed, children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />; // Redirige al login si no está autenticado
  }

  if (!rolesAllowed.includes(user.role)) {
    return <div>No tienes permiso para acceder a esta sección.</div>;
  }

  return <>{children}</>;
};

export default ProtectedComponent;