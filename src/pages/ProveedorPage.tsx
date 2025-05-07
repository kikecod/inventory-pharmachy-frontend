// File: src/pages/ProveedorPage.tsx
import React, { useState, useEffect } from 'react';
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell
} from '../components/ui/Table';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Modal, ModalBody, ModalFooter } from '../components/ui/Modal';
import {
  Plus, Edit, Trash2, Box, ClipboardList
} from 'lucide-react';
import { toast } from 'react-hot-toast';

import { useAuthStore } from '../store/authStore';
import { useProveedorStore } from '../store/proveedorStore';
import {
  Provider, OrderItem, CreateOrderDTO, ProviderProduct, PurchaseRecord
} from '../types/index';

export const ProveedorPage: React.FC = () => {
  const { user } = useAuthStore();
  const {
    providers,
    products,
    history,
    isLoading,
    error,
    fetchProviders,
    addProvider,
    updateProvider,
    deleteProvider,
    fetchProductsByProvider,
    fetchPurchaseHistory,
    createOrder
  } = useProveedorStore();

  // Search + list
  const [searchQ, setSearchQ] = useState('');
  const [filtered, setFiltered] = useState<Provider[]>([]);

  // Add/Edit Provider modal
  const [isProvModalOpen, setProvModalOpen] = useState(false);
  const [isEditingProv, setEditingProv] = useState(false);
  const [provForm, setProvForm] = useState<Partial<Provider>>({});

  // View Products modal
  const [isProdModalOpen, setProdModalOpen] = useState(false);
  // View History modal
  const [isHistModalOpen, setHistModalOpen] = useState(false);

  // New Order modal
  const [isOrderModalOpen, setOrderModalOpen] = useState(false);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [orderForm, setOrderForm] = useState<CreateOrderDTO>({
    idProveedor: 0, idUsuario: parseInt(user?.id||'0'), total: 0, detalle: []
  });
  const [selectedProdId, setSelectedProdId] = useState<number>(0);
  const [orderQty, setOrderQty] = useState(1);
  const [orderUnitPrice, setOrderUnitPrice] = useState(0);

  // Load providers
  useEffect(() => {
    fetchProviders();
  }, [fetchProviders]);

  // Filter providers
  useEffect(() => {
    if (!searchQ.trim()) return setFiltered(providers);
    const q = searchQ.toLowerCase();
    setFiltered(
      providers.filter(p =>
        p.nombre.toLowerCase().includes(q) ||
        (p.email||'').toLowerCase().includes(q)
      )
    );
  }, [searchQ, providers]);

  // Handlers
  const openAddProv = () => {
    setEditingProv(false);
    setProvForm({});
    setProvModalOpen(true);
  };
  const openEditProv = (p: Provider) => {
    setEditingProv(true);
    setProvForm(p);
    setProvModalOpen(true);
  };
  const saveProv = async () => {
    try {
      if (!provForm.nombre) {
        toast.error('El nombre es obligatorio');
        return;
      }
      if (isEditingProv && provForm.idProveedor) {
        await updateProvider(provForm.idProveedor, provForm as Provider);
        toast.success('Proveedor actualizado');
      } else {
        await addProvider(provForm as Omit<Provider,'idProveedor'>);
        toast.success('Proveedor agregado');
      }
      setProvModalOpen(false);
    } catch {
      toast.error('Error al guardar proveedor');
    }
  };

  const removeProv = async (id: number) => {
    if (!confirm('¿Eliminar este proveedor?')) return;
    try {
      await deleteProvider(id);
      toast.success('Proveedor eliminado');
    } catch {
      toast.error('Error al eliminar');
    }
  };

  const viewProducts = async (id: number) => {
    await fetchProductsByProvider(id);
    setProdModalOpen(true);
  };
  const viewHistory = async () => {
    await fetchPurchaseHistory();
    setHistModalOpen(true);
  };

  const openOrderModal = (id: number) => {
    setOrderForm(f => ({ ...f, idProveedor: id }));
    setOrderItems([]);
    setOrderModalOpen(true);
  };
  const addOrderItem = () => {
    if (!selectedProdId || orderQty < 1 || orderUnitPrice <= 0) {
      toast.error('Seleccione producto, cantidad y precio válidos');
      return;
    }
    const subtotal = orderQty * orderUnitPrice;
    setOrderItems(items => [
      ...items,
      { idProducto: selectedProdId, cantidad: orderQty, precioUnitario: orderUnitPrice, subtotal }
    ]);
    setOrderForm(f => ({
      ...f,
      detalle: [...f.detalle, { idProducto: selectedProdId, cantidad: orderQty, precioUnitario: orderUnitPrice, subtotal }],
      total: f.total + subtotal
    }));
  };
  const submitOrder = async () => {
    try {
      const res = await createOrder(orderForm);
      toast.success(`Pedido creado #${res.idPedido}`);
      setOrderModalOpen(false);
    } catch {
      toast.error('Error al crear pedido');
    }
  };

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center border-b pb-3">
        <h2 className="text-xl font-semibold">Gestión de Proveedores</h2>
        <Button leftIcon={<Plus />} onClick={openAddProv}>Nuevo Proveedor</Button>
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Buscar proveedores..."
          value={searchQ}
          onChange={e => setSearchQ(e.target.value)}
        />
        <Button variant="outline" leftIcon={<ClipboardList />} onClick={viewHistory}>
          Historial Compras
        </Button>
      </div>

      {error && <p className="text-red-600">{error}</p>}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Teléfono</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map(p => (
            <TableRow key={p.idProveedor}>
              <TableCell>{p.idProveedor}</TableCell>
              <TableCell>{p.nombre}</TableCell>
              <TableCell>{p.email}</TableCell>
              <TableCell>{p.telefono}</TableCell>
              <TableCell className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => openEditProv(p)}>
                  <Edit size={14}/>
                </Button>
                <Button size="sm" variant="outline" onClick={() => removeProv(p.idProveedor)} className="text-red-600">
                  <Trash2 size={14}/>
                </Button>
                <Button size="sm" onClick={() => viewProducts(p.idProveedor)}>
                  <Box size={14}/> Productos
                </Button>
                <Button size="sm" onClick={() => openOrderModal(p.idProveedor)}>
                  <Plus size={14}/> Pedido
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Add/Edit Provider Modal */}
      <Modal
        isOpen={isProvModalOpen}
        onClose={() => setProvModalOpen(false)}
        title={isEditingProv ? 'Editar Proveedor' : 'Nuevo Proveedor'}
      >
        <ModalBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nombre"
              value={provForm.nombre||''}
              onChange={e => setProvForm(f=>({ ...f, nombre: e.target.value }))}
            />
            <Input
              label="Email"
              type="email"
              value={provForm.email||''}
              onChange={e => setProvForm(f=>({ ...f, email: e.target.value }))}
            />
            <Input
              label="Teléfono"
              value={provForm.telefono||''}
              onChange={e => setProvForm(f=>({ ...f, telefono: e.target.value }))}
            />
            <Input
              label="Dirección"
              value={provForm.direccion||''}
              onChange={e => setProvForm(f=>({ ...f, direccion: e.target.value }))}
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onClick={()=>setProvModalOpen(false)}>Cancelar</Button>
          <Button onClick={saveProv}>{isEditingProv ? 'Actualizar' : 'Crear'}</Button>
        </ModalFooter>
      </Modal>

      {/* Products Modal */}
      <Modal isOpen={isProdModalOpen} onClose={()=>setProdModalOpen(false)} title="Productos del Proveedor">
        <ModalBody>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Stock</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map(p => (
                <TableRow key={p.idProducto}>
                  <TableCell>{p.nombre}</TableCell>
                  <TableCell>{p.descripcion}</TableCell>
                  <TableCell>{p.stock}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ModalBody>
      </Modal>

      {/* Purchase History Modal */}
      <Modal isOpen={isHistModalOpen} onClose={()=>setHistModalOpen(false)} title="Historial de Compras">
        <ModalBody>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead># Pedido</TableHead>
                <TableHead>Proveedor</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map(h => (
                <TableRow key={h.idPedido}>
                  <TableCell>{h.idPedido}</TableCell>
                  <TableCell>{h.proveedor}</TableCell>
                  <TableCell>{h.fecha}</TableCell>
                  <TableCell>{h.total.toFixed(2)} Bs</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ModalBody>
      </Modal>

      {/* New Order Modal */}
      <Modal isOpen={isOrderModalOpen} onClose={()=>setOrderModalOpen(false)} title="Nuevo Pedido a Proveedor">
        <ModalBody>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Select
                label="Producto"
                value={selectedProdId.toString()}
                onChange={e=>setSelectedProdId(Number(e.target.value))}
                options={[
                  { value: '0', label: 'Seleccione...' },
                  ...products.map(p=>({
                    value: p.idProducto.toString(),
                    label: p.nombre
                  }))
                ]}
              />
              <Input
                label="Cantidad"
                type="number"
                value={orderQty.toString()}
                onChange={e=>setOrderQty(Number(e.target.value))}
              />
              <Input
                label="Precio Unit."
                type="number"
                value={orderUnitPrice.toString()}
                onChange={e=>setOrderUnitPrice(Number(e.target.value))}
              />
              <Button onClick={addOrderItem}>Agregar ítem</Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead>Cant.</TableHead>
                  <TableHead>Precio U.</TableHead>
                  <TableHead>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orderItems.map((it,i)=>(
                  <TableRow key={i}>
                    <TableCell>{products.find(p=>p.idProducto===it.idProducto)?.nombre}</TableCell>
                    <TableCell>{it.cantidad}</TableCell>
                    <TableCell>{it.precioUnitario.toFixed(2)}</TableCell>
                    <TableCell>{it.subtotal.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <p className="text-right font-medium">Total: {orderForm.total.toFixed(2)} Bs</p>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onClick={()=>setOrderModalOpen(false)}>Cancelar</Button>
          <Button onClick={submitOrder}>Crear Pedido</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};