import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

interface RoleProtectedRouteProps {
  rolesAllowed: string[];
  children: React.ReactNode;
}

const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({ rolesAllowed, children }) => {
  const { user } = useAuthStore();

  // Si no hay usuario autenticado, redirige al login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si el usuario no tiene un rol permitido, muestra un mensaje de acceso denegado
  if (!rolesAllowed.includes(user.role)) {
    return <div>No tienes permiso para acceder a esta sección.</div>;
  }

  // Si el usuario tiene acceso, renderiza el contenido
  return <>{children}</>;
};

export default RoleProtectedRoute;