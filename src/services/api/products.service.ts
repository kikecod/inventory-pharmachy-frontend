import { API_URL, getHeaders, handleResponse } from './config';
import { Product } from '../../types';

export const productsService = {
  async getProducts(): Promise<Product[]> {
    const token = localStorage.getItem('token') ?? undefined;
    const response = await fetch(`${API_URL}/api/productos`, {
      headers: getHeaders(token),
    });
    const data = await handleResponse(response);
    return data.map((item: any) => ({
      idProducto: item.idProducto,
      nombre: item.nombre,
      descripcion: item.descripcion,
      stock: item.stock,
      idUnidad: item.idUnidad,
      idProveedor: item.idProveedor,
      idCategoria: item.idCategoria,
      precio: item.precio, // ✅ agrega esto
    }));
  },

  async searchProducts(query: string): Promise<Product[]> {
    const token = localStorage.getItem('token') ?? undefined;
    const response = await fetch(`${API_URL}/products/search?q=${encodeURIComponent(query)}`, {
      headers: getHeaders(token),
    });
    const data = await handleResponse(response);
    return data.map((item: any) => ({
      idProducto: item.idProducto,
      nombre: item.nombre,
      descripcion: item.descripcion,
      stock: item.stock,
      idUnidad: item.idUnidad,
      idProveedor: item.idProveedor,
      idCategoria: item.idCategoria,
      precio: item.precio, // ✅ aquí también
    }));
  },

  async getProduct(id: string): Promise<Product> {
    const token = localStorage.getItem('token') ?? undefined;
    const response = await fetch(`${API_URL}/api/productos/${id}`, {
      headers: getHeaders(token),
    });
    const item = await handleResponse(response);
    return {
      idProducto: item.idProducto,
      nombre: item.nombre,
      descripcion: item.descripcion,
      stock: item.stock,
      idUnidad: item.idUnidad,
      idProveedor: item.idProveedor,
      idCategoria: item.idCategoria,
      precio: item.precio, // ✅ aquí también
    };
  },

  async createProduct(product: Omit<Product, 'idProducto'>): Promise<Product> {
    const token = localStorage.getItem('token') ?? undefined;
    const response = await fetch(`${API_URL}/api/productos`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(product),
    });
    return handleResponse(response);
  },

  async updateProduct(id: number, product: Partial<Product>): Promise<Product> {
    const token = localStorage.getItem('token') ?? undefined;
    const response = await fetch(`${API_URL}/api/productos/${id}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(product),
    });
    return handleResponse(response);
  },

  async deleteProduct(id: number): Promise<void> {
    const token = localStorage.getItem('token') ?? undefined;
    const response = await fetch(`${API_URL}/api/productos/${id}`, {
      method: 'DELETE',
      headers: getHeaders(token),
    });
  
    if (!response.ok) {
      throw new Error(`Error deleting product: ${response.status}`);
    }
  }
};