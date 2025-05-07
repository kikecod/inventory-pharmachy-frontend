import { create } from 'zustand';
import { Customer } from '../types/index';
import { customersService } from '../services/api/customer.service';

interface CustomerState {
  customers: Customer[];
  isLoading: boolean;
  error: string | null;
  fetchCustomers: () => Promise<void>;
  addCustomer: (customer: Omit<Customer, 'idCliente'>) => Promise<void>;
  updateCustomer: (id: number, updates: Partial<Customer>) => Promise<void>;
  deleteCustomer: (id: number) => Promise<void>;
}

export const useCustomerStore = create<CustomerState>((set) => ({
  customers: [],
  isLoading: false,
  error: null,

  fetchCustomers: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await customersService.getCustomers();
      set({ customers: data });
    } catch (err) {
      console.error(err);
      set({ error: 'Failed to load customers' });
    } finally {
      set({ isLoading: false });
    }
  },

  addCustomer: async (customer) => {
    set({ isLoading: true, error: null });
    try {
      const newCust = await customersService.createCustomer(customer);
      set((state) => ({ customers: [...state.customers, newCust] }));
    } catch (err) {
      console.error(err);
      set({ error: 'Failed to add customer' });
    } finally {
      set({ isLoading: false });
    }
  },

  updateCustomer: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await customersService.updateCustomer(id, updates);
      set((state) => ({ customers: state.customers.map(c => c.idCliente === id ? updated : c) }));
    } catch (err) {
      console.error(err);
      set({ error: 'Failed to update customer' });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteCustomer: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await customersService.deleteCustomer(id);
      set((state) => ({ customers: state.customers.filter(c => c.idCliente !== id) }));
    } catch (err) {
      console.error(err);
      set({ error: 'Failed to delete customer' });
    } finally {
      set({ isLoading: false });
    }
  },
  

}));