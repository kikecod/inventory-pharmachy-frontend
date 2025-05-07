import React, { useState } from 'react';
import { Menu, Bell, Search } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuthStore } from '../../store/authStore';
import { useSucursalStore } from '../../store/sucursalStore';

interface HeaderProps {
  onMenuClick: () => void;
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick, title }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuthStore();
  const { sucursales, currentSucursal, setCurrentSucursal } = useSucursalStore();

  return (
    <header className="bg-white border-b border-gray-200 z-10">
      <div className="h-16 px-4 flex items-center justify-between">
        {/* Menú hamburguesa + título */}
        <div className="flex items-center">
          <button
            type="button"
            className="text-gray-500 md:hidden"
            onClick={onMenuClick}
            aria-label="Abrir menú"
          >
            <Menu size={24} />
          </button>
          <h1 className="ml-4 text-xl font-semibold text-gray-900">{title}</h1>
        </div>
        
        {/* Buscador */}
        <div className="hidden md:flex items-center max-w-lg w-full mx-4">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-primary-500 focus:border-primary-500"
              placeholder="Buscar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Buscar"
            />
          </div>
        </div>
        
        {/* Selector de sucursal, notificaciones y usuario */}
        <div className="flex items-center">
          <select
            value={currentSucursal?.idSucursal || ''}
            onChange={(e) => {
              const id = parseInt(e.target.value, 10);
              const suc = sucursales.find(s => s.idSucursal === id);
              if (suc) {
                setCurrentSucursal(suc);
                localStorage.setItem('idSucursal', id.toString());
              }
            }}
            className="border border-gray-300 rounded-md text-sm px-2 py-1 mr-4"
            aria-label="Seleccionar sucursal"
          >
            <option value="">Seleccionar sucursal</option>
            {sucursales.map(sucursal => (
              <option key={sucursal.idSucursal} value={sucursal.idSucursal}>
                {sucursal.nombre}
              </option>
            ))}
          </select>

          <button
            type="button"
            className="text-gray-500 hover:text-gray-700 p-1 relative"
            aria-label="Notificaciones"
          >
            <Bell size={20} />
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-error-500 transform translate-x-1/2 -translate-y-1/2" />
          </button>
          
          <div className="ml-4 relative flex-shrink-0">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700">
                {user?.name.charAt(0).toUpperCase()}
              </div>
              <div className="ml-2 hidden md:block">
                <p className="text-sm font-medium text-gray-700">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.role.charAt(0).toUpperCase() + user?.role.slice(1)}
                </p>
              </div>
            </div>
          </div>
        </div>
      
      </div>
    </header>
  );
};