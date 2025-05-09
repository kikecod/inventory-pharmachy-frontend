// File: src/pages/ProductsPage.tsx
import React, { useState, useEffect } from 'react';
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell
} from '../components/ui/Table';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal, ModalBody, ModalFooter } from '../components/ui/Modal';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import { Combobox } from '@headlessui/react';
import { useProductStore } from '../store/productStore';
import { useUnidadStore } from '../store/unidadStore';
import { useProveedorStore } from '../store/proveedorStore';
import { useCategoriaStore } from '../store/categoriaStore';
import { Product, Unidad, Provider, Category } from '../types';
import { toast } from 'react-hot-toast';

export const ProductsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({});
  const [selectedUnidad, setSelectedUnidad] = useState<Unidad | null>(null);
  const [selectedProveedor, setSelectedProveedor] = useState<Provider | null>(null);
  const [selectedCategoria, setSelectedCategoria] = useState<Category | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  const {
    products,
    isLoading,
    error,
    fetchProductsBySucursal,
    addProduct,
    updateProduct,
    deleteProduct
  } = useProductStore();

  const { unidades, fetchUnidades } = useUnidadStore();
  const { providers, fetchProviders } = useProveedorStore();
  const { categorias, fetchCategorias } = useCategoriaStore();

  useEffect(() => {
    fetchProductsBySucursal()
      .then((res) => {
        console.log('Productos recibidos:', res); // ✅ <- Agrega esto
        setFilteredProducts(res);
      })
      .catch(() => toast.error('Error al cargar productos'));
    fetchUnidades();
    fetchProviders();
    fetchCategorias();
  }, [fetchProductsBySucursal, fetchUnidades, fetchProviders, fetchCategorias]);

  useEffect(() => {
    if (!searchQuery.trim()) return setFilteredProducts(products);
    const q = searchQuery.toLowerCase();
    setFilteredProducts(
      products.filter(p =>
        p.nombre.toLowerCase().includes(q) ||
        p.descripcion.toLowerCase().includes(q)
      )
    );
  }, [searchQuery, products]);

  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);

  const openAddModal = () => {
    setIsEditing(false);
    setCurrentProduct({ nombre: '', descripcion: '', stock: 0, precio: 0 });
    setSelectedUnidad(null);
    setSelectedProveedor(null);
    setSelectedCategoria(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setIsEditing(true);
    setCurrentProduct(product);
    setSelectedUnidad(unidades.find(u => u.idUnidad === product.idUnidad) || null);
    setSelectedProveedor(providers.find(p => p.idProveedor === product.idProveedor) || null);
    setSelectedCategoria(categorias.find(c => c.idCategoria === product.idCategoria) || null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;
    try {
      console.log('ID a eliminar:', id);
      await deleteProduct(id);
      await fetchProductsBySucursal().then(setFilteredProducts);
      toast.success('Producto eliminado');
    } catch {
      toast.error('Error al eliminar producto');
    }
  };

  const handleSubmit = async () => {
    if (!currentProduct.nombre || !currentProduct.descripcion
      || !selectedUnidad || !selectedProveedor || !selectedCategoria
    ) {
      toast.error('Completa todos los campos antes de guardar');
      return;
    }
    const payload = {
      nombre: currentProduct.nombre,
      descripcion: currentProduct.descripcion,
      stock: currentProduct.stock,
      precio: currentProduct.precio,
      idUnidad: selectedUnidad.idUnidad,
      idProveedor: selectedProveedor.idProveedor,
      idCategoria: selectedCategoria.idCategoria,
    };
    try {
      if (isEditing && currentProduct.idProducto) {
        console.log('ID a actualizar:', currentProduct.idProducto);
        console.log('Payload:', payload);
        await updateProduct(currentProduct.idProducto, payload);
        toast.success('Producto actualizado');
      } else {
        await addProduct(payload);
        toast.success('Producto agregado');
      }
      setIsModalOpen(false);
      await fetchProductsBySucursal().then(setFilteredProducts);
    } catch {
      toast.error('Error al guardar el producto');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in p-4">
      <div className="pb-5 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Gestión de Productos</h3>
        <p className="mt-2 text-sm text-gray-500">Administra productos, unidades y proveedores</p>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2 top-2.5 text-gray-400" size={18} />
          <Input
            type="text"
            placeholder="Buscar productos..."
            className="pl-8"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <Button leftIcon={<Plus />} onClick={openAddModal}>Agregar Producto</Button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Unidad</TableHead>
              <TableHead>Proveedor</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-6 text-gray-500">
                  No se encontraron productos.
                </TableCell>
              </TableRow>
            ) : (
              currentProducts.map(p => (
                <TableRow key={p.idProducto}>
                  <TableCell>{p.nombre}</TableCell>
                  <TableCell>{p.descripcion}</TableCell>
                  <TableCell>{p.stock}</TableCell>
                  <TableCell>{p.precio?.toFixed(2)} Bs</TableCell>
                  <TableCell>{p.unidad}</TableCell>
                  <TableCell>{p.proveedor}</TableCell>
                  <TableCell>{p.categoria}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => openEditModal(p)}>
                        <Edit size={16} />
                      </Button>
                      <Button size="sm" variant="outline" className="text-error-600" onClick={() => handleDelete(p.idProducto)}>
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditing ? 'Editar Producto' : 'Agregar Producto'}
        maxWidth="xl"
      >
        <ModalBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Nombre" value={currentProduct.nombre || ''} onChange={e => setCurrentProduct(p => ({ ...p, nombre: e.target.value }))} />
            <Input label="Descripción" value={currentProduct.descripcion || ''} onChange={e => setCurrentProduct(p => ({ ...p, descripcion: e.target.value }))} />
            <Input label="Stock" type="number" value={currentProduct.stock?.toString() || ''} onChange={e => setCurrentProduct(p => ({ ...p, stock: parseInt(e.target.value) || 0 }))} />
            <Input label="Precio (Bs)" type="number" value={currentProduct.precio?.toString() || ''} onChange={e => setCurrentProduct(p => ({ ...p, precio: parseFloat(e.target.value) || 0 }))} />

            <div>
              <Combobox value={selectedUnidad} onChange={setSelectedUnidad}>
                <Combobox.Label>Unidad</Combobox.Label>
                <Combobox.Input className="w-full border rounded px-2 py-1" displayValue={(u: Unidad) => u?.descripcion || ''} />
                <Combobox.Options className="border rounded mt-1 max-h-40 overflow-auto">
                  {unidades.map(u => (
                    <Combobox.Option key={u.idUnidad} value={u} className={({ active }) => `cursor-pointer px-2 py-1 ${active ? 'bg-blue-100' : ''}`}>
                      {u.descripcion}
                    </Combobox.Option>
                  ))}
                </Combobox.Options>
              </Combobox>
            </div>

            <div>
              <Combobox value={selectedProveedor} onChange={setSelectedProveedor}>
                <Combobox.Label>Proveedor</Combobox.Label>
                <Combobox.Input className="w-full border rounded px-2 py-1" displayValue={(p: Provider) => p?.nombre || ''} />
                <Combobox.Options className="border rounded mt-1 max-h-40 overflow-auto">
                  {providers.map(p => (
                    <Combobox.Option key={p.idProveedor} value={p} className={({ active }) => `cursor-pointer px-2 py-1 ${active ? 'bg-blue-100' : ''}`}>
                      {p.nombre}
                    </Combobox.Option>
                  ))}
                </Combobox.Options>
              </Combobox>
            </div>

            <div>
              <Combobox value={selectedCategoria} onChange={setSelectedCategoria}>
                <Combobox.Label>Categoría</Combobox.Label>
                <Combobox.Input className="w-full border rounded px-2 py-1" displayValue={(c: Category) => c?.nombre || ''} />
                <Combobox.Options className="border rounded mt-1 max-h-40 overflow-auto">
                  {categorias.map(c => (
                    <Combobox.Option key={c.idCategoria} value={c} className={({ active }) => `cursor-pointer px-2 py-1 ${active ? 'bg-blue-100' : ''}`}>
                      {c.nombre}
                    </Combobox.Option>
                  ))}
                </Combobox.Options>
              </Combobox>
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
          <Button onClick={handleSubmit}>{isEditing ? 'Actualizar Producto' : 'Agregar Producto'}</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};