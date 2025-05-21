import { create } from 'zustand';
import { Sale, SaleItem } from '../types';
import { salesService } from '../services/api/sales.service';
import { toast } from 'react-hot-toast';

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
  completeSale: (clienteId: number, customerName: string, paymentMethod: Sale['paymentMethod']) => Promise<void>;
  cancelCurrentSale: () => void;
  isGeneratingReport: boolean;
  generateReport: (data: ReporteRequest) => Promise<void>;
}

const emptySale: Omit<Sale, 'id'> = {
  customerName: '',
  items: [],
  total: 0,
  paymentMethod: 'Efectivo',
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
      const sales = await salesService.getSales();
      set({ sales });
    } catch (error) {
      console.error('Error fetching sales:', error);
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
  
  completeSale: async (clienteId, customerName, paymentMethod) => {
    const { currentSale } = get();
  
    if (!currentSale) {
      set({ error: 'No active sale to complete' });
      return;
    }
  
    if (currentSale.items.length === 0) {
      set({ error: 'Cannot complete a sale with no items' });
      return;
    }
  
    const tipoVenta = paymentMethod === 'Efectivo' ? 'CONTADO' : 'CREDITO';
  
    try {
      const response = await salesService.createSaleWithDetails({
        idCliente: clienteId,
        idUsuario: parseInt(currentSale.staffId),
        tipoVenta,
        total: currentSale.total,
        detalle: currentSale.items.map(item => ({
          idProducto: parseInt(item.productId),
          cantidad: item.quantity,
          subtotal: item.subtotal,
        }))
      });
      
      const idVenta = parseInt(response.idVenta);
      console.log('ID de venta recibido:', response.idVenta);
      
      // ⏳ guarda temporalmente el ID para permitir luego una acción explícita del usuario
      setTimeout(async () => {
        const blob = await salesService.generateInvoice(idVenta);
        const url = window.URL.createObjectURL(blob);
        
        // ✅ FORZA interacción directa con botón
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        link.click();
      }, 0);
  
      // Limpiar estado
      set((state) => ({
        currentSale: null,
        sales: [...state.sales], // podrías hacer refetch si es necesario
      }));
  
    } catch (error) {
      console.error('Failed to complete sale:', error);
      set({ error: 'Error al registrar la venta' });
    }
  },
  
  cancelCurrentSale: () => {
    set({ currentSale: null });
  },
  
isGeneratingReport: false,

generateReport: async (data) => {
  set({ isGeneratingReport: true });
  try {
    const blob = await salesService.generateReport(data);

    // ✅ Verificación explícita del tipo
    if (!(blob instanceof Blob)) {
      throw new Error('El servidor no devolvió un archivo válido');
    }

    // ✅ Crear URL y descargar archivo
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte-ventas.${data.formato}`;
    a.target = '_blank';
    a.click();

    toast.success('Reporte generado correctamente');
  } catch (error) {
    console.error('Error al generar reporte:', error);
    toast.error(`Error al generar el reporte: ${(error as Error).message}`);
  } finally {
    set({ isGeneratingReport: false });
  }
  }
  
}));