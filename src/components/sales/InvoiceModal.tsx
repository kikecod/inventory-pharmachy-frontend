import React from 'react';
import { Modal, ModalBody } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Sale } from '../../types';
import { formatCurrency, formatDate } from '../../lib/utils';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  sale: Sale;
  onPrint: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  isOpen,
  onClose,
  sale,
  onPrint,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Invoice"
      maxWidth="md"
    >
      <ModalBody>
        <div className="p-6 space-y-6" id="invoice-content">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-2xl font-bold">PharmaSys</h2>
            <p className="text-gray-600">123 Main Street</p>
            <p className="text-gray-600">City, Country</p>
            <p className="text-gray-600">Phone: (123) 456-7890</p>
          </div>

          {/* Invoice Details */}
          <div className="border-t border-b border-gray-200 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Invoice #: {sale.id}</p>
                <p className="text-gray-600">Date: {formatDate(sale.createdAt)}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-600">Customer: {sale.customerName}</p>
                <p className="text-gray-600">Payment: {sale.paymentMethod}</p>
              </div>
            </div>
          </div>

          {/* Items */}
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2">Item</th>
                <th className="text-right py-2">Qty</th>
                <th className="text-right py-2">Price</th>
                <th className="text-right py-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {sale.items.map((item) => (
                <tr key={item.productId} className="border-b border-gray-100">
                  <td className="py-2">{item.productName}</td>
                  <td className="text-right py-2">{item.quantity}</td>
                  <td className="text-right py-2">{formatCurrency(item.unitPrice)}</td>
                  <td className="text-right py-2">{formatCurrency(item.subtotal)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="font-bold">
                <td colSpan={3} className="text-right py-4">Total:</td>
                <td className="text-right py-4">{formatCurrency(sale.total)}</td>
              </tr>
            </tfoot>
          </table>

          {/* Footer */}
          <div className="text-center text-gray-600 text-sm">
            <p>Thank you for your purchase!</p>
            <p>Please keep this invoice for your records.</p>
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={onPrint}>
            Print Invoice
          </Button>
        </div>
      </ModalBody>
    </Modal>
  );
};