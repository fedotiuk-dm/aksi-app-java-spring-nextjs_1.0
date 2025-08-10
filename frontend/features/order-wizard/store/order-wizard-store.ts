import { create } from 'zustand';
import type { PriceListItemInfoCategoryCode } from '@api/customer';
import type { UpdateCartModifiersRequestUrgencyType, UpdateCartModifiersRequestDiscountType } from '@api/cart';

interface OrderWizardStore {
  // UI state only - no API data
  selectedCustomerId: string | null;
  selectedBranchId: string | null;
  uniqueLabel: string;
  isCustomerFormOpen: boolean;
  editingItemId: string | null;
  
  // Item selection state (moved from useItemSelectionOperations)
  selectedCategoryCode: PriceListItemInfoCategoryCode | '';
  selectedItemId: string;
  isBlackCategory: boolean;
  
  // Modifiers selection state
  selectedModifiers: string[];
  
  // Summary parameters state (stage 3)
  selectedUrgency: UpdateCartModifiersRequestUrgencyType | '';
  selectedDiscount: UpdateCartModifiersRequestDiscountType | '';
  customDiscountPercentage: number;
  expectedDate: string;
  customerSignature: string;
  agreementAccepted: boolean;

  // Actions
  setSelectedCustomerId: (customerId: string | null) => void;
  setSelectedBranchId: (branchId: string | null) => void;
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
  
  // Summary parameters actions
  setSelectedUrgency: (urgency: UpdateCartModifiersRequestUrgencyType | '') => void;
  setSelectedDiscount: (discount: UpdateCartModifiersRequestDiscountType | '') => void;
  setCustomDiscountPercentage: (percentage: number) => void;
  setExpectedDate: (date: string) => void;
  setCustomerSignature: (signature: string) => void;
  setAgreementAccepted: (accepted: boolean) => void;
  resetSummaryParameters: () => void;
}

export const useOrderWizardStore = create<OrderWizardStore>
((set) => ({
  // Initial state
  selectedCustomerId: null,
  selectedBranchId: null,
  uniqueLabel: '',
  isCustomerFormOpen: false,
  editingItemId: null,
  selectedCategoryCode: '',
  selectedItemId: '',
  isBlackCategory: false,
  selectedModifiers: [],
  
  // Summary parameters initial state
  selectedUrgency: '',
  selectedDiscount: '',
  customDiscountPercentage: 0,
  expectedDate: '',
  customerSignature: '',
  agreementAccepted: false,

  // Actions
  setSelectedCustomerId: (customerId) => set({ selectedCustomerId: customerId }),
  setSelectedBranchId: (branchId) => set({ selectedBranchId: branchId }),
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
  
  // Summary parameters actions
  setSelectedUrgency: (urgency) => set({ selectedUrgency: urgency }),
  setSelectedDiscount: (discount) => set({ selectedDiscount: discount }),
  setCustomDiscountPercentage: (percentage) => set({ customDiscountPercentage: percentage }),
  setExpectedDate: (date) => set({ expectedDate: date }),
  setCustomerSignature: (signature) => set({ customerSignature: signature }),
  setAgreementAccepted: (accepted) => set({ agreementAccepted: accepted }),
  resetSummaryParameters: () => set({
    selectedUrgency: '',
    selectedDiscount: '',
    customDiscountPercentage: 0,
    expectedDate: '',
    customerSignature: '',
    agreementAccepted: false
  }),
  
  // Reset functions
  resetItemSelection: () => set({
    selectedCategoryCode: '',
    selectedItemId: '',
    isBlackCategory: false,
    editingItemId: null,
    selectedModifiers: [],
  }),
  
  resetOrderWizard: () => set({
    selectedCustomerId: null,
    selectedBranchId: null,
    uniqueLabel: '',
    isCustomerFormOpen: false,
    editingItemId: null,
    selectedCategoryCode: '',
    selectedItemId: '',
    isBlackCategory: false,
    selectedModifiers: [],
    selectedUrgency: '',
    selectedDiscount: '',
    customDiscountPercentage: 0,
    expectedDate: '',
    customerSignature: '',
    agreementAccepted: false
  }),
}));