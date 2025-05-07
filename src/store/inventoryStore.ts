import { create } from 'zustand';
import { InventoryLote, StockBySucursal } from '../types/';
import { inventoryService } from '../services/api/inventory.service';

interface InventoryState {
  lotes: InventoryLote[];
  stockResumen: StockBySucursal[];
  isLoading: boolean;
  error: string | null;
  fetchInventory: () => Promise<void>;
  addInventoryItem: (item: Omit<InventoryLote, 'idLote'>) => Promise<void>;
  updateInventoryItem: (idLote: number, item: Omit<InventoryLote, 'idLote'>) => Promise<void>;
  deleteInventoryItem: (idLote: number) => Promise<void>;
  fetchStockBySucursal: (sucursalId: number) => Promise<void>;
}

export const useInventoryStore = create<InventoryState>((set, get) => ({
  lotes: [],
  stockResumen: [],
  isLoading: false,
  error: null,

  fetchInventory: async () => {
    set({ isLoading: true, error: null });
    try {
      const lotes = await inventoryService.getLotes();
      set({ lotes });
    } catch (e: any) {
      set({ error: e.message });
    } finally {
      set({ isLoading: false });
    }
  },

  addInventoryItem: async (item) => {
    set({ isLoading: true, error: null });
    try {
      const { idLote } = await inventoryService.createLote(item);
      set((state) => ({
        lotes: [...state.lotes, { ...item, idLote }],
      }));
    } catch (e: any) {
      set({ error: e.message });
      throw e;
    } finally {
      set({ isLoading: false });
    }
  },

  updateInventoryItem: async (idLote, item) => {
    set({ isLoading: true, error: null });
    try {
      await inventoryService.updateLote(idLote, item);
      set((state) => ({
        lotes: state.lotes.map((l) =>
          l.idLote === idLote ? { ...item, idLote } : l
        ),
      }));
    } catch (e: any) {
      set({ error: e.message });
      throw e;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteInventoryItem: async (idLote) => {
    set({ isLoading: true, error: null });
    try {
      await inventoryService.deleteLote(idLote);
      set((state) => ({
        lotes: state.lotes.filter((l) => l.idLote !== idLote),
      }));
    } catch (e: any) {
      set({ error: e.message });
      throw e;
    } finally {
      set({ isLoading: false });
    }
  },

  fetchStockBySucursal: async (sucursalId) => {
    set({ isLoading: true, error: null });
    try {
      const stockResumen = await inventoryService.getStockBySucursal(sucursalId);
      set({ stockResumen });
    } catch (e: any) {
      set({ error: e.message });
    } finally {
      set({ isLoading: false });
    }
  },
}));