import { create } from 'zustand';
import type { CustomerInfo, BranchInfo } from '@/shared/api/generated';

interface OrderWizardStore {
  // UI state only - no API data
  selectedCustomer: CustomerInfo | null;
  selectedBranch: BranchInfo | null;
  uniqueLabel: string;
  isCustomerFormOpen: boolean;
  editingItemId: string | null;

  // Actions
  setSelectedCustomer: (customer: CustomerInfo | null) => void;
  setSelectedBranch: (branch: BranchInfo | null) => void;
  setUniqueLabel: (label: string) => void;
  setCustomerFormOpen: (open: boolean) => void;
  setEditingItemId: (id: string | null) => void;
  resetOrderWizard: () => void;
}

export const useOrderWizardStore = create<OrderWizardStore>((set) => ({
  selectedCustomer: null,
  selectedBranch: null,
  uniqueLabel: '',
  isCustomerFormOpen: false,
  editingItemId: null,

  setSelectedCustomer: (customer) => set({ selectedCustomer: customer }),
  setSelectedBranch: (branch) => set({ selectedBranch: branch }),
  setUniqueLabel: (label) => set({ uniqueLabel: label }),
  setCustomerFormOpen: (open) => set({ isCustomerFormOpen: open }),
  setEditingItemId: (id) => set({ editingItemId: id }),
  
  resetOrderWizard: () => set({
    selectedCustomer: null,
    selectedBranch: null,
    uniqueLabel: '',
    isCustomerFormOpen: false,
    editingItemId: null,
  }),
}));