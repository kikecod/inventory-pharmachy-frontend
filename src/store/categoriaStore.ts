import { create } from 'zustand';
import { Category } from '../types';
import { categoriesService } from '../services/api/categories.service';

interface CategoriaState {
  categorias: Category[];
  isLoading: boolean;
  error: string | null;
  fetchCategorias: () => Promise<void>;
}

export const useCategoriaStore = create<CategoriaState>((set) => ({
  categorias: [],
  isLoading: false,
  error: null,

  fetchCategorias: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await categoriesService.getCategories();
      set({ categorias: data });
    } catch (e) {
      console.error('Error al cargar categorías:', e);
      set({ error: 'Error al cargar categorías' });
    } finally {
      set({ isLoading: false });
    }
  },
}));