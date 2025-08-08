import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { CustomerInfo } from '@/shared/api/generated/customer';
import type { BranchInfo } from '@/shared/api/generated/branch';

interface OrderWizardStore {
  // Customer Section UI State
  selectedCustomer: CustomerInfo | null;
  isCustomerFormOpen: boolean;
  
  // Order Basic Info  
  uniqueLabel: string;
  selectedBranch: BranchInfo | null;
  
  // Item Form UI State
  isItemFormOpen: boolean;
  editingItemId: string | null;
  
  // Actions
  setSelectedCustomer: (customer: CustomerInfo | null) => void;
  setCustomerFormOpen: (open: boolean) => void;
  setUniqueLabel: (label: string) => void;
  setSelectedBranch: (branch: BranchInfo | null) => void;
  setItemFormOpen: (open: boolean) => void;
  setEditingItemId: (id: string | null) => void;
  
  // Reset
  resetOrderWizard: () => void;
}

const initialState = {
  selectedCustomer: null,
  isCustomerFormOpen: false,
  uniqueLabel: '',
  selectedBranch: null,
  isItemFormOpen: false,
  editingItemId: null,
};

export const useOrderWizardStore = create<OrderWizardStore>()(
  devtools(
    (set) => ({
      ...initialState,
      
      setSelectedCustomer: (customer) => set({ selectedCustomer: customer }),
      setCustomerFormOpen: (open) => set({ isCustomerFormOpen: open }),
      setUniqueLabel: (label) => set({ uniqueLabel: label }),
      setSelectedBranch: (branch) => set({ selectedBranch: branch }),
      setItemFormOpen: (open) => set({ isItemFormOpen: open }),
      setEditingItemId: (id) => set({ editingItemId: id }),
      
      resetOrderWizard: () => set(initialState),
    }),
    { name: 'order-wizard-store' }
  )
);