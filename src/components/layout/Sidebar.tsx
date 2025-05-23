import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  MapPin,         // ícono para Sucursal
  Truck,          // ícono para Proveedores
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Heart,
  LogOut,
  User
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuthStore } from '../../store/authStore';

interface SidebarProps {
  isMobile: boolean;
  closeMobileMenu?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobile, closeMobileMenu }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const handleLinkClick = () => {
    if (isMobile && closeMobileMenu) closeMobileMenu();
  };

  const navigationItems = [
    { name: 'Panel',         icon: <LayoutDashboard size={20} />, href: '/dashboard' },
    { name: 'Sucursal',      icon: <MapPin size={20} />,         href: '/sucursal' },
    { name: 'Proveedores',   icon: <Truck size={20} />,          href: '/proveedor' },
    { name: 'Inventario',    icon: <Package size={20} />,        href: '/inventory' },
    { name: 'Productos',     icon: <ShoppingCart size={20} />,   href: '/products' },
    { name: 'Ventas',        icon: <BarChart3 size={20} />,      href: '/sales' },
    { name: 'Clientes',      icon: <Users size={20} />,          href: '/customers' },
    { name: 'Usuarios',      icon: <Users size={20} />,          href: '/usuarios' },
  ];

  const secondaryNavItems = [
    { name: 'Perfil',        icon: <User size={20} />,           href: '/profile' },
    { name: 'Configuración', icon: <Settings size={20} />,       href: '/settings' },
  ];

  return (
    <aside
      className={cn(
        'flex flex-col bg-white h-full border-r border-gray-200 transition-all duration-300',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Logo y Toggle */}
      <div className="flex h-16 items-center px-4 py-6 border-b border-gray-200">
        {!collapsed ? (
          <div className="flex items-center gap-2">
            <Heart size={24} className="text-primary-600" />
            <span className="text-xl font-semibold text-gray-900">Sistema Farmacia</span>
          </div>
        ) : (
          <div className="flex justify-center w-full">
            <Heart size={24} className="text-primary-600" />
          </div>
        )}
        {!isMobile && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="ml-auto text-gray-500 hover:text-gray-900"
          >
            {collapsed ? <ChevronRight size={20}/> : <ChevronLeft size={20}/>}
          </button>
        )}
      </div>

      {/* Navegación principal */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-2">
          {navigationItems.map(item => (
            <NavLink
              key={item.href}
              to={item.href}
              onClick={handleLinkClick}
              className={({ isActive }) =>
                cn(
                  'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
                  isActive
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-primary-600',
                  collapsed ? 'justify-center' : ''
                )
              }
            >
              <div className={cn('flex items-center', collapsed ? 'justify-center' : '')}>
                <span className="mr-3">{item.icon}</span>
                {!collapsed && <span>{item.name}</span>}
              </div>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Navegación secundaria y logout */}
      <div className="border-t border-gray-200 py-4">
        <nav className="space-y-1 px-2">
          {secondaryNavItems.map(item => (
            <NavLink
              key={item.href}
              to={item.href}
              onClick={handleLinkClick}
              className={({ isActive }) =>
                cn(
                  'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
                  isActive
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-primary-600',
                  collapsed ? 'justify-center' : ''
                )
              }
            >
              <div className={cn('flex items-center', collapsed ? 'justify-center' : '')}>
                <span className="mr-3">{item.icon}</span>
                {!collapsed && <span>{item.name}</span>}
              </div>
            </NavLink>
          ))}

          <button
            onClick={logout}
            className={cn(
              'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors w-full',
              'text-gray-700 hover:bg-gray-50 hover:text-error-600',
              collapsed ? 'justify-center' : ''
            )}
          >
            <div className={cn('flex items-center', collapsed ? 'justify-center' : '')}>
              <span className="mr-3"><LogOut size={20}/></span>
              {!collapsed && <span>Cerrar sesión</span>}
            </div>
          </button>
        </nav>
      </div>

      {/* Información de usuario (solo si no está colapsado) */}
      {!collapsed && (
        <div className="flex items-center p-4 border-t border-gray-200">
          <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700">
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700 truncate max-w-[180px]">
              {user?.name}
            </p>
            <p className="text-xs text-gray-500 truncate max-w-[180px]">
              {user?.role.charAt(0).toUpperCase() + user?.role.slice(1)}
            </p>
          </div>
        </div>
      )}
    </aside>
  );
};