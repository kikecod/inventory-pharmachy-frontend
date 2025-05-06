import { create } from 'zustand';
import { InventoryItem, Product } from '../types';
import { useProductStore } from './productStore';

interface InventoryState {
  inventory: InventoryItem[];
  isLoading: boolean;
  error: string | null;
  fetchInventory: () => Promise<void>;
  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => Promise<void>;
  updateInventoryItem: (id: string, updates: Partial<InventoryItem>) => Promise<void>;
  removeInventoryItem: (id: string) => Promise<void>;
  getLowStockItems: (threshold?: number) => InventoryItem[];
  getExpiringItems: (days?: number) => InventoryItem[];
}

// Mock data for demonstration
const mockInventory: InventoryItem[] = [
  {
    id: '1',
    productId: '1',
    batchNumber: 'BATCH-001',
    quantity: 150,
    expiryDate: '2025-12-31',
    receivedDate: '2023-06-15',
    supplierName: 'MediSupply Inc.',
  },
  {
    id: '2',
    productId: '2',
    batchNumber: 'BATCH-002',
    quantity: 85,
    expiryDate: '2025-06-30',
    receivedDate: '2023-07-10',
    supplierName: 'PharmaDist Ltd.',
  },
  {
    id: '3',
    productId: '3',
    batchNumber: 'BATCH-003',
    quantity: 200,
    expiryDate: '2026-03-15',
    receivedDate: '2023-08-22',
    supplierName: 'VitaCorp',
  },
  {
    id: '4',
    productId: '4',
    batchNumber: 'BATCH-004',
    quantity: 120,
    expiryDate: '2026-02-28',
    receivedDate: '2023-09-05',
    supplierName: 'MediSupply Inc.',
  },
  {
    id: '5',
    productId: '5',
    batchNumber: 'BATCH-005',
    quantity: 75,
    expiryDate: '2025-08-15',
    receivedDate: '2023-10-18',
    supplierName: 'PharmaDist Ltd.',
  },
];

export const useInventoryStore = create<InventoryState>((set, get) => ({
  inventory: [],
  isLoading: false,
  error: null,
  
  fetchInventory: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      set({ inventory: mockInventory });
    } catch (error) {
      set({ error: 'Failed to fetch inventory' });
    } finally {
      set({ isLoading: false });
    }
  },
  
  addInventoryItem: async (item) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newItem: InventoryItem = {
        ...item,
        id: Date.now().toString(),
      };
      
      set((state) => ({
        inventory: [...state.inventory, newItem],
      }));
      
      // In a real application, you would update the product stock quantity here
      // This is simplified for demo purposes
    } catch (error) {
      set({ error: 'Failed to add inventory item' });
    } finally {
      set({ isLoading: false });
    }
  },
  
  updateInventoryItem: async (id, updates) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      set((state) => ({
        inventory: state.inventory.map((item) => 
          item.id === id ? { ...item, ...updates } : item
        ),
      }));
    } catch (error) {
      set({ error: 'Failed to update inventory item' });
    } finally {
      set({ isLoading: false });
    }
  },
  
  removeInventoryItem: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 600));
      
      set((state) => ({
        inventory: state.inventory.filter((item) => item.id !== id),
      }));
    } catch (error) {
      set({ error: 'Failed to remove inventory item' });
    } finally {
      set({ isLoading: false });
    }
  },
  
  getLowStockItems: (threshold = 30) => {
    const { inventory } = get();
    return inventory.filter((item) => item.quantity <= threshold);
  },
  
  getExpiringItems: (days = 90) => {
    const { inventory } = get();
    const now = new Date();
    const futureDate = new Date(now.setDate(now.getDate() + days));
    
    return inventory.filter((item) => {
      const expiryDate = new Date(item.expiryDate);
      return expiryDate <= futureDate;
    });
  },
}));