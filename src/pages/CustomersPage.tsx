// File: src/pages/CustomersPage.tsx
import React, { useState, useEffect } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal, ModalBody, ModalFooter } from '../components/ui/Modal';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useCustomerStore } from '../store/customerStore';
import { Customer } from '../types/customer';
import { toast } from 'react-hot-toast';

export const CustomersPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState<Partial<Customer>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

  const {
    customers,
    isLoading,
    error,
    fetchCustomers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
  } = useCustomerStore();

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredCustomers(customers);
    } else {
      const q = searchQuery.toLowerCase();
      setFilteredCustomers(
        customers.filter(c =>
          c.nombre.toLowerCase().includes(q) ||
          c.apellido.toLowerCase().includes(q) 
        )
      );
    }
    setCurrentPage(1);
  }, [searchQuery, customers]);

  const openAddModal = () => {
    setIsEditing(false);
    setCurrentCustomer({});
    setIsModalOpen(true);
  };
  const openEditModal = (customer: Customer) => {
    setIsEditing(true);
    setCurrentCustomer(customer);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar este cliente?')) return;
    try {
      await deleteCustomer(id);
      toast.success('Cliente eliminado');
    } catch {
      toast.error('Error al eliminar');
    }
  };

  const handleSubmit = async () => {
    const { ci, nombre, apellido, email, telefono, direccion, idCliente } = currentCustomer;
    if (!ci || !nombre || !apellido) {
      toast.error('CI, nombre y apellido son obligatorios');
      return;
    }
    try {
      if (isEditing && idCliente) {
        await updateCustomer(idCliente, { ci, nombre, apellido, email, telefono, direccion });
        toast.success('Cliente actualizado');
      } else {
        await addCustomer({ ci, nombre, apellido, email, telefono, direccion });
        toast.success('Cliente agregado');
      }
      setIsModalOpen(false);
    } catch {
      toast.error('Error al guardar');
    }
  };

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (error) return <div className="text-red-600">Error: {error}</div>;
  if (isLoading) return <div>Cargando clientes...</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="pb-5 border-b">
        <h3 className="text-lg font-medium">Customer Management</h3>
        <Button leftIcon={<Plus />} onClick={openAddModal} className="mt-2">
          Nuevo Cliente
        </Button>
      </div>

      <div className="pb-4">
        <Input
          placeholder="Buscar por CI, nombre o apellido"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>CI</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Apellido</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Dirección</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedCustomers.map(c => (
              <TableRow key={c.idCliente}>
                <TableCell>{c.ci}</TableCell>
                <TableCell>{c.nombre}</TableCell>
                <TableCell>{c.apellido}</TableCell>
                <TableCell>{c.email}</TableCell>
                <TableCell>{c.telefono}</TableCell>
                <TableCell>{c.direccion}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => openEditModal(c)}>
                      <Edit size={16} />
                    </Button>
                    <Button size="sm" variant="outline" className="text-error-600" onClick={() => handleDelete(c.idCliente!)}>
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {totalPages > 1 && (
          <div className="flex justify-between items-center px-4 py-2 border-t text-sm">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Anterior
            </Button>
            <span>Página {currentPage} de {totalPages}</span>
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Siguiente
            </Button>
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEditing ? 'Editar Cliente' : 'Nuevo Cliente'}>
        <ModalBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="CI" name="ci" value={currentCustomer.ci || ''} onChange={e => setCurrentCustomer(prev => ({ ...prev, ci: e.target.value }))} />
            <Input label="Nombre" name="nombre" value={currentCustomer.nombre || ''} onChange={e => setCurrentCustomer(prev => ({ ...prev, nombre: e.target.value }))} />
            <Input label="Apellido" name="apellido" value={currentCustomer.apellido || ''} onChange={e => setCurrentCustomer(prev => ({ ...prev, apellido: e.target.value }))} />
            <Input label="Email" name="email" type="email" value={currentCustomer.email || ''} onChange={e => setCurrentCustomer(prev => ({ ...prev, email: e.target.value }))} />
            <Input label="Teléfono" name="telefono" value={currentCustomer.telefono || ''} onChange={e => setCurrentCustomer(prev => ({ ...prev, telefono: e.target.value }))} />
            <Input label="Dirección" name="direccion" value={currentCustomer.direccion || ''} onChange={e => setCurrentCustomer(prev => ({ ...prev, direccion: e.target.value }))} />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
          <Button onClick={handleSubmit}>{isEditing ? 'Actualizar' : 'Agregar'}</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};
