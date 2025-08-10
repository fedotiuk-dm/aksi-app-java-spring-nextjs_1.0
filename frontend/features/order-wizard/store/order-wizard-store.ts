import { create } from 'zustand';
import type { CustomerInfo, BranchInfo, PriceListItemInfoCategoryCode } from '@api/customer';

interface OrderWizardStore {
  // UI state only - no API data
  selectedCustomer: CustomerInfo | null;
  selectedBranch: BranchInfo | null;
  uniqueLabel: string;
  isCustomerFormOpen: boolean;
  editingItemId: string | null;
  
  // Item selection state (moved from useItemSelectionOperations)
  selectedCategoryCode: PriceListItemInfoCategoryCode | '';
  selectedItemId: string;
  isBlackCategory: boolean;
  
  // Modifiers selection state
  selectedModifiers: string[];

  // Actions
  setSelectedCustomer: (customer: CustomerInfo | null) => void;
  setSelectedBranch: (branch: BranchInfo | null) => void;
  setUniqueLabel: (label: string) => void;
  setCustomerFormOpen: (open: boolean) => void;
  setEditingItemId: (id: string | null) => void;
  setSelectedCategoryCode: (code: PriceListItemInfoCategoryCode | '') => void;
  setSelectedItemId: (id: string) => void;
  setIsBlackCategory: (isBlack: boolean) => void;
  setSelectedModifiers: (modifiers: string[]) => void;
  addSelectedModifier: (modifier: string) => void;
  removeSelectedModifier: (modifier: string) => void;
  resetSelectedModifiers: () => void;
  resetOrderWizard: () => void;
  resetItemSelection: () => void;
}

export const useOrderWizardStore = create<OrderWizardStore>((set) => ({
  // Initial state
  selectedCustomer: null,
  selectedBranch: null,
  uniqueLabel: '',
  isCustomerFormOpen: false,
  editingItemId: null,
  selectedCategoryCode: '',
  selectedItemId: '',
  isBlackCategory: false,
  selectedModifiers: [],

  // Actions
  setSelectedCustomer: (customer) => set({ selectedCustomer: customer }),
  setSelectedBranch: (branch) => set({ selectedBranch: branch }),
  setUniqueLabel: (label) => set({ uniqueLabel: label }),
  setCustomerFormOpen: (open) => set({ isCustomerFormOpen: open }),
  setEditingItemId: (id) => set({ editingItemId: id }),
  setSelectedCategoryCode: (code) => set({ selectedCategoryCode: code }),
  setSelectedItemId: (id) => set({ selectedItemId: id }),
  setIsBlackCategory: (isBlack) => set({ isBlackCategory: isBlack }),
  
  // Modifiers actions
  setSelectedModifiers: (modifiers) => set({ selectedModifiers: modifiers }),
  addSelectedModifier: (modifier) => set((state) => ({
    selectedModifiers: [...state.selectedModifiers, modifier]
  })),
  removeSelectedModifier: (modifier) => set((state) => ({
    selectedModifiers: state.selectedModifiers.filter(m => m !== modifier)
  })),
  resetSelectedModifiers: () => set({ selectedModifiers: [] }),
  
  // Reset functions
  resetItemSelection: () => set({
    selectedCategoryCode: '',
    selectedItemId: '',
    isBlackCategory: false,
    editingItemId: null,
    selectedModifiers: [],
  }),
  
  resetOrderWizard: () => set({
    selectedCustomer: null,
    selectedBranch: null,
    uniqueLabel: '',
    isCustomerFormOpen: false,
    editingItemId: null,
    selectedCategoryCode: '',
    selectedItemId: '',
    isBlackCategory: false,
    selectedModifiers: [],
  }),
}));