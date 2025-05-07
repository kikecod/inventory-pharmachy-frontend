import { create } from 'zustand';
import { Customer } from '../types';
import { customerService } from '../services/api/customer.service';

interface CustomerState {
  customers: Customer[];
  currentCustomer: Customer | null;
  isLoading: boolean;
  error: string | null;
  fetchCustomers: () => Promise<void>;
  addCustomer: (customer: Omit<Customer, 'idCliente'>) => Promise<void>;
  updateCustomer: (id: number, customer: Partial<Customer>) => Promise<void>;
  deleteCustomer: (id: number) => Promise<void>;
  setCurrentCustomer: (customer: Customer | null) => void;
}

export const useCustomerStore = create<CustomerState>((set) => ({
  customers: [],
  currentCustomer: null,
  isLoading: false,
  error: null,

  fetchCustomers: async () => {
    set({ isLoading: true, error: null });
    try {
      const customers = await customerService.getCustomers();
      set({ customers });
    } catch (e) {
      set({ error: 'Failed to fetch customers' });
    } finally {
      set({ isLoading: false });
    }
  },

  addCustomer: async (customer) => {
    set({ isLoading: true, error: null });
    try {
      const newCust = await customerService.createCustomer(customer);
      set((state) => ({ customers: [...state.customers, newCust] }));
    } catch (e) {
      set({ error: 'Failed to add customer' });
    } finally {
      set({ isLoading: false });
    }
  },

  updateCustomer: async (id, customer) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await customerService.updateCustomer(id, customer);
      set((state) => ({
        customers: state.customers.map((c) =>
          c.idCliente === id ? updated : c
        ),
      }));
    } catch (e) {
      set({ error: 'Failed to update customer' });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteCustomer: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await customerService.deleteCustomer(id);
      set((state) => ({
        customers: state.customers.filter((c) => c.idCliente !== id),
      }));
    } catch (e) {
      set({ error: 'Failed to delete customer' });
    } finally {
      set({ isLoading: false });
    }
  },

  setCurrentCustomer: (customer) => set({ currentCustomer: customer }),
}));