import { create } from 'zustand';
import { Product, Category } from '../types';

interface ProductState {
  products: Product[];
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
}

// Mock data for demonstration
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Paracetamol 500mg',
    description: 'Pain relief and fever reducer',
    category: 'Analgesics',
    sku: 'PARA-500',
    price: 5.99,
    costPrice: 2.50,
    stockQuantity: 150,
    expiryDate: '2025-12-31',
    manufacturer: 'PharmaCo',
    requiresPrescription: false,
  },
  {
    id: '2',
    name: 'Amoxicillin 250mg',
    description: 'Antibiotic for bacterial infections',
    category: 'Antibiotics',
    sku: 'AMOX-250',
    price: 12.99,
    costPrice: 6.75,
    stockQuantity: 85,
    expiryDate: '2025-06-30',
    manufacturer: 'MediPharm',
    requiresPrescription: true,
  },
  {
    id: '3',
    name: 'Vitamin C 1000mg',
    description: 'Dietary supplement for immune support',
    category: 'Supplements',
    sku: 'VITC-1000',
    price: 8.50,
    costPrice: 3.20,
    stockQuantity: 200,
    expiryDate: '2026-03-15',
    manufacturer: 'VitaLife',
    requiresPrescription: false,
  },
  {
    id: '4',
    name: 'Ibuprofen 400mg',
    description: 'Anti-inflammatory and pain relief',
    category: 'Analgesics',
    sku: 'IBUP-400',
    price: 6.99,
    costPrice: 2.85,
    stockQuantity: 120,
    expiryDate: '2026-02-28',
    manufacturer: 'PharmaCo',
    requiresPrescription: false,
  },
  {
    id: '5',
    name: 'Loratadine 10mg',
    description: 'Antihistamine for allergy relief',
    category: 'Allergy',
    sku: 'LORA-10',
    price: 9.99,
    costPrice: 4.50,
    stockQuantity: 75,
    expiryDate: '2025-08-15',
    manufacturer: 'AllerCare',
    requiresPrescription: false,
  },
];

const mockCategories: Category[] = [
  { id: '1', name: 'Analgesics', description: 'Pain relievers and fever reducers' },
  { id: '2', name: 'Antibiotics', description: 'Medications that kill or inhibit the growth of bacteria' },
  { id: '3', name: 'Supplements', description: 'Vitamins and dietary supplements' },
  { id: '4', name: 'Allergy', description: 'Medications for allergy relief' },
  { id: '5', name: 'Cardiovascular', description: 'Medications for heart and blood vessel conditions' },
];

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  categories: [],
  isLoading: false,
  error: null,
  
  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      set({ products: mockProducts });
    } catch (error) {
      set({ error: 'Failed to fetch products' });
    } finally {
      set({ isLoading: false });
    }
  },
  
  fetchCategories: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 600));
      set({ categories: mockCategories });
    } catch (error) {
      set({ error: 'Failed to fetch categories' });
    } finally {
      set({ isLoading: false });
    }
  },
  
  addProduct: async (product) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newProduct: Product = {
        ...product,
        id: Date.now().toString(),
      };
      
      set((state) => ({
        products: [...state.products, newProduct],
      }));
    } catch (error) {
      set({ error: 'Failed to add product' });
    } finally {
      set({ isLoading: false });
    }
  },
  
  updateProduct: async (id, updates) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      set((state) => ({
        products: state.products.map((product) => 
          product.id === id ? { ...product, ...updates } : product
        ),
      }));
    } catch (error) {
      set({ error: 'Failed to update product' });
    } finally {
      set({ isLoading: false });
    }
  },
  
  deleteProduct: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 600));
      
      set((state) => ({
        products: state.products.filter((product) => product.id !== id),
      }));
    } catch (error) {
      set({ error: 'Failed to delete product' });
    } finally {
      set({ isLoading: false });
    }
  },
  
  addCategory: async (category) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const newCategory: Category = {
        ...category,
        id: Date.now().toString(),
      };
      
      set((state) => ({
        categories: [...state.categories, newCategory],
      }));
    } catch (error) {
      set({ error: 'Failed to add category' });
    } finally {
      set({ isLoading: false });
    }
  },
}));