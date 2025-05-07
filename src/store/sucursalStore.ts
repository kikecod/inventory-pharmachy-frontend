import { create } from 'zustand';
import { Sucursal } from '../types';
import { sucursalService } from '../services/api/sucursal.service';

interface SucursalState {
  sucursales: Sucursal[];
  currentSucursal: Sucursal | null;
  isLoading: boolean;
  error: string | null;
  fetchSucursales: () => Promise<void>;
  addSucursal: (s: Omit<Sucursal, 'idSucursal' | 'fechaCreacion'>) => Promise<void>;
  setCurrentSucursal: (sucursal: Sucursal) => void;
}

export const useSucursalStore = create<SucursalState>((set, get) => ({
  sucursales: [],
  currentSucursal: null,
  isLoading: false,
  error: null,

  fetchSucursales: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await sucursalService.getAll();
      set({ sucursales: data });
      const stored = localStorage.getItem('idSucursal');
      if (stored) {
        const found = data.find(s => s.idSucursal === Number(stored));
        if (found) set({ currentSucursal: found });
      }
    } catch (e) {
      set({ error: 'Error al cargar sucursales' });
    } finally {
      set({ isLoading: false });
    }
  },

  addSucursal: async (sucursal) => {
    set({ isLoading: true, error: null });
    try {
      const newSuc = await sucursalService.create(sucursal);
      set(state => ({ sucursales: [...state.sucursales, newSuc] }));
    } catch (e) {
      set({ error: 'Error al agregar sucursal' });
    } finally {
      set({ isLoading: false });
    }
  },

  setCurrentSucursal: (sucursal) => {
    localStorage.setItem('idSucursal', sucursal.idSucursal.toString());
    set({ currentSucursal: sucursal });
  }
}));