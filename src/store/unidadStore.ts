// src/store/unidadStore.ts
import { create } from 'zustand';
import { unidadService } from '../services/api/unidad.service';
import { Unidad } from '../types';

interface UnidadState {
  unidades: Unidad[];
  currentUnidad: Unidad | null;
  isLoading: boolean;
  error: string | null;
  fetchUnidades: () => Promise<void>;
  selectUnidad: (id: number) => void;
  addUnidad: (data: Omit<Unidad, 'idUnidad'>) => Promise<void>;
  updateUnidad: (id: number, data: Partial<Unidad>) => Promise<void>;
  deleteUnidad: (id: number) => Promise<void>;
}

export const useUnidadStore = create<UnidadState>((set, get) => ({
  unidades: [],
  currentUnidad: null,
  isLoading: false,
  error: null,

  fetchUnidades: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await unidadService.getAll();
      set({ unidades: data });
    } catch (err) {
      set({ error: 'Error al cargar unidades' });
    } finally {
      set({ isLoading: false });
    }
  },

  selectUnidad: (id) => {
    const found = get().unidades.find(u => u.idUnidad === id) || null;
    set({ currentUnidad: found });
  },

  addUnidad: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const nueva = await unidadService.create(data);
      set(state => ({ unidades: [...state.unidades, nueva] }));
    } catch (err) {
      set({ error: 'Error al agregar unidad' });
    } finally {
      set({ isLoading: false });
    }
  },

  updateUnidad: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      await unidadService.update(id, data);
      set(state => ({
        unidades: state.unidades.map(u =>
          u.idUnidad === id ? { ...u, ...data } as Unidad : u
        )
      }));
    } catch (err) {
      set({ error: 'Error al actualizar unidad' });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteUnidad: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await unidadService.delete(id);
      set(state => ({ unidades: state.unidades.filter(u => u.idSucursal !== id) }));
    } catch (err) {
      set({ error: 'Error al eliminar unidad' });
    } finally {
      set({ isLoading: false });
    }
  }
}));