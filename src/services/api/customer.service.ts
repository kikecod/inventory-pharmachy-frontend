import { API_URL, getHeaders, handleResponse } from './config';
import { Customer } from '../../types';

export const customerService = {
  async getCustomers(): Promise<Customer[]> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/api/clientes`, {
      headers: getHeaders(token),
    });
    return handleResponse(response);
  },

  async createCustomer(customer: Omit<Customer, 'idCliente'>): Promise<Customer> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/api/clientes`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(customer),
    });
    return handleResponse(response);
  },

  async updateCustomer(id: number, customer: Partial<Customer>): Promise<Customer> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/api/clientes/${id}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(customer),
    });
    return handleResponse(response);
  },

  async deleteCustomer(id: number): Promise<void> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/api/clientes/${id}`, {
      method: 'DELETE',
      headers: getHeaders(token),
    });
    if (!response.ok) throw new Error('Failed to delete customer');
  },
};
