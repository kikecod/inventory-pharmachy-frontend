import { create } from 'zustand';
import { Sucursal } from '../types';
import { sucursalService } from '../services/api/sucursal.service';

interface SucursalState {
  sucursales: Sucursal[];
  selectedSucursal: Sucursal | null;
  isLoading: boolean;
  error: string | null;
  fetchSucursales: () => Promise<void>;
  addSucursal: (s: Omit<Sucursal, 'idSucursal' | 'fechaCreacion'>) => Promise<void>;
  selectSucursal: (id: number) => void;
}

export const useSucursalStore = create<SucursalState>((set, get) => ({
  sucursales: [],
  selectedSucursal: null,
  isLoading: false,
  error: null,

  fetchSucursales: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await sucursalService.getAll();
      set({ sucursales: data });
      const stored = localStorage.getItem('selectedSucursalId');
      if (stored) {
        const found = data.find(s => s.idSucursal === Number(stored));
        if (found) set({ selectedSucursal: found });
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

  selectSucursal: (id) => {
    const found = get().sucursales.find(s => s.idSucursal === id);
    if (found) {
      localStorage.setItem('selectedSucursalId', id.toString());
      set({ selectedSucursal: found });
    }
  },
}));
