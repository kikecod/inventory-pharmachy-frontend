import { create } from 'zustand';
import { Product, Category } from '../types';
import { productsService } from '../services/api/products.service';

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

// Mock categories for demonstration
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
      const products = await productsService.getProducts();
      set({ products, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch products', isLoading: false });
      throw error;
    }
  },
  
  fetchCategories: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Using mock categories for now
      set({ categories: mockCategories, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch categories', isLoading: false });
      throw error;
    }
  },
  
  addProduct: async (product) => {
    set({ isLoading: true, error: null });
    
    try {
      const newProduct = await productsService.createProduct(product);
      set((state) => ({
        products: [...state.products, newProduct],
        isLoading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to add product', isLoading: false });
      throw error;
    }
  },
  
  updateProduct: async (id, updates) => {
    set({ isLoading: true, error: null });
    
    try {
      const updatedProduct = await productsService.updateProduct(id, updates);
      set((state) => ({
        products: state.products.map((product) => 
          product.id === id ? updatedProduct : product
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to update product', isLoading: false });
      throw error;
    }
  },
  
  deleteProduct: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      await productsService.deleteProduct(id);
      set((state) => ({
        products: state.products.filter((product) => product.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to delete product', isLoading: false });
      throw error;
    }
  },
  
  addCategory: async (category) => {
    set({ isLoading: true, error: null });
    
    try {
      const newCategory: Category = {
        ...category,
        id: Date.now().toString(),
      };
      
      set((state) => ({
        categories: [...state.categories, newCategory],
        isLoading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to add category', isLoading: false });
      throw error;
    }
  },
}));