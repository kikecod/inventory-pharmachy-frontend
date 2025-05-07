import { API_URL, getHeaders, handleResponse } from '../api/config';
import { Sucursal } from '../../types/sucursal';

export const sucursalService = {
  async getAll(): Promise<Sucursal[]> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/api/sucursales`, {
      headers: getHeaders(token),
    });
    return handleResponse(response);
  },

  async create(sucursal: Omit<Sucursal, 'idSucursal' | 'fechaCreacion'>): Promise<Sucursal> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/api/sucursales`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(sucursal),
    });
    return handleResponse(response);
  },
};