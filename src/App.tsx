import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layout
import { AppLayout } from './components/layout/AppLayout';

// Auth pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';

// Main pages
import { DashboardPage } from './pages/DashboardPage';
import { InventoryPage } from './pages/InventoryPage';
import { ProductsPage } from './pages/ProductsPage';
import { SalesPage } from './pages/SalesPage';
import { CustomersPage } from './pages/CustomersPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { SucursalPage } from './pages/SucursalPage';
import { ProveedorPage } from './pages/ProveedorPage';
import { UsuariosPage } from './pages/UsuariosPage';

// Auth store
import { useAuthStore } from './store/authStore';
import RoleProtectedRoute from './components/auth/RoleProtectedRoute';

function App() {
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <Router>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#ffffff',
            color: '#374151',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            borderRadius: '0.375rem',
          },
          success: {
            iconTheme: {
              primary: '#16a34a',
              secondary: '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#dc2626',
              secondary: '#ffffff',
            },
          },
        }}
      />
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/dashboard" />} />
        
        {/* Protected Routes */}
        <Route path="/" element={isAuthenticated ? <AppLayout /> : <Navigate to="/login" />}>
          <Route index element={<Navigate to="/dashboard" />} />
          
          {/* Rutas protegidas por rol */}
          <Route
            path="sucursal"
            element={
              <RoleProtectedRoute rolesAllowed={['Administrador', 'Almacenero', 'Vendedor']}>
                <SucursalPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="proveedor"
            element={
              <RoleProtectedRoute rolesAllowed={['Administrador', 'Almacenero']}>
                <ProveedorPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="dashboard"
            element={
              <RoleProtectedRoute rolesAllowed={['Administrador']}>
                <DashboardPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="inventory"
            element={
              <RoleProtectedRoute rolesAllowed={['Administrador', 'Almacenero']}>
                <InventoryPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="products"
            element={
              <RoleProtectedRoute rolesAllowed={['Administrador', 'Almacenero', 'Vendedor']}>
                <ProductsPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="sales"
            element={
              <RoleProtectedRoute rolesAllowed={['Administrador', 'Vendedor']}>
                <SalesPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="customers"
            element={
              <RoleProtectedRoute rolesAllowed={['Administrador', 'Vendedor']}>
                <CustomersPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="usuarios"
            element={
              <RoleProtectedRoute rolesAllowed={['Administrador']}>
                <UsuariosPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="profile"
            element={
              <RoleProtectedRoute rolesAllowed={['Administrador', 'Almacenero', 'Vendedor']}>
                <ProfilePage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="settings"
            element={
              <RoleProtectedRoute rolesAllowed={['Administrador', 'Almacenero', 'Vendedor']}>
                <SettingsPage />
              </RoleProtectedRoute>
            }
          />
        </Route>
        
        {/* Fallback route */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;