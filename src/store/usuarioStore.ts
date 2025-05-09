// src/store/usuarioStore.ts
import { create } from 'zustand';
import {
  Usuario,
  CreateUsuarioDTO,
  UpdateUsuarioDTO,
  ChangePasswordAdminDTO,
  ChangePasswordSelfDTO,
  ChangeRoleDTO
} from '../types/index';
import { usuarioService } from '../services/api/usuario.service';

interface UsuarioState {
  usuarios: Usuario[];
  isLoading: boolean;
  error: string | null;

  fetchUsuarios: () => Promise<void>;
  createUsuario: (dto: CreateUsuarioDTO) => Promise<void>;
  updateUsuario: (id: number, dto: UpdateUsuarioDTO) => Promise<void>;
  deleteUsuario: (id: number) => Promise<void>;
  changePasswordAdmin: (id: number, dto: ChangePasswordAdminDTO) => Promise<void>;
  changePasswordSelf: (dto: ChangePasswordSelfDTO) => Promise<void>;
  changeRole: (id: number, dto: ChangeRoleDTO) => Promise<void>;
  findByEmail: (email: string) => Promise<Usuario>;
  findByRole: (rol: string) => Promise<void>;
}

export const useUsuarioStore = create<UsuarioState>((set) => ({
  usuarios: [],
  isLoading: false,
  error: null,

  fetchUsuarios: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await usuarioService.getAll();
      set({ usuarios: data });
    } catch (e: any) {
      set({ error: e.message });
    } finally {
      set({ isLoading: false });
    }
  },

  createUsuario: async (dto) => {
    set({ isLoading: true, error: null });
    try {
      const nuevo = await usuarioService.create(dto);
      set((state) => ({ usuarios: [...state.usuarios, nuevo] }));
    } catch (e: any) {
      set({ error: e.message });
      throw e;
    } finally {
      set({ isLoading: false });
    }
  },

  updateUsuario: async (id, dto) => {
    set({ isLoading: true, error: null });
    try {
      const up = await usuarioService.update(id, dto);
      set((state) => ({
        usuarios: state.usuarios.map(u => u.idUsuario === id ? up : u)
      }));
    } catch (e: any) {
      set({ error: e.message });
      throw e;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteUsuario: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await usuarioService.delete(id);
      set((state) => ({
        usuarios: state.usuarios.filter(u => u.idUsuario !== id)
      }));
    } catch (e: any) {
      set({ error: e.message });
      throw e;
    } finally {
      set({ isLoading: false });
    }
  },

  changePasswordAdmin: async (id, dto) => {
    try {
      await usuarioService.changePasswordAdmin(id, dto);
    } catch(e) {
      set({ error: (e as Error).message });
      throw e;
    }
  },

  changePasswordSelf: async (dto) => {
    try {
      await usuarioService.changePasswordSelf(dto);
    } catch(e) {
      set({ error: (e as Error).message });
      throw e;
    }
  },

  changeRole: async (id, dto) => {
    try {
      await usuarioService.changeRole(id, dto);
      // refrescar lista
      await usuarioService.getAll().then(data => set({ usuarios: data }));
    } catch(e) {
      set({ error: (e as Error).message });
      throw e;
    }
  },

  findByEmail: async (email) => {
    const found = await usuarioService.findByEmail(email);
    return found;
  },

  findByRole: async (rol) => {
    set({ isLoading: true, error: null });
    try {
      const data = await usuarioService.findByRole(rol);
      set({ usuarios: data });
    } catch(e: any) {
      set({ error: e.message });
    } finally {
      set({ isLoading: false });
    }
  },
}));