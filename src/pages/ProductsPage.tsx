import React, { useState, useEffect } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Modal, ModalBody, ModalFooter } from '../components/ui/Modal';
import { Search, Filter, Plus, Edit, Trash2 } from 'lucide-react';
import { useProductStore } from '../store/productStore';
import { Product } from '../types';
import { formatCurrency } from '../lib/utils';
import { toast } from 'react-hot-toast';

export const ProductsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({});
  
  const { products, categories, isLoading, error, fetchProducts, fetchCategories, addProduct, updateProduct, deleteProduct } = useProductStore();
  
  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([fetchProducts(), fetchCategories()]);
      } catch (err) {
        toast.error('Failed to load products');
      }
    };
    loadData();
  }, [fetchProducts, fetchCategories]);
  
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredProducts(products);
      return;
    }
    
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = products.filter((product) => 
      product.name.toLowerCase().includes(lowercasedQuery) ||
      product.sku.toLowerCase().includes(lowercasedQuery) ||
      product.category.toLowerCase().includes(lowercasedQuery) ||
      product.manufacturer.toLowerCase().includes(lowercasedQuery)
    );
    
    setFilteredProducts(filtered);
  }, [searchQuery, products]);
  
  const handleAddProduct = () => {
    setIsEditing(false);
    setCurrentProduct({
      name: '',
      description: '',
      category: '',
      sku: '',
      price: 0,
      costPrice: 0,
      stockQuantity: 0,
      expiryDate: '',
      manufacturer: '',
      requiresPrescription: false,
    });
    setIsModalOpen(true);
  };
  
  const handleEditProduct = (product: Product) => {
    setIsEditing(true);
    setCurrentProduct({
      ...product,
      expiryDate: new Date(product.expiryDate).toISOString().split('T')[0],
    });
    setIsModalOpen(true);
  };
  
  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      try {
        await deleteProduct(id);
        toast.success('Product deleted successfully');
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setCurrentProduct((prev) => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : type === 'number' 
          ? parseFloat(value) 
          : value,
    }));
  };
  
  const handleSubmit = async () => {
    try {
      if (!currentProduct.name || !currentProduct.sku || !currentProduct.category) {
        toast.error('Please fill in all required fields');
        return;
      }
      
      if (isEditing && currentProduct.id) {
        await updateProduct(currentProduct.id, currentProduct);
        toast.success('Product updated successfully');
      } else {
        await addProduct(currentProduct as Omit<Product, 'id'>);
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
        <Button onClick={() => fetchProducts()}>Retry</Button>
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
          Manage your pharmacy's products, pricing, and categories
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
        
        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="outline" leftIcon={<Filter size={16} />}>
            Filter
          </Button>
          
          <Button leftIcon={<Plus size={16} />} onClick={handleAddProduct}>
            Add Product
          </Button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Prescription</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  No products found.
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.sku}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{product.category}</Badge>
                  </TableCell>
                  <TableCell>{formatCurrency(product.price)}</TableCell>
                  <TableCell>
                    {product.stockQuantity <= 10 ? (
                      <Badge variant="warning">{product.stockQuantity} left</Badge>
                    ) : (
                      product.stockQuantity
                    )}
                  </TableCell>
                  <TableCell>
                    {product.requiresPrescription ? (
                      <Badge variant="primary">Required</Badge>
                    ) : (
                      <Badge variant="outline">Not Required</Badge>
                    )}
                  </TableCell>
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
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
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
              name="name"
              value={currentProduct.name || ''}
              onChange={handleInputChange}
              required
            />
            
            <Input
              label="SKU"
              name="sku"
              value={currentProduct.sku || ''}
              onChange={handleInputChange}
              required
            />
            
            <Input
              label="Category"
              name="category"
              value={currentProduct.category || ''}
              onChange={handleInputChange}
              required
            />
            
            <Input
              label="Manufacturer"
              name="manufacturer"
              value={currentProduct.manufacturer || ''}
              onChange={handleInputChange}
              required
            />
            
            <Input
              label="Price ($)"
              type="number"
              name="price"
              value={currentProduct.price?.toString() || '0'}
              onChange={handleInputChange}
              required
            />
            
            <Input
              label="Cost Price ($)"
              type="number"
              name="costPrice"
              value={currentProduct.costPrice?.toString() || '0'}
              onChange={handleInputChange}
              required
            />
            
            <Input
              label="Stock Quantity"
              type="number"
              name="stockQuantity"
              value={currentProduct.stockQuantity?.toString() || '0'}
              onChange={handleInputChange}
              required
            />
            
            <Input
              label="Expiry Date"
              type="date"
              name="expiryDate"
              value={currentProduct.expiryDate || ''}
              onChange={handleInputChange}
              required
            />
            
            <div className="col-span-2">
              <Input
                label="Description"
                name="description"
                value={currentProduct.description || ''}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="requiresPrescription"
                name="requiresPrescription"
                checked={currentProduct.requiresPrescription || false}
                onChange={handleInputChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="requiresPrescription" className="text-sm text-gray-700">
                Requires Prescription
              </label>
            </div>
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