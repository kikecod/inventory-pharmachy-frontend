export type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'staff' | 'pharmacist';
  avatar?: string;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  category: string;
  sku: string;
  price: number;
  costPrice: number;
  stockQuantity: number;
  expiryDate: string;
  manufacturer: string;
  requiresPrescription: boolean;
  imageUrl?: string;
};

export type Category = {
  id: string;
  name: string;
  description: string;
};

export type InventoryItem = {
  id: string;
  productId: string;
  batchNumber: string;
  quantity: number;
  expiryDate: string;
  receivedDate: string;
  supplierName: string;
  notes?: string;
};

export type Sale = {
  id: string;
  customerId?: string;
  customerName: string;
  items: SaleItem[];
  total: number;
  paymentMethod: 'cash' | 'card' | 'insurance';
  status: 'completed' | 'pending' | 'cancelled';
  createdAt: string;
  staffId: string;
};

export type SaleItem = {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
};

export type DashboardStats = {
  totalSales: number;
  totalRevenue: number;
  lowStockCount: number;
  expiringProductsCount: number;
  recentSales: Sale[];
  salesByCategory: {
    category: string;
    amount: number;
  }[];
  inventoryValue: number;
};