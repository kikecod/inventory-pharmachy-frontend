import React, { useState, useEffect } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal, ModalBody, ModalFooter } from '../components/ui/Modal';
import { Search, Plus, Edit, Trash2} from 'lucide-react';
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
  

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const {
    products,
    isLoading,
    error,
    fetchProductsBySucursal,
    addProduct,
    updateProduct,
    deleteProduct
  } = useProductStore();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const fetched = await fetchProductsBySucursal();
        setFilteredProducts(fetched);
      } catch (err) {
        toast.error('Error al cargar productos por sucursal');
      }
    };
  
    loadProducts();
  }, [fetchProductsBySucursal]);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredProducts(products);
      return;
    }

    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = products.filter((product) =>
      product.nombre.toLowerCase().includes(lowercasedQuery) ||
      product.descripcion.toLowerCase().includes(lowercasedQuery)
    );

    setFilteredProducts(filtered);
  }, [searchQuery, products]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredProducts(products);
    }
  }, [products, searchQuery]);

  const handleAddProduct = () => {
    setIsEditing(false);
    setCurrentProduct({
      nombre: '',
      descripcion: '',
      stock: 0,
      idUnidad: 0,
      idProveedor: 0,
      idCategoria: 0,
    });
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setIsEditing(true);
    setCurrentProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (idProducto: number) => {
    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      try {
        await deleteProduct(idProducto);
        toast.success('Product deleted successfully');

        setFilteredProducts((prev) => prev.filter((product) => product.idProducto !== idProducto));
      } catch (error) {
        console.error('Error al eliminar el producto:', error);
        toast.error('Failed to delete product');
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;

    setCurrentProduct((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (!currentProduct.nombre || !currentProduct.descripcion) {
        toast.error('Please fill in all required fields');
        return;
      }

      if (isEditing && currentProduct.idProducto) {
        await updateProduct(currentProduct.idProducto, currentProduct);
        toast.success('Product updated successfully');
      } else {
        await addProduct(currentProduct as Omit<Product, 'idProducto'>);
        toast.success('Product added successfully');
      }

      setIsModalOpen(false);
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <p className="text-error-600 text-lg mb-4">Failed to load products</p>
        <Button onClick={() => fetchProductsBySucursal()}>Retry</Button>
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
    <div className="space-y-6 animate-fade-in">
      <div className="pb-5 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Product Management
        </h3>
        <p className="mt-2 max-w-4xl text-sm text-gray-500">
          Manage your pharmacy's products, stock, and categories
        </p>
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="relative w-full md:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Search products..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button leftIcon={<Plus size={16} />} onClick={handleAddProduct}>
          Add Product
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  No products found.
                </TableCell>
              </TableRow>
            ) : (
              currentProducts.map((product) => (
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
                        onClick={() => handleEditProduct(product)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<Trash2 size={16} />}
                        className="text-error-600 hover:bg-error-50"
                        onClick={() => handleDeleteProduct(product.idProducto)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
          <div className="flex justify-between items-center mt-4">
            <Button
              variant="outline"
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </Table>
      </div>

      {/* Add/Edit Product Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditing ? 'Edit Product' : 'Add Product'}
        maxWidth="xl"
      >
        <ModalBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Product Name"
              name="nombre"
              value={currentProduct.nombre || ''}
              onChange={handleInputChange}
              required
            />
            <Input
              label="Description"
              name="descripcion"
              value={currentProduct.descripcion || ''}
              onChange={handleInputChange}
              required
            />
            <Input
              label="Stock"
              type="number"
              name="stock"
              value={currentProduct.stock?.toString() || '0'}
              onChange={handleInputChange}
              required
            />
            <Input
              label="Unit ID"
              type="number"
              name="idUnidad"
              value={currentProduct.idUnidad?.toString() || '0'}
              onChange={handleInputChange}
              required
            />
            <Input
              label="Provider ID"
              type="number"
              name="idProveedor"
              value={currentProduct.idProveedor?.toString() || '0'}
              onChange={handleInputChange}
              required
            />
            <Input
              label="Category ID"
              type="number"
              name="idCategoria"
              value={currentProduct.idCategoria?.toString() || '0'}
              onChange={handleInputChange}
              required
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {isEditing ? 'Update' : 'Add'} Product
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};