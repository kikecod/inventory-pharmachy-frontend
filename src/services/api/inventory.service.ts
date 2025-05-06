import { API_URL, getHeaders, handleResponse } from './config';
import { InventoryItem } from '../../types';

export const inventoryService = {
  async getInventory(): Promise<InventoryItem[]> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/inventory`, {
      headers: getHeaders(token),
    });
    return handleResponse(response);
  },

  async getInventoryItem(id: string): Promise<InventoryItem> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/inventory/${id}`, {
      headers: getHeaders(token),
    });
    return handleResponse(response);
  },

  async createInventoryItem(item: Omit<InventoryItem, 'id'>): Promise<InventoryItem> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/inventory`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(item),
    });
    return handleResponse(response);
  },

  async updateInventoryItem(id: string, item: Partial<InventoryItem>): Promise<InventoryItem> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/inventory/${id}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(item),
    });
    return handleResponse(response);
  },

  async deleteInventoryItem(id: string): Promise<void> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/inventory/${id}`, {
      method: 'DELETE',
      headers: getHeaders(token),
    });
    return handleResponse(response);
  },
};