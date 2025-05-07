import { API_URL, getHeaders, handleResponse } from './config';
import { InventoryLote, StockBySucursal } from '../../types/index';

export const inventoryService = {
  async getLotes(): Promise<InventoryLote[]> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/api/inventario/lotes`, {
      headers: getHeaders(token),
    });
    return handleResponse(response);
  },

  async createLote(data: Omit<InventoryLote, 'idLote'>): Promise<{ idLote: number }> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/api/inventario/lotes`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  async updateLote(idLote: number, data: Omit<InventoryLote, 'idLote'>): Promise<{ message: string }> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/api/inventario/lotes/${idLote}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  async deleteLote(idLote: number): Promise<{ message: string }> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/api/inventario/lotes/${idLote}`, {
      method: 'DELETE',
      headers: getHeaders(token),
    });
    return handleResponse(response);
  },

  async getStockBySucursal(sucursalId: number): Promise<StockBySucursal[]> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/api/inventario/stock?sucursal=${sucursalId}`, {
      headers: getHeaders(token),
    });
    return handleResponse(response);
  },
};