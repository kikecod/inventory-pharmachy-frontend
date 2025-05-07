import React, { useState, useEffect } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal, ModalBody, ModalFooter } from '../components/ui/Modal';
import { useCustomerStore } from '../store/customerStore';
import { Customer } from '../types';
import { toast } from 'react-hot-toast';

export const CustomersPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filtered, setFiltered] = useState<Customer[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isEditing, setEditing] = useState(false);
  const [form, setForm] = useState<Omit<Customer, 'idCliente'>>({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    direccion: ''
  });

  const {
    customers,
    currentCustomer,
    isLoading,
    error,
    fetchCustomers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    setCurrentCustomer
  } = useCustomerStore();

  useEffect(() => { fetchCustomers(); }, [fetchCustomers]);
  useEffect(() => {
    if (!searchQuery) return setFiltered(customers);
    const q = searchQuery.toLowerCase();
    setFiltered(
      customers.filter(c =>
        c.nombre.toLowerCase().includes(q) ||
        c.apellido.toLowerCase().includes(q)
      )
    );
  }, [searchQuery, customers]);

  const openAdd = () => {
    setEditing(false);
    setForm({ nombre: '', apellido: '', email: '', telefono: '', direccion: '' });
    setModalOpen(true);
  };

  const openEdit = (c: Customer) => {
    setEditing(true);
    setForm({
      nombre: c.nombre,
      apellido: c.apellido,
      email: c.email,
      telefono: c.telefono,
      direccion: c.direccion
    });
    setCurrentCustomer(c);
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (isEditing && currentCustomer) {
        await updateCustomer(currentCustomer.idCliente, form);
        toast.success('Customer updated');
      } else {
        await addCustomer(form);
        toast.success('Customer added');
      }
      setModalOpen(false);
    } catch {
      toast.error('Error saving customer');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="pb-5 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Customer Management</h3>
        <p className="mt-2 text-sm text-gray-500">Store and manage customer information</p>
      </div>

      <div className="flex justify-between items-center">
        <Input
          placeholder="Search customers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-64"
        />
        <Button onClick={openAdd}>Add Customer</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((c) => (
            <TableRow key={c.idCliente}>
              <TableCell>{c.idCliente}</TableCell>
              <TableCell>{c.nombre} {c.apellido}</TableCell>
              <TableCell>{c.email}</TableCell>
              <TableCell>{c.telefono}</TableCell>
              <TableCell>{c.direccion}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => openEdit(c)}>Edit</Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-error-600 hover:bg-error-50"
                    onClick={() => deleteCustomer(c.idCliente)}
                  >Delete</Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title={isEditing ? 'Edit Customer' : 'Add Customer'}>
        <ModalBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="First Name"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            />
            <Input
              label="Last Name"
              value={form.apellido}
              onChange={(e) => setForm({ ...form, apellido: e.target.value })}
            />
            <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <Input
              label="Phone"
              value={form.telefono}
              onChange={(e) => setForm({ ...form, telefono: e.target.value })}
            />
            <Input
              label="Address"
              value={form.direccion}
              onChange={(e) => setForm({ ...form, direccion: e.target.value })}
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>{isEditing ? 'Update' : 'Add'}</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};
