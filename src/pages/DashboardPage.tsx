import React, { useEffect, useState } from 'react';
import { StatsGrid } from '../components/dashboard/StatsGrid';
import { SalesChart } from '../components/dashboard/SalesChart';
import { CategorySalesChart } from '../components/dashboard/CategorySalesChart';
import { RecentSales } from '../components/dashboard/RecentSales';
import { useSalesStore } from '../store/salesStore';
import { DashboardStats } from '../types';

export const DashboardPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { sales, fetchSales } = useSalesStore();
  const [stats, setStats] = useState<DashboardStats>({
    totalSales: 0,
    totalRevenue: 0,
    lowStockCount: 5,
    expiringProductsCount: 3,
    recentSales: [],
    salesByCategory: [],
    inventoryValue: 0
  });

  useEffect(() => {
    // Load data
    const fetchData = async () => {
      await fetchSales();
      // This would typically involve more API calls in a real system
      setIsLoading(false);
    };

    fetchData();

    // Calculate dashboard stats
    const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
    const totalSales = sales.length;

    // Update stats
    setStats({
      totalSales,
      totalRevenue,
      lowStockCount: 5, // Mock data
      expiringProductsCount: 3, // Mock data
      recentSales: sales.slice(0, 5),
      salesByCategory: [],
      inventoryValue: 25000 // Mock data
    });
  }, [fetchSales, sales]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="pb-5 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Dashboard Overview
        </h3>
        <p className="mt-2 max-w-4xl text-sm text-gray-500">
          Monitor your pharmacy's key metrics and performance indicators
        </p>
      </div>

      <StatsGrid stats={stats} isLoading={isLoading} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesChart isLoading={isLoading} />
        <CategorySalesChart isLoading={isLoading} />
      </div>

      <RecentSales sales={stats.recentSales} isLoading={isLoading} />
    </div>
  );
};