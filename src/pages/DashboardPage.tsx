import React, { useEffect } from 'react';
import { StatsGrid } from '../components/dashboard/StatsGrid';
import { SalesChart } from '../components/dashboard/SalesChart';
import { CategorySalesChart } from '../components/dashboard/CategorySalesChart';
import { RecentSales } from '../components/dashboard/RecentSales';
import { useSalesStore } from '../store/salesStore';
import { useDashboardStore } from '../store/dashboardStore';

export const DashboardPage: React.FC = () => {
  const { sales, fetchSales } = useSalesStore();
  const { stats, isLoading, error, fetchDashboard } = useDashboardStore();

  useEffect(() => {
    // primero cargar ventas para RecentSales
    fetchSales().then(() => {
      // luego cargar los demás KPIs
      fetchDashboard();
    });
  }, [fetchSales, fetchDashboard]);

  // mientras carga mostramos el skeleton
  if (isLoading) {
    return <div>Cargando datos del dashboard…</div>;
  }
  if (error) {
    return <div className="text-red-600">Error: {error}</div>;
  }

  // una vez cargado, llenamos recentSales a mano:
  const recent = sales.slice(0, 5);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* header… */}
      <StatsGrid stats={{ ...stats, recentSales: recent }} isLoading={isLoading} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesChart data={recent} isLoading={isLoading} />
        <CategorySalesChart data={stats.salesByCategory} isLoading={isLoading} />
      </div>

      <RecentSales sales={recent} isLoading={isLoading} />
    </div>
  );
};