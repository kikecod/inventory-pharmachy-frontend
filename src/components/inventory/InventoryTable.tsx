import React, { useState, useEffect } from 'react';
import { Search, Filter, AlertTriangle, Plus } from 'lucide-react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../ui/Table';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Input } from '../ui/Input';
import { formatDate } from '../../lib/utils';
import { InventoryItem, Product } from '../../types';
import { useProductStore } from '../../store/productStore';

interface InventoryTableProps {
  inventory: InventoryItem[];
  isLoading: boolean;
  onAddItem: () => void;
  onEditItem: (item: InventoryItem) => void;
}

export const InventoryTable: React.FC<InventoryTableProps> = ({
  inventory,
  isLoading,
  onAddItem,
  onEditItem,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState<InventoryItem[]>([]);
  const { products, fetchProducts } = useProductStore();
  
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);
  
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredItems(inventory);
      return;
    }
    
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = inventory.filter((item) => {
      const product = products.find((p) => p.id === item.productId);
      return (
        product?.name.toLowerCase().includes(lowercasedQuery) ||
        item.batchNumber.toLowerCase().includes(lowercasedQuery) ||
        item.supplierName.toLowerCase().includes(lowercasedQuery)
      );
    });
    
    setFilteredItems(filtered);
  }, [searchQuery, inventory, products]);
  
  const getProductName = (productId: string): string => {
    const product = products.find((p) => p.id === productId);
    return product?.name || 'Unknown Product';
  };
  
  const isLowStock = (quantity: number): boolean => {
    return quantity <= 30;
  };
  
  const isExpiringSoon = (expiryDate: string): boolean => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 90;
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col space-y-4">
        <div className="h-10 bg-gray-100 animate-pulse rounded w-1/3" />
        <div className="h-64 bg-gray-100 animate-pulse rounded" />
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="relative w-full md:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Search inventory..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="outline" leftIcon={<Filter size={16} />}>
            Filter
          </Button>
          
          <Button leftIcon={<Plus size={16} />} onClick={onAddItem}>
            Add Item
          </Button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Batch</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Expiry Date</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>Received</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                  No inventory items found.
                </TableCell>
              </TableRow>
            ) : (
              filteredItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{getProductName(item.productId)}</TableCell>
                  <TableCell>{item.batchNumber}</TableCell>
                  <TableCell>
                    {isLowStock(item.quantity) ? (
                      <div className="flex items-center">
                        <span>{item.quantity}</span>
                        <AlertTriangle size={16} className="ml-2 text-warning-500" />
                      </div>
                    ) : (
                      item.quantity
                    )}
                  </TableCell>
                  <TableCell>
                    {isExpiringSoon(item.expiryDate) ? (
                      <div className="flex items-center">
                        <span>{formatDate(item.expiryDate)}</span>
                        <AlertTriangle size={16} className="ml-2 text-error-500" />
                      </div>
                    ) : (
                      formatDate(item.expiryDate)
                    )}
                  </TableCell>
                  <TableCell>{item.supplierName}</TableCell>
                  <TableCell>{formatDate(item.receivedDate)}</TableCell>
                  <TableCell>
                    {isLowStock(item.quantity) && (
                      <Badge variant="warning">Low Stock</Badge>
                    )}
                    {isExpiringSoon(item.expiryDate) && (
                      <Badge variant="error" className="ml-1">Expiring Soon</Badge>
                    )}
                    {!isLowStock(item.quantity) && !isExpiringSoon(item.expiryDate) && (
                      <Badge variant="success">Good</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEditItem(item)}
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};