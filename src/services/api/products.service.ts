import { API_URL, getHeaders, handleResponse } from './config';
import { Product } from '../../types';

export const productsService = {
  async getProductsBySucursal(): Promise<Product[]> {
    const token = localStorage.getItem('token') ?? undefined;
    const sucursalId = localStorage.getItem('idSucursal');
  
    if (!sucursalId) {
      throw new Error('Sucursal no seleccionada');
    }
    console.log('TOKEN:', token);
    console.log('SUCURSAL ID:', sucursalId);
    const response = await fetch(`${API_URL}/api/productos/sucursal`, {
      headers: {
        ...getHeaders(token),
        'Sucursal-ID': sucursalId, // ✅ el header correcto
      },
    });
    console.log('RESPONSE STATUS:', response.status);
  
    const data = await handleResponse(response);
  
    return data.map((item: any) => ({
      idProducto: item.idProducto,
      nombre: item.nombre,
      descripcion: item.descripcion,
      stock: item.stock,
      precio: item.precio,
      unidad: item.unidad,
      proveedor: item.proveedor,
      categoria: item.categoria,
    }));
    
  },

  async searchProducts(query: string): Promise<Product[]> {
    const token = localStorage.getItem('token') ?? undefined;
    const response = await fetch(`${API_URL}/products/search?q=${encodeURIComponent(query)}`, {
      headers: getHeaders(token),
    });
    const data = await handleResponse(response);
    return data.map((item: any) => ({
      idProducto: item.idProducto,
      nombre: item.nombre,
      descripcion: item.descripcion,
      stock: item.stock,
      idUnidad: item.idUnidad,
      idProveedor: item.idProveedor,
      idCategoria: item.idCategoria,
      precio: item.precio, // ✅ aquí también
    }));
  },

  async getProduct(id: string): Promise<Product> {
    const token = localStorage.getItem('token') ?? undefined;
    const response = await fetch(`${API_URL}/api/productos/${id}`, {
      headers: getHeaders(token),
    });
    const item = await handleResponse(response);
    return {
      idProducto: item.idProducto,
      nombre: item.nombre,
      descripcion: item.descripcion,
      stock: item.stock,
      idUnidad: item.idUnidad,
      idProveedor: item.idProveedor,
      idCategoria: item.idCategoria,
      precio: item.precio, // ✅ aquí también
    };
  },

  async createProduct(product: Omit<Product, 'idProducto'>, idSucursal: number): Promise<Product> {
    const token = localStorage.getItem('token') ?? undefined;
    const response = await fetch(`${API_URL}/api/productos`, {
        method: 'POST',
        headers: {
            ...getHeaders(token),
            'Sucursal-ID': idSucursal.toString(),
        },
        body: JSON.stringify(product),
    });
    return handleResponse(response);
},

  async updateProduct(id: number, product: Partial<Product>): Promise<Product> {
    console.log('Actualizando producto ID:', id, product);
    const token = localStorage.getItem('token') ?? undefined;
    console.log('⛳ Haciendo PUT al backend con ID:', id);
    console.log('⛳ Payload:', product);
    const response = await fetch(`${API_URL}/api/productos/${id}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(product),
    });
    return handleResponse(response);
  },
  async updateProductPrice(id: number, precioUnitario: number): Promise<void> {
    const token = localStorage.getItem('token') ?? undefined;
    const response = await fetch(`${API_URL}/api/productos/${id}/precio`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify({ precioUnitario }),
    });
  
    if (!response.ok) {
      throw new Error('Error al actualizar el precio');
    }
  },

  async deleteProduct(id: number): Promise<void> {
    const token = localStorage.getItem('token') ?? undefined;
    const response = await fetch(`${API_URL}/api/productos/${id}`, {
      method: 'DELETE',
      headers: getHeaders(token),
    });
  
    if (!response.ok) {
      throw new Error(`Error deleting product: ${response.status}`);
    }
  }
};