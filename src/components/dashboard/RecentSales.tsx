import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from '../ui/Card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../ui/Table';
import { Badge } from '../ui/Badge';
import { formatCurrency, formatDate } from '../../lib/utils';
import { Sale } from '../../types';

interface RecentSalesProps {
  sales: Sale[];
  isLoading: boolean;
}

export const RecentSales: React.FC<RecentSalesProps> = ({ sales, isLoading }) => {
  const renderPaymentMethod = (method: Sale['paymentMethod']) => {
    switch (method) {
      case 'cash':
        return <Badge variant="success">Cash</Badge>;
      case 'card':
        return <Badge variant="primary">Card</Badge>;
      case 'insurance':
        return <Badge variant="secondary">Insurance</Badge>;
      default:
        return <Badge>{method}</Badge>;
    }
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Sales</CardTitle>
          <CardDescription>Last 5 transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-100 animate-pulse rounded" />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Sales</CardTitle>
        <CardDescription>Last 5 transactions</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sales.map((sale) => (
              <TableRow key={sale.id}>
                <TableCell className="font-medium">{sale.customerName}</TableCell>
                <TableCell>{sale.items.length} items</TableCell>
                <TableCell>{formatDate(sale.createdAt)}</TableCell>
                <TableCell>{renderPaymentMethod(sale.paymentMethod)}</TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(sale.total)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};