import React from 'react';
import { StatCard } from '../ui/StatCard';
import { DollarSign, Package, AlertTriangle, TrendingUp } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';
import { DashboardStats } from '../../types';

interface StatsGridProps {
  stats: DashboardStats;
  isLoading: boolean;
}

export const StatsGrid: React.FC<StatsGridProps> = ({ stats, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div 
            key={i} 
            className="h-32 bg-gray-100 rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Total Revenue"
        value={formatCurrency(stats.totalRevenue)}
        description="Last 30 days"
        icon={<DollarSign size={20} />}
        trend={{ value: 12, isPositive: true }}
      />
      
      <StatCard
        title="Total Sales"
        value={stats.totalSales}
        description="Last 30 days"
        icon={<TrendingUp size={20} />}
        trend={{ value: 8, isPositive: true }}
      />
      
      <StatCard
        title="Low Stock Items"
        value={stats.lowStockCount}
        description="Items below threshold"
        icon={<Package size={20} />}
        trend={{ value: 5, isPositive: false }}
      />
      
      <StatCard
        title="Expiring Soon"
        value={stats.expiringProductsCount}
        description="Within next 90 days"
        icon={<AlertTriangle size={20} />}
        trend={{ value: 2, isPositive: false }}
      />
    </div>
  );
};