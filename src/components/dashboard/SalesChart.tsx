import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data for the chart
const data = [
  { name: 'Mon', sales: 3200 },
  { name: 'Tue', sales: 4500 },
  { name: 'Wed', sales: 3800 },
  { name: 'Thu', sales: 5000 },
  { name: 'Fri', sales: 6000 },
  { name: 'Sat', sales: 7500 },
  { name: 'Sun', sales: 5500 },
];

interface SalesChartProps {
  title?: string;
  isLoading?: boolean;
}

export const SalesChart: React.FC<SalesChartProps> = ({ 
  title = 'Sales Overview',
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 bg-gray-100 animate-pulse rounded" />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 10,
                right: 10,
                left: 10,
                bottom: 20,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis
                tickFormatter={(value) => `$${value}`}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                formatter={(value) => [`$${value}`, 'Sales']}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.5rem',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                }}
              />
              <Bar dataKey="sales" fill="#0d9488" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};