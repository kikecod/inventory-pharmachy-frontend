import { create } from 'zustand';
import { Sale, SaleItem } from '../types';

interface SalesState {
  sales: Sale[];
  currentSale: Sale | null;
  isLoading: boolean;
  error: string | null;
  fetchSales: () => Promise<void>;
  createSale: (sale: Omit<Sale, 'id'>) => Promise<void>;
  updateSale: (id: string, updates: Partial<Sale>) => Promise<void>;
  deleteSale: (id: string) => Promise<void>;
  startNewSale: (staffId: string) => void;
  addItemToSale: (item: SaleItem) => void;
  removeItemFromSale: (productId: string) => void;
  updateItemQuantity: (productId: string, quantity: number) => void;
  completeSale: (customerName: string, paymentMethod: Sale['paymentMethod']) => Promise<void>;
  cancelCurrentSale: () => void;
}

// Mock data for demonstration
const mockSales: Sale[] = [
  {
    id: '1',
    customerName: 'John Doe',
    items: [
      {
        productId: '1',
        productName: 'Paracetamol 500mg',
        quantity: 2,
        unitPrice: 5.99,
        subtotal: 11.98,
      },
      {
        productId: '3',
        productName: 'Vitamin C 1000mg',
        quantity: 1,
        unitPrice: 8.50,
        subtotal: 8.50,
      },
    ],
    total: 20.48,
    paymentMethod: 'cash',
    status: 'completed',
    createdAt: '2023-10-15T10:30:00Z',
    staffId: '1',
  },
  {
    id: '2',
    customerName: 'Jane Smith',
    items: [
      {
        productId: '2',
        productName: 'Amoxicillin 250mg',
        quantity: 1,
        unitPrice: 12.99,
        subtotal: 12.99,
      },
    ],
    total: 12.99,
    paymentMethod: 'card',
    status: 'completed',
    createdAt: '2023-10-16T14:45:00Z',
    staffId: '1',
  },
  {
    id: '3',
    customerName: 'Michael Johnson',
    items: [
      {
        productId: '4',
        productName: 'Ibuprofen 400mg',
        quantity: 1,
        unitPrice: 6.99,
        subtotal: 6.99,
      },
      {
        productId: '5',
        productName: 'Loratadine 10mg',
        quantity: 2,
        unitPrice: 9.99,
        subtotal: 19.98,
      },
    ],
    total: 26.97,
    paymentMethod: 'insurance',
    status: 'completed',
    createdAt: '2023-10-17T16:20:00Z',
    staffId: '1',
  },
];

const emptySale: Omit<Sale, 'id'> = {
  customerName: '',
  items: [],
  total: 0,
  paymentMethod: 'cash',
  status: 'pending',
  createdAt: new Date().toISOString(),
  staffId: '',
};

export const useSalesStore = create<SalesState>((set, get) => ({
  sales: [],
  currentSale: null,
  isLoading: false,
  error: null,
  
  fetchSales: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      set({ sales: mockSales });
    } catch (error) {
      set({ error: 'Failed to fetch sales' });
    } finally {
      set({ isLoading: false });
    }
  },
  
  createSale: async (sale) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newSale: Sale = {
        ...sale,
        id: Date.now().toString(),
      };
      
      set((state) => ({
        sales: [...state.sales, newSale],
        currentSale: null,
      }));
    } catch (error) {
      set({ error: 'Failed to create sale' });
    } finally {
      set({ isLoading: false });
    }
  },
  
  updateSale: async (id, updates) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      set((state) => ({
        sales: state.sales.map((sale) => 
          sale.id === id ? { ...sale, ...updates } : sale
        ),
      }));
    } catch (error) {
      set({ error: 'Failed to update sale' });
    } finally {
      set({ isLoading: false });
    }
  },
  
  deleteSale: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 600));
      
      set((state) => ({
        sales: state.sales.filter((sale) => sale.id !== id),
      }));
    } catch (error) {
      set({ error: 'Failed to delete sale' });
    } finally {
      set({ isLoading: false });
    }
  },
  
  startNewSale: (staffId) => {
    set({
      currentSale: {
        ...emptySale,
        staffId,
        createdAt: new Date().toISOString(),
      },
    });
  },
  
  addItemToSale: (item) => {
    set((state) => {
      if (!state.currentSale) return state;
      
      const existingItemIndex = state.currentSale.items.findIndex(
        (i) => i.productId === item.productId
      );
      
      let updatedItems;
      
      if (existingItemIndex >= 0) {
        // Update existing item
        updatedItems = [...state.currentSale.items];
        const existingItem = updatedItems[existingItemIndex];
        
        updatedItems[existingItemIndex] = {
          ...existingItem,
          quantity: existingItem.quantity + item.quantity,
          subtotal: (existingItem.quantity + item.quantity) * existingItem.unitPrice,
        };
      } else {
        // Add new item
        updatedItems = [...state.currentSale.items, item];
      }
      
      // Calculate new total
      const total = updatedItems.reduce((sum, item) => sum + item.subtotal, 0);
      
      return {
        currentSale: {
          ...state.currentSale,
          items: updatedItems,
          total,
        },
      };
    });
  },
  
  removeItemFromSale: (productId) => {
    set((state) => {
      if (!state.currentSale) return state;
      
      const updatedItems = state.currentSale.items.filter(
        (item) => item.productId !== productId
      );
      
      // Calculate new total
      const total = updatedItems.reduce((sum, item) => sum + item.subtotal, 0);
      
      return {
        currentSale: {
          ...state.currentSale,
          items: updatedItems,
          total,
        },
      };
    });
  },
  
  updateItemQuantity: (productId, quantity) => {
    set((state) => {
      if (!state.currentSale) return state;
      
      const updatedItems = state.currentSale.items.map((item) => {
        if (item.productId === productId) {
          return {
            ...item,
            quantity,
            subtotal: quantity * item.unitPrice,
          };
        }
        return item;
      });
      
      // Calculate new total
      const total = updatedItems.reduce((sum, item) => sum + item.subtotal, 0);
      
      return {
        currentSale: {
          ...state.currentSale,
          items: updatedItems,
          total,
        },
      };
    });
  },
  
  completeSale: async (customerName, paymentMethod) => {
    const { currentSale } = get();
    
    if (!currentSale) {
      set({ error: 'No active sale to complete' });
      return;
    }
    
    if (currentSale.items.length === 0) {
      set({ error: 'Cannot complete a sale with no items' });
      return;
    }
    
    const completedSale: Omit<Sale, 'id'> = {
      ...currentSale,
      customerName,
      paymentMethod,
      status: 'completed',
    };
    
    await get().createSale(completedSale);
  },
  
  cancelCurrentSale: () => {
    set({ currentSale: null });
  },
}));