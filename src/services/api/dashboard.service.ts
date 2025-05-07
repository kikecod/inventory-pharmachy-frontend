import { API_URL, getHeaders, handleResponse } from './config';
import { DashboardStats } from '../../types';

export const dashboardService = {
  /**  GET /api/dashboard/resumen */
  async getResumen(): Promise<DashboardStats> {
    const token = localStorage.getItem('token');
    const resp = await fetch(`${API_URL}/api/dashboard/resumen`, {
      headers: getHeaders(token),
    });
    const data = await handleResponse(resp);
    return {
      totalSales: data.totalVentas,
      totalRevenue: data.totalIngresos,
      lowStockCount: data.productosBajoStock,
      expiringProductsCount: data.productosPorVencer,
      inventoryValue: data.valorInventario,
      recentSales: [],            // lo llenamos con useSalesStore
      salesByCategory: [],        // lo llenamos en el siguiente método
    };
  },

  /**  GET /api/dashboard/ventas-por-categoria */
  async getVentasPorCategoria(): Promise<{ category: string; amount: number }[]> {
    const token = localStorage.getItem('token');
    const resp = await fetch(`${API_URL}/api/dashboard/ventas-por-categoria`, {
      headers: getHeaders(token),
    });
    const data = await handleResponse(resp);
    return data.map((d: any) => ({
      category: d.categoria,
      amount: d.monto,
    }));
  },
};