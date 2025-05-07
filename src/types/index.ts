export type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'staff' | 'pharmacist';
  avatar?: string;
};

export type Product = {
    idProducto: number;
    nombre: string;
    descripcion: string;
    stock: number;
    idUnidad: number;
    idProveedor: number;
    idCategoria: number;
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

export type SaleItem = {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
};

export type Sale = {
  id: string;
  customerName: string;
  createdAt: string;
  items: SaleItem[];
  total: number;
  paymentMethod: 'Efectivo' | 'Tarjeta' | 'insurance';
  status: 'completed' | 'pending' | 'cancelled';
  staffId: string;
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