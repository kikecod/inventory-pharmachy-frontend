import { create } from 'zustand';
import { dashboardService } from '../services/api/dashboard.service';
import { DashboardStats } from '../types';

interface DashboardState {
  stats: DashboardStats;
  isLoading: boolean;
  error: string | null;
  fetchDashboard: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  stats: {
    totalSales: 0,
    totalRevenue: 0,
    lowStockCount: 0,
    expiringProductsCount: 0,
    inventoryValue: 0,
    recentSales: [],
    salesByCategory: [],
  },
  isLoading: false,
  error: null,

  fetchDashboard: async () => {
    set({ isLoading: true, error: null });
    try {
      // 1) Resumen general
      const resumen = await dashboardService.getResumen();
      // 2) Ventas por categoría
      const byCategory = await dashboardService.getVentasPorCategoria();
      // 3) Recientes (usamos useSalesStore dentro de tu DashboardPage)
      set({
        stats: {
          ...resumen,
          salesByCategory: byCategory,
        },
      });
    } catch (e: any) {
      set({ error: e.message || 'Error fetching dashboard', isLoading: false });
    } finally {
      set({ isLoading: false });
    }
  },
}));