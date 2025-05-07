import { API_URL, getHeaders, handleResponse } from './config';
import {
  Provider,
  ProviderProduct,
  PurchaseRecord,
  CreateOrderDTO,
  CreateOrderResponse
} from '../../types/index';

const base = `${API_URL}/api/proveedores`;

export const proveedorService = {
  // CRUD proveedores
  async getAll(): Promise<Provider[]> {
    const token = localStorage.getItem('token');
    const res = await fetch(base, { headers: getHeaders(token) });
    return handleResponse(res);
  },

  async getById(id: number): Promise<Provider> {
    const token = localStorage.getItem('token');
    const res = await fetch(`${base}/${id}`, { headers: getHeaders(token) });
    return handleResponse(res);
  },

  async create(provider: Omit<Provider, 'idProveedor'>): Promise<Provider> {
    const token = localStorage.getItem('token');
    const res = await fetch(base, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(provider),
    });
    return handleResponse(res);
  },

  async update(id: number, updates: Partial<Provider>): Promise<Provider> {
    const token = localStorage.getItem('token');
    const res = await fetch(`${base}/${id}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(updates),
    });
    return handleResponse(res);
  },

  async delete(id: number): Promise<void> {
    const token = localStorage.getItem('token');
    const res = await fetch(`${base}/${id}`, {
      method: 'DELETE',
      headers: getHeaders(token),
    });
    if (!res.ok) throw new Error('Failed to delete provider');
  },

  // Productos de un proveedor
  async getProductsByProvider(id: number): Promise<ProviderProduct[]> {
    const token = localStorage.getItem('token');
    const res = await fetch(`${base}/${id}/productos`, {
      headers: getHeaders(token),
    });
    return handleResponse(res);
  },

  // Historial de compras
  async getPurchaseHistory(): Promise<PurchaseRecord[]> {
    const token = localStorage.getItem('token');
    const res = await fetch(`${base}/historial-compras`, {
      headers: getHeaders(token),
    });
    return handleResponse(res);
  },

  // Crear nuevo pedido a proveedor
  async createPurchaseOrder(dto: CreateOrderDTO): Promise<CreateOrderResponse> {
    const token = localStorage.getItem('token');
    const res = await fetch(`${base}/pedidos`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(dto),
    });
    return handleResponse(res);
  },
};