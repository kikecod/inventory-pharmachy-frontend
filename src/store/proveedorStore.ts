import { create } from 'zustand';
import {
  Provider,
  ProviderProduct,
  PurchaseRecord,
  CreateOrderDTO,
  CreateOrderResponse
} from '../types/index';
import { proveedorService } from '../services/api/proveedor.service';

interface ProveedorState {
  providers: Provider[];
  current: Provider | null;
  products: ProviderProduct[];
  history: PurchaseRecord[];
  isLoading: boolean;
  error: string | null;

  fetchProviders: () => Promise<void>;
  fetchProviderById: (id: number) => Promise<void>;
  addProvider: (p: Omit<Provider, 'idProveedor'>) => Promise<void>;
  updateProvider: (id: number, p: Partial<Provider>) => Promise<void>;
  deleteProvider: (id: number) => Promise<void>;

  fetchProductsByProvider: (id: number) => Promise<void>;
  fetchPurchaseHistory: () => Promise<void>;
  createOrder: (dto: CreateOrderDTO) => Promise<CreateOrderResponse>;
}

export const useProveedorStore = create<ProveedorState>((set, get) => ({
  providers: [],
  current: null,
  products: [],
  history: [],
  isLoading: false,
  error: null,

  fetchProviders: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await proveedorService.getAll();
      set({ providers: data });
    } catch (e: any) {
      set({ error: e.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchProviderById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const p = await proveedorService.getById(id);
      set({ current: p });
    } catch (e: any) {
      set({ error: e.message });
    } finally {
      set({ isLoading: false });
    }
  },

  addProvider: async (p) => {
    set({ isLoading: true, error: null });
    try {
      const np = await proveedorService.create(p);
      set(state => ({ providers: [...state.providers, np] }));
    } catch (e: any) {
      set({ error: e.message });
    } finally {
      set({ isLoading: false });
    }
  },

  updateProvider: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const up = await proveedorService.update(id, updates);
      set(state => ({
        providers: state.providers.map(pr =>
          pr.idProveedor === id ? up : pr
        )
      }));
    } catch (e: any) {
      set({ error: e.message });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteProvider: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await proveedorService.delete(id);
      set(state => ({
        providers: state.providers.filter(pr => pr.idProveedor !== id)
      }));
    } catch (e: any) {
      set({ error: e.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchProductsByProvider: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const prods = await proveedorService.getProductsByProvider(id);
      set({ products: prods });
    } catch (e: any) {
      set({ error: e.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchPurchaseHistory: async () => {
    set({ isLoading: true, error: null });
    try {
      const hist = await proveedorService.getPurchaseHistory();
      set({ history: hist });
    } catch (e: any) {
      set({ error: e.message });
    } finally {
      set({ isLoading: false });
    }
  },

  createOrder: async (dto) => {
    set({ isLoading: true, error: null });
    try {
      const res = await proveedorService.createPurchaseOrder(dto);
      return res;
    } catch (e: any) {
      set({ error: e.message });
      throw e;
    } finally {
      set({ isLoading: false });
    }
  },
}));