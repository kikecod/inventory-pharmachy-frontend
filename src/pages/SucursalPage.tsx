import React, { useEffect, useState } from 'react';
import { useSucursalStore } from '../store/sucursalStore';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Modal, ModalBody, ModalFooter } from '../components/ui/Modal';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
import { toast } from 'react-hot-toast';
import { Sucursal } from '../types/sucursal';

export const SucursalPage: React.FC = () => {
  const { sucursales, selectedSucursal, fetchSucursales, addSucursal, selectSucursal, isLoading, error } = useSucursalStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState<Omit<Sucursal, 'idSucursal' | 'fechaCreacion'>>({
    nombre: '', direccion: '', telefono: '', email: ''
  });

  useEffect(() => {
    fetchSucursales();
  }, []);

  const handleSubmit = async () => {
    if (!form.nombre || !form.direccion) {
      toast.error('Nombre y dirección son obligatorios');
      return;
    }
    try {
      await addSucursal(form);
      toast.success('Sucursal agregada');
      setIsModalOpen(false);
    } catch {
      toast.error('Error al agregar sucursal');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="pb-5 border-b">
        <h3 className="text-lg font-medium">Gestión de Sucursales</h3>
        <p className="text-sm text-gray-500">Seleccione o registre sucursales</p>
        <div className="mt-3">
          <Button onClick={() => setIsModalOpen(true)}>Agregar Sucursal</Button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Sucursal Actual</label>
        <select
          className="mt-1 block w-full border rounded p-2"
          value={selectedSucursal?.idSucursal || ''}
          onChange={e => selectSucursal(Number(e.target.value))}
        >
          <option value="">-- Seleccione una sucursal --</option>
          {sucursales.map(s => (
            <option key={s.idSucursal} value={s.idSucursal}>{s.nombre}</option>
          ))}
        </select>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Dirección</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Fecha Creación</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sucursales.map((s: Sucursal) => (
              <TableRow key={s.idSucursal}>
                <TableCell>{s.nombre}</TableCell>
                <TableCell>{s.direccion}</TableCell>
                <TableCell>{s.telefono}</TableCell>
                <TableCell>{s.email}</TableCell>
                <TableCell>{new Date(s.fechaCreacion).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Agregar nueva sucursal">
        <ModalBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Nombre" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} />
            <Input label="Dirección" value={form.direccion} onChange={e => setForm({ ...form, direccion: e.target.value })} />
            <Input label="Teléfono" value={form.telefono} onChange={e => setForm({ ...form, telefono: e.target.value })} />
            <Input label="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
          <Button onClick={handleSubmit}>Guardar</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};
