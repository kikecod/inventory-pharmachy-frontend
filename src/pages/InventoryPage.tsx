import React, { useState, useEffect } from 'react';
import { InventoryTable } from '../components/inventory/InventoryTable';
import { Modal, ModalBody, ModalFooter } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { useInventoryStore } from '../store/inventoryStore';
import { useProductStore } from '../store/productStore';
import { InventoryItem } from '../types';
import { toast } from 'react-hot-toast';

export const InventoryPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState<Partial<InventoryItem>>({});
  
  const { inventory, isLoading, fetchInventory, addInventoryItem, updateInventoryItem } = useInventoryStore();
  const { products, fetchProducts } = useProductStore();
  
  useEffect(() => {
    fetchInventory();
    fetchProducts();
  }, [fetchInventory, fetchProducts]);
  
  const handleAddItem = () => {
    setIsEditing(false);
    setCurrentItem({
      productId: '',
      batchNumber: '',
      quantity: 0,
      expiryDate: '',
      receivedDate: new Date().toISOString().split('T')[0],
      supplierName: '',
    });
    setIsModalOpen(true);
  };
  
  const handleEditItem = (item: InventoryItem) => {
    setIsEditing(true);
    setCurrentItem({
      ...item,
      expiryDate: new Date(item.expiryDate).toISOString().split('T')[0],
      receivedDate: new Date(item.receivedDate).toISOString().split('T')[0],
    });
    setIsModalOpen(true);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentItem((prev) => ({
      ...prev,
      [name]: name === 'quantity' ? parseInt(value) : value,
    }));
  };
  
  const handleSubmit = async () => {
    try {
      if (!currentItem.productId || !currentItem.batchNumber || !currentItem.expiryDate) {
        toast.error('Please fill in all required fields');
        return;
      }
      
      if (isEditing && currentItem.id) {
        await updateInventoryItem(currentItem.id, currentItem as InventoryItem);
        toast.success('Inventory item updated successfully');
      } else {
        await addInventoryItem(currentItem as Omit<InventoryItem, 'id'>);
        toast.success('Inventory item added successfully');
      }
      
      setIsModalOpen(false);
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    }
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="pb-5 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Inventory Management
        </h3>
        <p className="mt-2 max-w-4xl text-sm text-gray-500">
          Manage your pharmacy's inventory, track stock levels, and monitor expiry dates
        </p>
      </div>
      
      <InventoryTable 
        inventory={inventory} 
        isLoading={isLoading} 
        onAddItem={handleAddItem}
        onEditItem={handleEditItem}
      />
      
      {/* Add/Edit Inventory Item Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditing ? 'Edit Inventory Item' : 'Add Inventory Item'}
        maxWidth="lg"
      >
        <ModalBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Product"
              name="productId"
              value={currentItem.productId || ''}
              onChange={handleInputChange}
              options={[
                { value: '', label: 'Select a product' },
                ...products.map((product) => ({
                  value: product.id,
                  label: product.name,
                })),
              ]}
              required
            />
            
            <Input
              label="Batch Number"
              name="batchNumber"
              value={currentItem.batchNumber || ''}
              onChange={handleInputChange}
              required
            />
            
            <Input
              label="Quantity"
              type="number"
              name="quantity"
              value={currentItem.quantity?.toString() || '0'}
              onChange={handleInputChange}
              required
            />
            
            <Input
              label="Supplier Name"
              name="supplierName"
              value={currentItem.supplierName || ''}
              onChange={handleInputChange}
              required
            />
            
            <Input
              label="Expiry Date"
              type="date"
              name="expiryDate"
              value={currentItem.expiryDate || ''}
              onChange={handleInputChange}
              required
            />
            
            <Input
              label="Received Date"
              type="date"
              name="receivedDate"
              value={currentItem.receivedDate || ''}
              onChange={handleInputChange}
              required
            />
            
            <Input
              label="Notes (Optional)"
              name="notes"
              value={currentItem.notes || ''}
              onChange={handleInputChange}
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {isEditing ? 'Update' : 'Add'} Item
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};