// File: src/pages/ProductsPage.tsx
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
import { Input } from '../components/ui/Input';
import { Modal, ModalBody, ModalFooter } from '../components/ui/Modal';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import { useProductStore } from '../store/productStore';
import { Product } from '../types';
import { toast } from 'react-hot-toast';

export const ProductsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);

  const {
    products,
    isLoading,
    error,
    fetchProductsBySucursal,
    addProduct,
    updateProduct,
    deleteProduct
  } = useProductStore();

  // Cargar productos por sucursal al montar
  useEffect(() => {
    (async () => {
      try {
        const fetched = await fetchProductsBySucursal();
        setFilteredProducts(fetched);
      } catch {
        toast.error('Error al cargar productos por sucursal');
      }
    })();
  }, [fetchProductsBySucursal]);

  // Filtrado por búsqueda
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredProducts(products);
      return;
    }
    const q = searchQuery.toLowerCase();
    setFilteredProducts(
      products.filter(p =>
        p.nombre.toLowerCase().includes(q) ||
        p.descripcion.toLowerCase().includes(q)
      )
    );
  }, [searchQuery, products]);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Paginación
  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // Modal Agregar/Editar
  const openAddModal = () => {
    setIsEditing(false);
    setCurrentProduct({
      nombre: '',
      descripcion: '',
      stock: 0,
      unidad: '',
      proveedor: '',
      categoria: '',
      precio: 0,
    });
    setIsModalOpen(true);
  };
  const openEditModal = (product: Product) => {
    setIsEditing(true);
    setCurrentProduct(product);
    setIsModalOpen(true);
  };

  // Eliminar
  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto? Esta acción no se puede deshacer.')) return;
    try {
      await deleteProduct(id);
      toast.success('Producto eliminado correctamente');
      setFilteredProducts(prev => prev.filter(p => p.idProducto !== id));
    } catch {
      toast.error('Error al eliminar producto');
    }
  };

  // Cambios en inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setCurrentProduct(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
  };

  // Guardar
  const handleSubmit = async () => {
    if (!currentProduct.nombre || !currentProduct.descripcion) {
      toast.error('Por favor, completa todos los campos obligatorios');
      return;
    }
    try {
      if (isEditing && currentProduct.idProducto) {
        await updateProduct(currentProduct.idProducto, currentProduct);
        toast.success('Producto actualizado correctamente');
      } else {
        await addProduct(currentProduct as Omit<Product, 'idProducto'>);
        toast.success('Producto agregado correctamente');
      }
      setIsModalOpen(false);
    } catch {
      toast.error('Ocurrió un error. Intenta de nuevo.');
    }
  };

  // Renderizado de estados
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <p className="text-error-600 text-lg mb-4">Error al cargar productos</p>
        <Button onClick={() => fetchProductsBySucursal()}>Reintentar</Button>
      </div>
    );
  }
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
      <div className="pb-5 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">
          Gestión de Productos
        </h3>
        <p className="mt-2 text-sm text-gray-500">
          Administra los productos, el stock y categorías
        </p>
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="relative w-full md:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Buscar productos..."
            className="pl-10"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <Button leftIcon={<Plus size={16} />} onClick={openAddModal}>
          Agregar Producto
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Unidad</TableHead>
              <TableHead>Proveedor</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                  No se encontraron productos.
                </TableCell>
              </TableRow>
            ) : (
              currentProducts.map(product => (
                <TableRow key={product.idProducto}>
                  <TableCell>{product.nombre}</TableCell>
                  <TableCell>{product.descripcion}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>{product.unidad}</TableCell>
                  <TableCell>{product.proveedor}</TableCell>
                  <TableCell>{product.categoria}</TableCell>
                  <TableCell>{product.precio.toFixed(2)} Bs</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<Edit size={16} />}
                        onClick={() => openEditModal(product)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<Trash2 size={16} />}
                        className="text-error-600 hover:bg-error-50"
                        onClick={() => handleDelete(product.idProducto)}
                      >
                        Eliminar
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <div className="flex justify-between items-center p-4">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>
          <span>
            Página {currentPage} de {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={handleNext}
            disabled={currentPage === totalPages}
          >
            Siguiente
          </Button>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditing ? 'Editar Producto' : 'Agregar Producto'}
        maxWidth="xl"
      >
        <ModalBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nombre"
              name="nombre"
              value={currentProduct.nombre || ''}
              onChange={handleChange}
              required
            />
            <Input
              label="Descripción"
              name="descripcion"
              value={currentProduct.descripcion || ''}
              onChange={handleChange}
              required
            />
            <Input
              label="Stock"
              type="number"
              name="stock"
              value={currentProduct.stock?.toString() || '0'}
              onChange={handleChange}
              required
            />
            <Input
              label="Unidad"
              name="unidad"
              value={currentProduct.unidad || ''}
              onChange={handleChange}
              required
            />
            <Input
              label="Proveedor"
              name="proveedor"
              value={currentProduct.proveedor || ''}
              onChange={handleChange}
              required
            />
            <Input
              label="Categoría"
              name="categoria"
              value={currentProduct.categoria || ''}
              onChange={handleChange}
              required
            />
            <Input
              label="Precio (Bs)"
              type="number"
              step="0.01"
              name="precio"
              value={currentProduct.precio?.toString() || '0'}
              onChange={handleChange}
              required
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onClick={() => setIsModalOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>
            {isEditing ? 'Actualizar Producto' : 'Agregar Producto'}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};