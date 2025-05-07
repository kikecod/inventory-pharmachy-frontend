import React, { useState, useEffect } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
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
      toast.error('Cliente no encontrado, puedes registrarlo');
      setClienteId(null);
      setCustomerName('');
      setAddClientModalOpen(true);
    }
  } catch (err) {
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
  
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredSales(sales);
      return;
    }
    
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = sales.filter((sale) => 
      sale.customerName.toLowerCase().includes(lowercasedQuery) ||
      sale.id.toString().includes(lowercasedQuery) ||
      sale.paymentMethod.toLowerCase().includes(lowercasedQuery)
    );
    
    setFilteredSales(filtered);
  }, [searchQuery, sales]);

  useEffect(() => {
    if (productSearch.trim() === '') {
      setFilteredProducts(products);
    } else {
      const query = productSearch.toLowerCase();
      setFilteredProducts(
        products.filter((product) =>
          product.nombre.toLowerCase().includes(query) ||
          product.descripcion?.toLowerCase().includes(query)
        )
      );
    }
  }, [productSearch, products]);

  
  const handleStartNewSale = () => {
    if (user) {
      startNewSale(user.id);
      setIsNewSaleModalOpen(true);
    } else {
      toast.error('User information not available');
    }
  };
  
  const handleAddItemToSale = () => {
    if (!selectedProduct || quantity <= 0) {
      toast.error('Please select a product and set a valid quantity');
      return;
    }
  
    const product = products.find(
      (p) => p.idProducto.toString() === selectedProduct
    );
  
    if (!product) {
      toast.error('Selected product not found');
      return;
    }
  
    if (product.stock < quantity) {
      toast.error(`Only ${product.stock} units available in stock`);
      return;
    }
  
    const unitPrice = product.precio;
  
    const saleItem: SaleItem = {
      productId: product.idProducto.toString(),
      productName: product.nombre,
      quantity,
      unitPrice,
      subtotal: unitPrice * quantity,
    };
    console.log('Producto seleccionado:', product);
    console.log('Precio del producto:', product.precio);
  
    addItemToSale(saleItem);
    setSelectedProduct('');
    setProductSearch('');
    setQuantity(1);
    toast.success(`${product.nombre} added to sale`);
  };
  
  const handleRemoveItem = (productId: string) => {
    removeItemFromSale(productId);
    toast.success('Item removed from sale');
  };
  
  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    const product = products.find((p) => p.id === productId);
    
    if (product && product.stockQuantity < newQuantity) {
      toast.error(`Only ${product.stockQuantity} units available in stock`);
      return;
    }
    
    updateItemQuantity(productId, newQuantity);
  };
  
  const handleProceedToCheckout = () => {
    if (!currentSale || currentSale.items.length === 0) {
      toast.error('Please add items to the sale first');
      return;
    }
    
    setIsNewSaleModalOpen(false);
    setIsCheckoutModalOpen(true);
  };
  
  const handleCompleteSale = async () => {
    if (!customerName) {
      toast.error('Please enter customer name');
      return;
    }
    
    try {
      await completeSale(clienteId, customerName, paymentMethod);
      setIsCheckoutModalOpen(false);
      setCustomerName('');
      setPaymentMethod('Efectivo');
      toast.success('Sale completed successfully');
    } catch (error) {
      toast.error('Failed to complete sale');
    }
  };
  
  const handleCancelSale = () => {
    if (window.confirm('Are you sure you want to cancel this sale? All items will be removed.')) {
      cancelCurrentSale();
      setIsNewSaleModalOpen(false);
      setIsCheckoutModalOpen(false);
      toast.success('Sale cancelled');
    }
  };
  
  const renderPaymentMethod = (method: Sale['paymentMethod']) => {
    switch (method) {
      case 'Efectivo':
        return <Badge variant="success">Efectivo</Badge>;
      case 'Tarjeta':
        return <Badge variant="primary">Tarjeta</Badge>;
      case 'insurance':
        return <Badge variant="secondary">Insurance</Badge>;
      default:
        return <Badge>{method}</Badge>;
    }
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
    <div className="space-y-6 animate-fade-in">
      <div className="pb-5 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Sales Management
        </h3>
        <p className="mt-2 max-w-4xl text-sm text-gray-500">
          Record and manage sales transactions
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="relative w-full md:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Search sales..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="outline" leftIcon={<Filter size={16} />}>
            Filter
          </Button>
          
          <Button leftIcon={<Plus size={16} />} onClick={handleStartNewSale}>
            New Sale
          </Button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSales.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  No sales found.
                </TableCell>
              </TableRow>
            ) : (
              filteredSales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell className="font-medium">{sale.id.substring(0, 8)}</TableCell>
                  <TableCell>{sale.customerName}</TableCell>
                  <TableCell>{formatDate(sale.createdAt)}</TableCell>
                  <TableCell>{sale.items.length} items</TableCell>
                  <TableCell>{renderPaymentMethod(sale.paymentMethod)}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={sale.status === 'completed' ? 'success' : 
                              sale.status === 'pending' ? 'warning' : 'error'}
                    >
                      {sale.status.charAt(0).toUpperCase() + sale.status.slice(1)}
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
      
      {/* New Sale Modal */}
      <Modal
        isOpen={isNewSaleModalOpen}
        onClose={() => {
          if (window.confirm('Are you sure you want to cancel this sale?')) {
            cancelCurrentSale();
            setIsNewSaleModalOpen(false);
          }
        }}
        title="New Sale"
        maxWidth="xl"
      >
        <ModalBody>
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
                <Input
                  label="Search Product"
                  placeholder="Type to search..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                />
                {filteredProducts.length > 0 && (
                  <ul className="absolute z-10 bg-white border border-gray-300 rounded mt-1 max-h-60 overflow-auto w-full">
                    {filteredProducts.map((product) => (
                      <li
                        key={product.idProducto}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setSelectedProduct(product.idProducto.toString());
                          setProductSearch(`${product.nombre} (${product.stock} in stock)`);
                          setFilteredProducts([]); // ocultar lista
                        }}
                      >
                        {product.nombre} - {product.descripcion} ({product.stock} disponibles)
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              
              <Input
                label="Quantity"
                type="number"
                min="1"
                value={quantity.toString()}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="w-32"
              />
              
              <div className="flex items-end">
                <Button onClick={handleAddItemToSale}>
                  Add Item
                </Button>
              </div>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Sale Items</CardTitle>
              </CardHeader>
              <CardContent>
                {currentSale && currentSale.items.length > 0 ? (
                  <div className="space-y-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead>Unit Price</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead className="text-right">Subtotal</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentSale.items.map((item) => (
                          <TableRow key={item.productId}>
                            <TableCell className="font-medium">{item.productName}</TableCell>
                            <TableCell>{formatCurrency(item.unitPrice)}</TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handleUpdateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                                  className="h-6 w-6 rounded border border-gray-300 flex items-center justify-center"
                                >
                                  -
                                </button>
                                <span>{item.quantity}</span>
                                <button
                                  onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                                  className="h-6 w-6 rounded border border-gray-300 flex items-center justify-center"
                                >
                                  +
                                </button>
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
                                Remove
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex justify-between items-center text-lg font-medium">
                        <span>Total</span>
                        <span>{formatCurrency(currentSale.total)}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <ShoppingCart size={48} className="mx-auto mb-2 text-gray-400" />
                    <p>No items added to this sale yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onClick={handleCancelSale}>
            Cancel Sale
          </Button>
          <Button 
            onClick={handleProceedToCheckout}
            disabled={!currentSale || currentSale.items.length === 0}
          >
            Proceed to Checkout
          </Button>
        </ModalFooter>
      </Modal>
      
      {/* Checkout Modal */}
      <Modal
        isOpen={isCheckoutModalOpen}
        onClose={() => {
          setIsCheckoutModalOpen(false);
          setIsNewSaleModalOpen(true);
        }}
        title="Complete Sale"
        maxWidth="md"
      >
        <ModalBody>
          <div className="space-y-4">
            <Input
              label="Buscar cliente por CI"
              value={customerCI}
              onChange={(e) => setCustomerCI(e.target.value)}
              placeholder="Ingresa CI del cliente"
            />
            <Button onClick={handleSearchCustomer}>Buscar</Button>
            
            <Select
              label="Select Customer"
              value={clienteId?.toString() || ''}
              onChange={(e) => setClienteId(parseInt(e.target.value))}
              options={[
                { value: '', label: 'Select a customer' },
                ...customers.map(c => ({
                  value: c.idCliente.toString(),
                  label: `${c.nombre} ${c.apellido} - ${c.email}`
                }))
              ]}
            />
            <Button variant="outline" onClick={() => setAddClientModalOpen(true)}>Add New Customer</Button>
            
            {currentSale && (
              <div className="bg-gray-50 p-4 rounded-md mt-4">
                <div className="text-sm text-gray-500">Order Summary</div>
                <div className="mt-2 space-y-2">
                  {currentSale.items.map((item) => (
                    <div key={item.productId} className="flex justify-between">
                      <span>{item.quantity} x {item.productName}</span>
                      <span>{formatCurrency(item.subtotal)}</span>
                    </div>
                  ))}
                  <div className="border-t border-gray-200 pt-2 mt-2">
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
            Back
          </Button>
          <Button onClick={handleCompleteSale}>
            Complete Sale
          </Button>
        </ModalFooter>
      </Modal>


      <Modal
        isOpen={isAddClientModalOpen}
        onClose={() => setAddClientModalOpen(false)}
        title="Add New Customer"
      >
        <ModalBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="CI" value={form.ci} onChange={(e) => setForm({ ...form, ci: e.target.value })} /> 
            <Input label="First Name" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
            <Input label="Last Name" value={form.apellido} onChange={(e) => setForm({ ...form, apellido: e.target.value })} />
            <Input label="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <Input label="Phone" value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} />
            <Input label="Address" value={form.direccion} onChange={(e) => setForm({ ...form, direccion: e.target.value })} />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onClick={() => setAddClientModalOpen(false)}>Cancel</Button>
          <Button onClick={async () => {
            try {
              const newClient = await addCustomer(form);
              toast.success('Customer added');
              await fetchCustomers();
              setClienteId(newClient.idCliente); // seleccionar automáticamente
              setAddClientModalOpen(false);
            } catch {
              toast.error('Error adding customer');
            }
          }}>
            Save
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};