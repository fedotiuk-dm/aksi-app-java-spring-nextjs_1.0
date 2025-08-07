import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { 
  CustomerInfo,
  CartInfo,
} from '@/shared/api/generated/customer';

interface CartUIState {
  // UI State
  isCartOpen: boolean;
  isAddItemModalOpen: boolean;
  selectedCustomer: CustomerInfo | null;
  
  // Actions
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  
  openAddItemModal: () => void;
  closeAddItemModal: () => void;
  
  setSelectedCustomer: (customer: CustomerInfo | null) => void;
  
  // Computed helpers
  hasSelectedCustomer: () => boolean;
}

export const useCartStore = create<CartUIState>()(
  devtools(
    (set, get) => ({
      // Initial state
      isCartOpen: false,
      isAddItemModalOpen: false,
      selectedCustomer: null,
      
      // Cart actions
      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),
      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
      
      // Add item modal actions
      openAddItemModal: () => set({ isAddItemModalOpen: true }),
      closeAddItemModal: () => set({ isAddItemModalOpen: false }),
      
      // Customer selection
      setSelectedCustomer: (customer) => set({ selectedCustomer: customer }),
      
      // Computed
      hasSelectedCustomer: () => get().selectedCustomer !== null,
    }),
    {
      name: 'cart-store',
    }
  )
);