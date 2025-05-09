// src/services/api/usuario.service.ts
import { API_URL, getHeaders, handleResponse } from './config';
import {
  Usuario,
  CreateUsuarioDTO,
  UpdateUsuarioDTO,
  ChangePasswordAdminDTO,
  ChangePasswordSelfDTO,
  ChangeRoleDTO
} from '../../types/index';

const base = `${API_URL}/api/usuarios`;

export const usuarioService = {
  async getAll(): Promise<Usuario[]> {
    const token = localStorage.getItem('token');
    const res = await fetch(base, { headers: getHeaders(token) });
    return handleResponse(res);
  },

  async create(dto: CreateUsuarioDTO): Promise<Usuario> {
    const token = localStorage.getItem('token');
    const res = await fetch(base, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(dto),
    });
    return handleResponse(res);
  },

  async update(id: number, dto: UpdateUsuarioDTO): Promise<Usuario> {
    const token = localStorage.getItem('token');
    const res = await fetch(`${base}/${id}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(dto),
    });
    return handleResponse(res);
  },

  async delete(id: number): Promise<void> {
    const token = localStorage.getItem('token');
    const res = await fetch(`${base}/${id}`, {
      method: 'DELETE',
      headers: getHeaders(token),
    });
    if (!res.ok) throw new Error('Error al eliminar usuario');
  },

  async changePasswordAdmin(id: number, dto: ChangePasswordAdminDTO): Promise<void> {
    const token = localStorage.getItem('token');
    const res = await fetch(`${base}/${id}/cambiar-password`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(dto),
    });
    if (!res.ok) throw new Error('Error al cambiar contraseña (admin)');
  },

  async changePasswordSelf(dto: ChangePasswordSelfDTO): Promise<void> {
    const token = localStorage.getItem('token');
    const res = await fetch(`${base}/cambiar-password`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(dto),
    });
    if (!res.ok) throw new Error('Error al cambiar contraseña');
  },

  async changeRole(id: number, dto: ChangeRoleDTO): Promise<void> {
    const token = localStorage.getItem('token');
    const res = await fetch(`${base}/${id}/rol`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(dto),
    });
    if (!res.ok) throw new Error('Error al cambiar rol');
  },

  async findByEmail(email: string): Promise<Usuario> {
    const token = localStorage.getItem('token');
    const res = await fetch(`${base}/buscar?email=${encodeURIComponent(email)}`, {
      headers: getHeaders(token),
    });
    return handleResponse(res);
  },

  async findByRole(nombreRol: string): Promise<Usuario[]> {
    const token = localStorage.getItem('token');
    const res = await fetch(`${base}/rol/${encodeURIComponent(nombreRol)}`, {
      headers: getHeaders(token),
    });
    return handleResponse(res);
  }
};