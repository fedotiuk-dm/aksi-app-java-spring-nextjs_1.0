'use client';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// UI стан для одностанкового замовлення
interface OrderOnepageUIState {
  // Сесія та базова інформація
  sessionId: string | null;
  orderId: string | null;

  // Клієнт
  selectedClientId: string | null;
  showClientForm: boolean;

  // Предмети
  showItemDialog: boolean;
  editingItemId: string | null;

  // Загальні UI флаги
  isLoading: boolean;
  hasUnsavedChanges: boolean;
}

// UI дії
interface OrderOnepageUIActions {
  // Сесія
  setSessionId: (sessionId: string | null) => void;
  setOrderId: (orderId: string | null) => void;

  // Клієнт
  setSelectedClientId: (clientId: string | null) => void;
  setShowClientForm: (show: boolean) => void;

  // Предмети
  setShowItemDialog: (show: boolean) => void;
  setEditingItemId: (itemId: string | null) => void;
  startAddItem: () => void;
  startEditItem: (itemId: string) => void;
  closeItemDialog: () => void;

  // Загальні дії
  setLoading: (loading: boolean) => void;
  setHasUnsavedChanges: (hasChanges: boolean) => void;
  resetState: () => void;
}

const initialState: OrderOnepageUIState = {
  sessionId: null,
  orderId: null,
  selectedClientId: null,
  showClientForm: false,
  showItemDialog: false,
  editingItemId: null,
  isLoading: false,
  hasUnsavedChanges: false,
};

export const useOrderOnepageStore = create<OrderOnepageUIState & OrderOnepageUIActions>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // Сесія
      setSessionId: (sessionId) => set({ sessionId }),
      setOrderId: (orderId) => set({ orderId }),

      // Клієнт
      setSelectedClientId: (selectedClientId) => set({ selectedClientId }),
      setShowClientForm: (showClientForm) => set({ showClientForm }),

      // Предмети
      setShowItemDialog: (showItemDialog) => set({ showItemDialog }),
      setEditingItemId: (editingItemId) => set({ editingItemId }),

      startAddItem: () =>
        set({
          showItemDialog: true,
          editingItemId: null,
        }),

      startEditItem: (itemId) =>
        set({
          showItemDialog: true,
          editingItemId: itemId,
        }),

      closeItemDialog: () =>
        set({
          showItemDialog: false,
          editingItemId: null,
        }),

      // Загальні дії
      setLoading: (isLoading) => set({ isLoading }),
      setHasUnsavedChanges: (hasUnsavedChanges) => set({ hasUnsavedChanges }),

      resetState: () => set(initialState),
    }),
    { name: 'order-onepage-store' }
  )
);

// Селектори
export const useIsItemDialogOpen = () => useOrderOnepageStore((state) => state.showItemDialog);

export const useIsAddingItem = () =>
  useOrderOnepageStore((state) => state.showItemDialog && !state.editingItemId);

export const useIsEditingItem = () =>
  useOrderOnepageStore((state) => state.showItemDialog && !!state.editingItemId);

export const useHasSelectedClient = () => useOrderOnepageStore((state) => !!state.selectedClientId);

export const useCanProceed = () =>
  useOrderOnepageStore((state) => !!state.sessionId && !!state.selectedClientId);
