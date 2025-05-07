import { API_URL, getHeaders, handleResponse } from './config';
import { Category } from '../../types';

export const categoriesService = {
  async getCategories(): Promise<Category[]> {
    const token = localStorage.getItem('token') ?? undefined;
    const response = await fetch(`${API_URL}/api/categorias`, {
      headers: getHeaders(token),
    });
    const data = await handleResponse(response);
    return data.map((item: any) => ({
      idCategoria: item.idCategoria,
      nombre: item.nombre,
      descripcion: item.descripcion,
    }));
  },

  async getCategoryById(id: string): Promise<Category> {
    const token = localStorage.getItem('token') ?? undefined;
    const response = await fetch(`${API_URL}/api/categorias/${id}`, {
      headers: getHeaders(token),
    });
    const item = await handleResponse(response);
    return {
      idCategoria: item.idCategoria,
      nombre: item.nombre,
      descripcion: item.descripcion,
    };
  },

  async getCategorySales(): Promise<{ idCategoria: number; ventas: number }[]> {
    const token = localStorage.getItem('token') ?? undefined;
    const response = await fetch(`${API_URL}/api/ventas/reportes/stock-por-categoria`, {
      headers: getHeaders(token),
    });
    return handleResponse(response);
  }
};

