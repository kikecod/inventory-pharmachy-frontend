import { create } from 'zustand';
import { Product, Category } from '../types';
import { productsService } from '../services/api/products.service';
import { categoriesService } from '../services/api/categories.service';

interface ProductState {
  products: Product[];
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  fetchProducts: () => Promise<Product[]>;
  fetchCategories: () => Promise<void>;
  addProduct: (product: Omit<Product, 'idProducto'>) => Promise<void>;
  fetchProductsBySucursal: () => Promise<void>;
  updateProduct: (id: number, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
  addCategory: (category: Omit<Category, 'id'>) => Promise<void>;

}


export const useProductStore = create<ProductState>((set) => ({
  products: [],
  categories: [],
  isLoading: false,
  error: null,

  fetchProducts: async (): Promise<Product[]> => {
    set({ isLoading: true, error: null });

    try {
      const products = await productsService.getProductsBySucursal();
      set({ products, isLoading: false });
      return products;
    } catch (error) {
      set({ error: 'Failed to fetch products', isLoading: false });
      throw error;
    }
  },
  fetchProductsBySucursal: async () => {
    set({ isLoading: true, error: null });
    try {
      const fetched = await productsService.getProductsBySucursal(); // tu llamada real
      set({ products: fetched }); // importante para estado global
      return fetched;
    } catch (e: any) {
      set({ error: e.message });
      return [];
    } finally {
      set({ isLoading: false });
    }
  },

  fetchCategories: async () => {
    set({ isLoading: true, error: null });
  
    try {
      const categories = await categoriesService.getCategories(); // Llamada al servicio del backend
      set({ categories, isLoading: false }); // Asignar las categorías obtenidas al estado
    } catch (error) {
      set({ error: 'Failed to fetch categories', isLoading: false });
      throw error;
    }
  },

  addProduct: async (product: Omit<Product, 'idProducto'>) => {
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

  updateProduct: async (id: number, updates: Partial<Product>) => {
    set({ isLoading: true, error: null });
  
    try {
      // Separamos el precio del resto del payload
      const { precio, ...resto } = updates;
  
      // 1. Actualizar los datos generales del producto
      const updatedProduct = await productsService.updateProduct(id, resto);
  
      // 2. Si hay un precio definido, actualizarlo por separado
      if (precio !== undefined) {
        await productsService.updateProductPrice(id, precio);
        updatedProduct.precio = precio; // actualizamos el precio localmente
      }
  
      // 3. Actualizar el estado global de productos
      set((state) => ({
        products: state.products.map((product) =>
          product.idProducto === id ? updatedProduct : product
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to update product', isLoading: false });
      throw error;
    }
  },

  deleteProduct: async (id: number) => {
    set({ isLoading: true, error: null });
  
    try {
      await productsService.deleteProduct(id);
  
      // Actualizar el estado global eliminando el producto directamente
      set((state) => ({
        products: state.products.filter((product) => product.idProducto !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to delete product', isLoading: false });
      throw error;
    }
  },

  addCategory: async (category: Omit<Category, 'idCategoria'>) => {
    set({ isLoading: true, error: null });
  
    try {
      const newCategory: Category = {
        ...category,
        idCategoria: Date.now(), // Generar un idCategoria único
      };
  
      set((state) => ({
        categories: [...state.categories, newCategory],
        isLoading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to add category', isLoading: false });
      throw error;
    }
  }
}));