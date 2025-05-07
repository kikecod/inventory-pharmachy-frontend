import React, { useState, useEffect } from 'react';
import { InventoryTable } from '../components/inventory/InventoryTable';
import { Modal, ModalBody, ModalFooter } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { useInventoryStore } from '../store/inventoryStore';
import { useProductStore } from '../store/productStore';
import { InventoryLote } from '../types';
import { toast } from 'react-hot-toast';

export const InventoryPage: React.FC = () => {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [estaEditando, setEstaEditando] = useState(false);
  const [itemActual, setItemActual] = useState<Partial<InventoryLote>>({});

  const {
    lotes,
    isLoading,
    error,
    fetchInventory,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
  } = useInventoryStore();
  const { products, fetchProducts } = useProductStore();

  useEffect(() => {
    fetchInventory();
    fetchProducts();
  }, [fetchInventory, fetchProducts]);

  const handleAgregar = () => {
    setEstaEditando(false);
    setItemActual({
      idProducto: undefined,
      codigoLote: '',
      fechaVencimiento: '',
      cantidad: 0,
      fechaIngreso: new Date().toISOString().split('T')[0],
      precioUnitario: 0,
      notas: '',
    });
    setModalAbierto(true);
  };

  const handleEditar = (lote: InventoryLote) => {
    setEstaEditando(true);
    setItemActual({ ...lote });
    setModalAbierto(true);
  };

  const handleEliminar = async (lote: InventoryLote) => {
    if (!confirm(`¿Eliminar el lote "${lote.codigoLote}"?`)) return;
    try {
      await deleteInventoryItem(lote.idLote);
      toast.success('Lote eliminado correctamente');
    } catch {
      toast.error('Error al eliminar el lote');
    }
  };

  const handleCambio = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setItemActual(prev => ({
      ...prev,
      [name]:
        name === 'cantidad' || name === 'precioUnitario'
          ? parseFloat(value)
          : value,
    }));
  };

  const handleSubmit = async () => {
    // Validar obligatorios
    const campos = ['idProducto','codigoLote','fechaVencimiento','cantidad','precioUnitario'] as const;
    for (const c of campos) {
      if (!itemActual[c]) {
        toast.error('Completa todos los campos obligatorios');
        return;
      }
    }
    try {
      if (estaEditando) {
        await updateInventoryItem(itemActual.idLote!, itemActual as InventoryLote);
        toast.success('Lote actualizado correctamente');
      } else {
        await addInventoryItem(itemActual as Omit<InventoryLote,'idLote'>);
        toast.success('Lote registrado exitosamente');
      }
      setModalAbierto(false);
    } catch {
      toast.error('Ocurrió un error. Intenta de nuevo');
    }
  };

  if (error) {
    return <div className="p-4 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="space-y-6 p-4 animate-fade-in">
      <div className="pb-5 border-b border-gray-200">
        <h3 className="text-lg font-medium">Gestión de Inventario</h3>
        <p className="mt-1 text-sm text-gray-600">
          Administra lotes, niveles de stock y fechas de vencimiento
        </p>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleAgregar}>+ Nuevo lote</Button>
      </div>

      <InventoryTable
        inventory={lotes}
        isLoading={isLoading}
        onEditItem={handleEditar}
        onDeleteItem={handleEliminar}
      />

      <Modal
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        title={estaEditando ? 'Editar lote' : 'Registrar lote'}
        maxWidth="lg"
      >
        <ModalBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Producto"
              name="idProducto"
              value={itemActual.idProducto?.toString() || ''}
              onChange={handleCambio}
              options={[
                { value: '', label: 'Selecciona un producto' },
                ...products.map(p => ({
                  value: p.idProducto.toString(),
                  label: p.nombre,
                })),
              ]}
              required
            />
            <Input
              label="Código de lote"
              name="codigoLote"
              value={itemActual.codigoLote || ''}
              onChange={handleCambio}
              required
            />
            <Input
              label="Cantidad"
              type="number"
              name="cantidad"
              value={itemActual.cantidad?.toString() || '0'}
              onChange={handleCambio}
              required
            />
            <Input
              label="Precio unitario"
              type="number"
              step="0.01"
              name="precioUnitario"
              value={itemActual.precioUnitario?.toString() || '0'}
              onChange={handleCambio}
              required
            />
            <Input
              label="Fecha de vencimiento"
              type="date"
              name="fechaVencimiento"
              value={itemActual.fechaVencimiento || ''}
              onChange={handleCambio}
              required
            />
            <Input
              label="Fecha de ingreso"
              type="date"
              name="fechaIngreso"
              value={itemActual.fechaIngreso || ''}
              onChange={handleCambio}
              required
            />
            <Input
              label="Notas (opcional)"
              name="notas"
              value={itemActual.notas || ''}
              onChange={handleCambio}
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onClick={() => setModalAbierto(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>
            {estaEditando ? 'Actualizar' : 'Registrar'}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};