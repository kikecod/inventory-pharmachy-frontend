// File: src/pages/DashboardPage.tsx
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
    // Primero cargamos las ventas (para RecentSales) y luego los KPIs
    fetchSales().then(fetchDashboard);
  }, [fetchSales, fetchDashboard]);

  if (isLoading) {
    return <div>Cargando datos del panel…</div>;
  }
  if (error) {
    return <div className="text-red-600">Error: {error}</div>;
  }

  // Tomamos las 5 ventas más recientes
  const recientes = sales.slice(0, 5);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Encabezado */}
      <div className="pb-5 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Visión General
        </h3>
        <p className="mt-2 max-w-4xl text-sm text-gray-500">
          Monitorea los indicadores clave de tu farmacia
        </p>
      </div>

      {/* Estadísticas rápidas */}
      <StatsGrid stats={{ ...stats, recentSales: recientes }} isLoading={isLoading} />

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesChart data={recientes} isLoading={isLoading} />
        <CategorySalesChart data={stats.salesByCategory} isLoading={isLoading} />
      </div>

      {/* Ventas recientes */}
      <RecentSales sales={recientes} isLoading={isLoading} />
    </div>
  );
};