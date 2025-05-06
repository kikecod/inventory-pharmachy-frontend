import React from 'react';
import { cn } from '../../lib/utils';
import { Card, CardContent } from './Card';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  icon,
  trend,
  className,
}) => {
  return (
    <Card className={cn('hover:shadow-md transition-shadow', className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          {icon && (
            <div className="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600">
              {icon}
            </div>
          )}
        </div>
        <div className="mt-2">
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
          {description && (
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          )}
          {trend && (
            <div className="mt-2 flex items-center">
              <span
                className={cn(
                  'text-sm font-medium mr-1',
                  trend.isPositive ? 'text-success-600' : 'text-error-600'
                )}
              >
                {trend.isPositive ? '+' : ''}
                {trend.value}%
              </span>
              <svg
                className={cn(
                  'h-4 w-4',
                  trend.isPositive ? 'text-success-500' : 'text-error-500'
                )}
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                {trend.isPositive ? (
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                ) : (
                  <path
                    fillRule="evenodd"
                    d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                )}
              </svg>
              <span className="text-xs text-gray-500 ml-1">from last period</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};