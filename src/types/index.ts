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
  precio: number; // ✅ importante
  idUnidad?: number;
  idProveedor?: number;
  idCategoria?: number;
};

export type Category = {
  idCategoria: number;
  nombre: string;
  descripcion: string;
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



export type Customer = {
  idCliente: number;
  ci: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  direccion: string;
};

interface Sucursal {
  idSucursal: number;
  nombre: string;
  direccion: string;
  telefono: string;
  email: string;
  fechaCreacion: string;
}

interface SucursalState {
  sucursales: Sucursal[];
  currentSucursal: Sucursal | null;
  fetchSucursales: () => Promise<void>;
  setCurrentSucursal: (sucursal: Sucursal) => void;
}
// Datos básicos de un proveedor
export interface Provider {
  idProveedor: number;
  nombre: string;
  telefono?: string;
  email?: string;
  direccion?: string;
}

// Productos asociados a un proveedor
export interface ProviderProduct {
  idProducto: number;
  nombre: string;
  descripcion: string;
  stock: number;
  idUnidad: number;
  idProveedor: number;
  idCategoria: number;
}

// Ítem del pedido que envías al proveedor
export interface OrderItem {
  idProducto: number;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

// DTO para crear un pedido
export interface CreateOrderDTO {
  idProveedor: number;
  idUsuario: number;
  total: number;
  detalle: OrderItem[];
}

// Respuesta al crear pedido
export interface CreateOrderResponse {
  idPedido: number;
}

// Registro en el historial de compras
export interface PurchaseRecord {
  idPedido: number;
  proveedor: string;
  usuario: string;
  fecha: string;
  total: number;
  estado: string;
  detalle: OrderItem[];
}

export type DashboardStats = {
  totalSales: number;
  totalRevenue: number;
  lowStockCount: number;
  expiringProductsCount: number;
  inventoryValue: number;
  recentSales: Sale[];                           // ya lo tienes
  salesByCategory: { category: string; amount: number }[];
};
  
export interface InventoryLote {
  idLote: number;
  idProducto: number;
  nombreProducto: string;
  categoria: string;
  unidad: string;
  proveedor: string;
  codigoLote: string;
  fechaVencimiento: string;
  cantidad: number;
  fechaIngreso: string;
  precioUnitario: number;
  sucursal: string;
  notas?: string;
}

export interface StockBySucursal {
  idProducto: number;
  nombre: string;
  stock: number;
  unidad: string;
  categoria: string;
}
export interface Unidad {
  idUnidad: number;
  descripcion: string;
  unipcaja: number;
}
// src/types/usuario.ts

export interface Usuario {
  idUsuario: number;
  nombre: string;
  apellido: string | null;
  email: string;
  idRol: string;           // nombre del rol
  fechaCreacion: string;   // ISO date string
}

export interface CreateUsuarioDTO {
  nombre: string;
  apellido?: string;
  email: string;
  password: string;
  idRol: string;
}

export interface UpdateUsuarioDTO {
  nombre: string;
  apellido?: string;
  email: string;
  idRol: string;
}

export interface ChangePasswordAdminDTO {
  nuevaPassword: string;
}

export interface ChangePasswordSelfDTO {
  passwordActual: string;
  nuevaPassword: string;
}

export interface ChangeRoleDTO {
  rol: string;
}