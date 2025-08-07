import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { 
  CustomerInfo, 
  ListCustomersParams,
} from '@/shared/api/generated/customer';

interface CustomerState {
  // State
  searchQuery: string;
  phoneFilter: string;
  selectedCustomer: CustomerInfo | null;
  isFormOpen: boolean;
  
  // Actions
  setSearchQuery: (query: string) => void;
  setPhoneFilter: (phone: string) => void;
  setSelectedCustomer: (customer: CustomerInfo | null) => void;
  setFormOpen: (open: boolean) => void;
  
  // Computed
  getListParams: () => ListCustomersParams;
  resetFilters: () => void;
}

export const useCustomerStore = create<CustomerState>()(
  devtools(
    (set, get) => ({
      // Initial state
      searchQuery: '',
      phoneFilter: '',
      selectedCustomer: null,
      isFormOpen: false,
      
      // Actions
      setSearchQuery: (query) => set({ searchQuery: query }),
      setPhoneFilter: (phone) => set({ phoneFilter: phone }),
      setSelectedCustomer: (customer) => set({ selectedCustomer: customer }),
      setFormOpen: (open) => set({ isFormOpen: open }),
      
      // Computed getters
      getListParams: () => {
        const state = get();
        const params: ListCustomersParams = {};
        
        if (state.searchQuery.length >= 2) {
          params.search = state.searchQuery;
        }
        
        if (state.phoneFilter) {
          params.phone = state.phoneFilter;
        }
        
        return params;
      },
      
      resetFilters: () => set({
        searchQuery: '',
        phoneFilter: '',
      }),
    }),
    {
      name: 'customer-store',
    }
  )
);