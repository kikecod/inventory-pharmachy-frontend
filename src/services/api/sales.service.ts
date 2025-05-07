import { API_URL, getHeaders, handleResponse } from './config';
import { Sale } from '../../types';

export const salesService = {
  async getSales(): Promise<Sale[]> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/api/ventas/resumen`, {
      headers: getHeaders(token),
    });
    const data = await handleResponse(response);

    return data.map((venta: any): Sale => ({
      id: venta.idVenta.toString(),
      customerName: venta.nombreCliente,
      createdAt: venta.fechaVenta,
      items: [venta.cantidadProductos], // Vacío por ahora, puedes llenarlo si la API lo provee
      total: venta.total,
      paymentMethod: venta.tipoVenta.toLowerCase() === 'contado' ? 'Efectivo' : 'Tarjeta',
      status: 'completed', // puedes ajustar según datos reales
      staffId: '1', // fijo por ahora, ajustable
    }));
  },

  async createSale(sale: Omit<Sale, 'id'>): Promise<Sale> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/sales`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(sale),
    });
    return handleResponse(response);
  },

  async getSale(id: string): Promise<Sale> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/sales/${id}`, {
      headers: getHeaders(token),
    });
    return handleResponse(response);
  },

  async updateSale(id: string, sale: Partial<Sale>): Promise<Sale> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/sales/${id}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(sale),
    });
    return handleResponse(response);
  },

  async generateInvoice(saleId: string): Promise<Blob> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/sales/${saleId}/invoice`, {
      headers: getHeaders(token),
    });
    return response.blob();
  },
};