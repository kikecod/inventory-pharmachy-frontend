import { API_URL, getHeaders, handleResponse } from './config';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  rol: string;
}

interface AuthResponse {
  token: string;
  usuario: {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    rol: string;
  };
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(credentials),
    });

    return handleResponse(response);
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });

    return handleResponse(response);
  },
};