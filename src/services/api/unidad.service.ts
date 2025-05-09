// File: src/services/api/unidad.service.ts

import { API_URL, getHeaders, handleResponse } from './config';
import { Unidad } from '../../types';

export const unidadService = {
  /**
   * Obtener todas las unidades
   */
  async getAll(): Promise<Unidad[]> {
    const token = localStorage.getItem('token') ?? undefined;
    const response = await fetch(`${API_URL}/api/unidades`, {
      headers: getHeaders(token),
    });
    return handleResponse(response);
  },

  /**
   * Obtener una unidad por ID
   */
  async getById(id: number): Promise<Unidad> {
    const token = localStorage.getItem('token') ?? undefined;
    const response = await fetch(`${API_URL}/api/unidades/${id}`, {
      headers: getHeaders(token),
    });
    return handleResponse(response);
  },

  /**
   * Crear una nueva unidad
   */
  async create(data: Omit<Unidad, 'idUnidad'>): Promise<Unidad> {
    const token = localStorage.getItem('token') ?? undefined;
    const response = await fetch(`${API_URL}/api/unidades`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  /**
   * Actualizar una unidad existente
   */
  async update(id: number, data: Partial<Unidad>): Promise<void> {
    const token = localStorage.getItem('token') ?? undefined;
    const response = await fetch(`${API_URL}/api/unidades/${id}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  /**
   * Eliminar una unidad
   */
  async delete(id: number): Promise<void> {
    const token = localStorage.getItem('token') ?? undefined;
    const response = await fetch(`${API_URL}/api/unidades/${id}`, {
      method: 'DELETE',
      headers: getHeaders(token),
    });
    return handleResponse(response);
  },
};