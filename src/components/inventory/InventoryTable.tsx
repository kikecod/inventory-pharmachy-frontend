import React, { useState, useEffect } from 'react';
import { Search, Filter, AlertTriangle } from 'lucide-react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../ui/Table';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Input } from '../ui/Input';
import { formatDate } from '../../lib/utils';
import { InventoryLote } from '../../types';

interface InventoryTableProps {
  inventory: InventoryLote[];
  isLoading: boolean;
  onEditItem: (item: InventoryLote) => void;
  onDeleteItem: (item: InventoryLote) => void;
}

export const InventoryTable: React.FC<InventoryTableProps> = ({
  inventory,
  isLoading,
  onEditItem,
  onDeleteItem,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState<InventoryLote[]>([]);

  useEffect(() => {
    // al cambiar inventario o búsqueda, filtra
    if (!searchQuery.trim()) {
      setFilteredItems(inventory);
    } else {
      const q = searchQuery.toLowerCase();
      setFilteredItems(
        inventory.filter(item =>
          item.nombreProducto.toLowerCase().includes(q) ||
          item.codigoLote.toLowerCase().includes(q) ||
          item.proveedor.toLowerCase().includes(q)
        )
      );
    }
  }, [searchQuery, inventory]);

  const isLowStock = (cantidad: number) => cantidad <= 30;
  const isExpiringSoon = (fecha: string) => {
    const hoy = new Date();
    const venc = new Date(fecha);
    const diff = (venc.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24);
    return diff <= 90;
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
    <div className="space-y-4">
      {/* Búsqueda y filtro */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="relative w-full md:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Buscar en inventario..."
            className="pl-10"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" leftIcon={<Filter size={16} />}>
          Filtrar
        </Button>
      </div>

      {/* Tabla de lotes */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Producto</TableHead>
              <TableHead>Lote</TableHead>
              <TableHead>Cantidad</TableHead>
              <TableHead>Vencimiento</TableHead>
              <TableHead>Proveedor</TableHead>
              <TableHead>Ingreso</TableHead>
              <TableHead>Precio Unit.</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                  No se encontraron lotes.
                </TableCell>
              </TableRow>
            ) : (
              filteredItems.map(item => (
                <TableRow key={item.idLote}>
                  <TableCell className="font-medium">{item.nombreProducto}</TableCell>
                  <TableCell>{item.codigoLote}</TableCell>
                  <TableCell>
                    {isLowStock(item.cantidad) ? (
                      <div className="flex items-center">
                        <span>{item.cantidad}</span>
                        <AlertTriangle size={16} className="ml-2 text-warning-500" />
                      </div>
                    ) : (
                      item.cantidad
                    )}
                  </TableCell>
                  <TableCell>
                    {item.fechaVencimiento
                      ? (
                        isExpiringSoon(item.fechaVencimiento) ? (
                          <div className="flex items-center">
                            <span>{formatDate(item.fechaVencimiento)}</span>
                            <AlertTriangle size={16} className="ml-2 text-error-500" />
                          </div>
                        ) : (
                          formatDate(item.fechaVencimiento)
                        )
                      )
                      : '–'
                    }
                  </TableCell>
                  <TableCell>{item.proveedor}</TableCell>
                  <TableCell>{item.fechaIngreso ? formatDate(item.fechaIngreso) : '–'}</TableCell>
                  <TableCell>{item.precioUnitario.toFixed(2)} Bs</TableCell>
                  <TableCell>
                    {isLowStock(item.cantidad) && <Badge variant="warning">Poco stock</Badge>}
                    {isExpiringSoon(item.fechaVencimiento) && (
                      <Badge variant="error" className="ml-1">Por vencer</Badge>
                    )}
                    {!isLowStock(item.cantidad) && !isExpiringSoon(item.fechaVencimiento) && (
                      <Badge variant="success">Ok</Badge>
                    )}
                  </TableCell>
                  <TableCell className="space-x-2">
                    <Button size="sm" variant="outline" onClick={() => onEditItem(item)}>
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-error-600 hover:bg-error-50"
                      onClick={() => onDeleteItem(item)}
                    >
                      Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};