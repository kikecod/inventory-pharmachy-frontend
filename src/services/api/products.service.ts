import { API_URL, getHeaders, handleResponse } from './config';
import { Product } from '../../types';

export const productsService = {
  async getProducts(): Promise<Product[]> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/api/productos`, {
      headers: getHeaders(token),
    });
    return handleResponse(response);
  },

  async searchProducts(query: string): Promise<Product[]> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/products/search?q=${encodeURIComponent(query)}`, {
      headers: getHeaders(token),
    });
    return handleResponse(response);
  },

  async getProduct(id: string): Promise<Product> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/api/productos/${id}`, {
      headers: getHeaders(token),
    });
    return handleResponse(response);
  },

  async createProduct(product: Omit<Product, 'id'>): Promise<Product> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/api/productos`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(product),
    });
    return handleResponse(response);
  },

  async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/api/productos/${id}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(product),
    });
    return handleResponse(response);
  },

  async deleteProduct(id: string): Promise<void> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/api/productos/${id}`, {
      method: 'DELETE',
      headers: getHeaders(token),
    });
    return handleResponse(response);
  },
};