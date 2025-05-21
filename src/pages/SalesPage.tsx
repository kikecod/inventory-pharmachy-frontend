import React, { useState, useEffect } from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from '../components/ui/Table';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Modal, ModalBody, ModalFooter } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Plus, Search, Filter, ShoppingCart } from 'lucide-react';
import { useSalesStore } from '../store/salesStore';
import { useProductStore } from '../store/productStore';
import { useAuthStore } from '../store/authStore';
import { useCustomerStore } from '../store/customerStore';
import { formatCurrency, formatDate } from '../lib/utils';
import { Sale, SaleItem, Product } from '../types';
import { toast } from 'react-hot-toast';
import { customersService } from '../services/api/customer.service';
import { salesService } from '../services/api/sales.service';


export const SalesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSales, setFilteredSales] = useState<Sale[]>([]);
  const [isNewSaleModalOpen, setIsNewSaleModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [productSearch, setProductSearch] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const [customerName, setCustomerName] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<Sale['paymentMethod']>('Efectivo');
  const { customers, fetchCustomers, addCustomer } = useCustomerStore();
  const [clienteId, setClienteId] = useState<number | null>(null);
  const [isAddClientModalOpen, setAddClientModalOpen] = useState(false);
  const [customerCI, setCustomerCI] = useState('');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [formatoReporte, setFormatoReporte] = useState<'pdf' | 'csv'>('pdf');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const { generateReport, isGeneratingReport } = useSalesStore();

  

  const { 
    sales, 
    currentSale, 
    isLoading, 
    fetchSales, 
    startNewSale, 
    addItemToSale, 
    removeItemFromSale, 
    updateItemQuantity,
    completeSale,
    cancelCurrentSale
  } = useSalesStore();
  const [form, setForm] = useState({
    ci: '',
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    direccion: ''
  });

  const { products, fetchProducts } = useProductStore();
  const { user } = useAuthStore();

  const handleSearchCustomer = async () => {
    try {
      const found = await customersService.getCustomerByCI(customerCI.trim());
      if (found) {
        setClienteId(found.idCliente);
        setCustomerName(`${found.nombre} ${found.apellido}`);
        toast.success(`Cliente encontrado: ${found.nombre} ${found.apellido}`);
      } else {
        toast.error('Cliente no encontrado. Por favor regístralo.');
        setClienteId(null);
        setCustomerName('');
        setAddClientModalOpen(true);
      }
    } catch {
      toast.error('Error al buscar cliente');
    }
  };

  useEffect(() => {
    fetchSales();
    fetchProducts();
  }, [fetchSales, fetchProducts]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  // Filtrar ventas
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredSales(sales);
      return;
    }
    const q = searchQuery.toLowerCase();
    setFilteredSales(
      sales.filter(sale =>
        sale.customerName.toLowerCase().includes(q) ||
        sale.id.includes(q) ||
        sale.paymentMethod.toLowerCase().includes(q)
      )
    );
  }, [searchQuery, sales]);

  // Filtrar productos en modal
  useEffect(() => {
    if (!productSearch.trim()) {
      setFilteredProducts(products);
    } else {
      const q = productSearch.toLowerCase();
      setFilteredProducts(
        products.filter(p =>
          p.nombre.toLowerCase().includes(q) ||
          p.descripcion?.toLowerCase().includes(q)
        )
      );
    }
  }, [productSearch, products]);

  const handleStartNewSale = () => {
    if (!user) {
      toast.error('Información de usuario no disponible');
      return;
    }
    startNewSale(user.id);
    setIsNewSaleModalOpen(true);
  };

  const handleAddItemToSale = () => {
    if (!selectedProduct || quantity <= 0) {
      toast.error('Selecciona un producto y cantidad válida');
      return;
    }
    const product = products.find(p => p.idProducto.toString() === selectedProduct);
    if (!product) {
      toast.error('Producto no encontrado');
      return;
    }
    if (product.stock < quantity) {
      toast.error(`Solo hay ${product.stock} unidades disponibles`);
      return;
    }
    const saleItem: SaleItem = {
      productId: product.idProducto.toString(),
      productName: product.nombre,
      quantity,
      unitPrice: product.precio,
      subtotal: product.precio * quantity
    };
    addItemToSale(saleItem);
    setSelectedProduct('');
    setProductSearch('');
    setQuantity(1);
    toast.success(`${product.nombre} agregado a la venta`);
  };

  const handleRemoveItem = (productId: string) => {
    removeItemFromSale(productId);
    toast.success('Artículo eliminado de la venta');
  };

  const handleUpdateQuantity = (productId: string, newQty: number) => {
    const product = products.find(p => p.idProducto.toString() === productId);
    if (product && product.stock < newQty) {
      toast.error(`Solo hay ${product.stock} unidades disponibles`);
      return;
    }
    updateItemQuantity(productId, newQty);
  };

  const handleProceedToCheckout = () => {
    if (!currentSale || currentSale.items.length === 0) {
      toast.error('Agrega primero artículos a la venta');
      return;
    }
    setIsNewSaleModalOpen(false);
    setIsCheckoutModalOpen(true);
  };

  const handleCompleteSale = async () => {
    if (!customerName) {
      toast.error('Ingresa el nombre del cliente');
      return;
    }
    try {
      await completeSale(clienteId!, customerName, paymentMethod);
      setIsCheckoutModalOpen(false);
      setCustomerName('');
      setPaymentMethod('Efectivo');
      toast.success('Venta completada con éxito');
    } catch {
      toast.error('Error al completar la venta');
    }
  };
  const handleGenerateReport = async () => {
  if (!fechaInicio || !fechaFin) {
    toast.error('Selecciona un rango de fechas válido');
    return;
  }

  try {
    const blob = await salesService.generateReport({
      fechaInicio,
      fechaFin,
      formato: formatoReporte,
    });

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.download = `reporte-ventas.${formatoReporte}`;
    a.click();

    toast.success('Reporte generado correctamente');
    setIsReportModalOpen(false);
  } catch (error) {
    console.error('Error generando el reporte:', error);
    toast.error('Error al generar el reporte');
  }
  };

  const handleCancelSale = () => {
    if (window.confirm('¿Cancelar la venta? Se eliminarán todos los artículos.')) {
      cancelCurrentSale();
      setIsNewSaleModalOpen(false);
      setIsCheckoutModalOpen(false);
      toast.success('Venta cancelada');
    }
  };

  const renderPaymentMethod = (m: Sale['paymentMethod']) => {
    if (m === 'Efectivo') return <Badge variant="success">Efectivo</Badge>;
    if (m === 'Tarjeta')  return <Badge variant="primary">Tarjeta</Badge>;
    return <Badge variant="secondary">Seguro</Badge>;
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
    <div className="space-y-6 animate-fade-in p-4">
      {/* Cabecera */}
      <div className="pb-5 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">
          Gestión de Ventas
        </h3>
        <p className="mt-2 text-sm text-gray-500">
          Registra y administra transacciones de venta
        </p>
      </div>

      {/* Barra de búsqueda y botón nueva venta */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="relative w-full md:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Buscar ventas..."
            className="pl-10"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsReportModalOpen(true)}>
            Generar Reporte
          </Button>
          <Button variant="outline" leftIcon={<Filter size={16} />}>
            Filtrar
          </Button>
          <Button leftIcon={<Plus size={16} />} onClick={handleStartNewSale}>
            Nueva Venta
          </Button>
      
        </div>
      </div>

      {/* Tabla de ventas */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Artículos</TableHead>
              <TableHead>Pago</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSales.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  No se encontraron ventas.
                </TableCell>
              </TableRow>
            ) : (
              filteredSales.map(sale => (
                <TableRow key={sale.id}>
                  <TableCell className="font-medium">
                    {sale.id.substring(0, 8)}
                  </TableCell>
                  <TableCell>{sale.customerName}</TableCell>
                  <TableCell>{formatDate(sale.createdAt)}</TableCell>
                  <TableCell>{sale.items.length} artículo(s)</TableCell>
                  <TableCell>{renderPaymentMethod(sale.paymentMethod)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        sale.status === 'completed' ? 'success' :
                        sale.status === 'pending'   ? 'warning' :
                                                        'error'
                      }
                    >
                      {sale.status === 'completed' ? 'Completada' :
                       sale.status === 'pending'   ? 'Pendiente'  :
                                                    'Cancelada'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(sale.total)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Modal: Nueva Venta */}
      <Modal
        isOpen={isNewSaleModalOpen}
        onClose={() => {
          if (window.confirm('¿Cancelar la venta actual?')) {
            cancelCurrentSale();
            setIsNewSaleModalOpen(false);
          }
        }}
        title="Nueva Venta"
        maxWidth="xl"
      >
        <ModalBody>
          <div className="space-y-6">
            {/* Selección de producto y cantidad */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Input
                  label="Buscar producto"
                  placeholder="Escribe para buscar..."
                  value={productSearch}
                  onChange={e => setProductSearch(e.target.value)}
                />
                {filteredProducts.length > 0 && (
                  <ul className="absolute z-10 bg-white border border-gray-300 rounded mt-1 max-h-60 overflow-auto w-full">
                    {filteredProducts.map(product => (
                      <li
                        key={product.idProducto}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setSelectedProduct(product.idProducto.toString());
                          setProductSearch(`${product.nombre} (${product.stock} disponibles)`);
                          setFilteredProducts([]);
                        }}
                      >
                        {product.nombre} – {product.descripcion} ({product.stock} disp.)
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <Input
                label="Cantidad"
                type="number"
                min="1"
                className="w-32"
                value={quantity.toString()}
                onChange={e => setQuantity(parseInt(e.target.value) || 1)}
              />
              <div className="flex items-end">
                <Button onClick={handleAddItemToSale}>
                  Agregar
                </Button>
              </div>
            </div>

            {/* Lista de artículos añadidos */}
            <Card>
              <CardHeader>
                <CardTitle>Artículos de la venta</CardTitle>
              </CardHeader>
              <CardContent>
                {currentSale && currentSale.items.length > 0 ? (
                  <>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Producto</TableHead>
                          <TableHead>Precio</TableHead>
                          <TableHead>Cantidad</TableHead>
                          <TableHead className="text-right">Subtotal</TableHead>
                          <TableHead>Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentSale.items.map(item => (
                          <TableRow key={item.productId}>
                            <TableCell>{item.productName}</TableCell>
                            <TableCell>{formatCurrency(item.unitPrice)}</TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    handleUpdateQuantity(item.productId, Math.max(1, item.quantity - 1))
                                  }
                                >–</Button>
                                <span>{item.quantity}</span>
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    handleUpdateQuantity(item.productId, item.quantity + 1)
                                  }
                                >+</Button>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              {formatCurrency(item.subtotal)}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-error-600 hover:bg-error-50"
                                onClick={() => handleRemoveItem(item.productId)}
                              >
                                Eliminar
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex justify-between font-medium text-lg">
                        <span>Total</span>
                        <span>{formatCurrency(currentSale.total)}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <ShoppingCart size={48} className="mx-auto mb-2 text-gray-400" />
                    <p>No hay artículos en esta venta</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onClick={handleCancelSale}>
            Cancelar venta
          </Button>
          <Button onClick={handleProceedToCheckout}>
            Ir a pago
          </Button>
        </ModalFooter>
      </Modal>

      {/* Modal: Checkout */}
      <Modal
        isOpen={isCheckoutModalOpen}
        onClose={() => {
          setIsCheckoutModalOpen(false);
          setIsNewSaleModalOpen(true);
        }}
        title="Finalizar Venta"
        maxWidth="md"
      >
        <ModalBody>
          <div className="space-y-4">
            <Input
              label="Buscar cliente por CI"
              placeholder="Ingresa CI"
              value={customerCI}
              onChange={e => setCustomerCI(e.target.value)}
            />
            <Button onClick={handleSearchCustomer}>Buscar</Button>

            <Select
              label="Seleccionar cliente"
              value={clienteId?.toString() || ''}
              onChange={e => setClienteId(parseInt(e.target.value))}
              options={[
                { value: '', label: '-- Seleccionar cliente --' },
                ...customers.map(c => ({
                  value: c.idCliente.toString(),
                  label: `${c.nombre} ${c.apellido} (${c.email})`
                }))
              ]}
            />
            <Button variant="outline" onClick={() => setAddClientModalOpen(true)}>
              Agregar cliente
            </Button>

            {currentSale && (
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-500">Resumen de la venta</p>
                <div className="mt-2 space-y-2">
                  {currentSale.items.map(item => (
                    <div key={item.productId} className="flex justify-between">
                      <span>{item.quantity} × {item.productName}</span>
                      <span>{formatCurrency(item.subtotal)}</span>
                    </div>
                  ))}
                  <div className="mt-2 pt-2 border-t">
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span>{formatCurrency(currentSale.total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onClick={() => {
            setIsCheckoutModalOpen(false);
            setIsNewSaleModalOpen(true);
          }}>
            Volver
          </Button>
          <Button onClick={handleCompleteSale}>
            Completar venta
          </Button>
        </ModalFooter>
      </Modal>

      {/* Modal: Nuevo Cliente */}
      <Modal
        isOpen={isAddClientModalOpen}
        onClose={() => setAddClientModalOpen(false)}
        title="Agregar Cliente"
      >
        <ModalBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="CI"
              value={form.ci}
              onChange={e => setForm({ ...form, ci: e.target.value })}
            />
            <Input
              label="Nombre"
              value={form.nombre}
              onChange={e => setForm({ ...form, nombre: e.target.value })}
            />
            <Input
              label="Apellido"
              value={form.apellido}
              onChange={e => setForm({ ...form, apellido: e.target.value })}
            />
            <Input
              label="Email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
            />
            <Input
              label="Teléfono"
              value={form.telefono}
              onChange={e => setForm({ ...form, telefono: e.target.value })}
            />
            <Input
              label="Dirección"
              value={form.direccion}
              onChange={e => setForm({ ...form, direccion: e.target.value })}
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onClick={() => setAddClientModalOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={async () => {
            try {
              const nuevo = await addCustomer(form);
              toast.success('Cliente agregado');
              await fetchCustomers();
              setClienteId(nuevo.idCliente);
              setAddClientModalOpen(false);
            } catch {
              toast.error('Error al agregar cliente');
            }
          }}>
            Guardar
          </Button>
        </ModalFooter>
      </Modal>
      <Modal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        title="Generar Reporte de Ventas"
        maxWidth="md"
      >
        <ModalBody>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Fecha de Inicio"
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
              />
              <Input
                label="Fecha de Fin"
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {[1, 5, 10, 30].map((dias) => (
                <Button
                  key={dias}
                  variant="ghost"
                  onClick={() => {
                    const fin = new Date();
                    const ini = new Date();
                    ini.setDate(fin.getDate() - dias);
                    setFechaInicio(ini.toISOString().slice(0, 10));
                    setFechaFin(fin.toISOString().slice(0, 10));
                  }}
                >
                  Últimos {dias} días
                </Button>
              ))}
            </div>

            <Select
              label="Formato"
              value={formatoReporte}
              onChange={(e) => setFormatoReporte(e.target.value as 'pdf' | 'csv')}
              options={[
                { value: 'pdf', label: 'PDF' },
                { value: 'csv', label: 'CSV' },
              ]}
            />
          </div>
        </ModalBody>

        <ModalFooter>
          <Button variant="outline" onClick={() => setIsReportModalOpen(false)}>
            Cancelar
          </Button>
          <Button
            disabled={isGeneratingReport}
            onClick={() =>
              generateReport({
                fechaInicio,
                fechaFin,
                formato: formatoReporte,
              })
            }
          >
            {isGeneratingReport ? 'Generando...' : 'Generar'}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};