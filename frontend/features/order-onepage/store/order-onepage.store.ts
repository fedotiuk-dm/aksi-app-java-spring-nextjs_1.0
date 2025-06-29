'use client';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// UI стан для одностанкового замовлення
interface OrderOnepageUIState {
  // Сесія та базова інформація
  sessionId: string | null;
  orderId: string | null;

  // Готовність етапів
  stage1Ready: boolean; // Клієнт та базова інформація готові
  stage2Ready: boolean; // Предмети готові
  stage3Ready: boolean; // Параметри готові
  stage4Ready: boolean; // Завершення готове

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

  // Готовність етапів
  setStage1Ready: (ready: boolean) => void;
  setStage2Ready: (ready: boolean) => void;
  setStage3Ready: (ready: boolean) => void;
  setStage4Ready: (ready: boolean) => void;

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
  stage1Ready: false,
  stage2Ready: false,
  stage3Ready: false,
  stage4Ready: false,
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

      // Готовність етапів
      setStage1Ready: (stage1Ready) => {
        console.log('🏪 Store: setStage1Ready called with:', stage1Ready);
        set({ stage1Ready });
      },
      setStage2Ready: (stage2Ready) => {
        console.log('🏪 Store: setStage2Ready called with:', stage2Ready);
        set({ stage2Ready });
      },
      setStage3Ready: (stage3Ready) => {
        console.log('🏪 Store: setStage3Ready called with:', stage3Ready);
        set({ stage3Ready });
      },
      setStage4Ready: (stage4Ready) => {
        console.log('🏪 Store: setStage4Ready called with:', stage4Ready);
        set({ stage4Ready });
      },

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

// Селектори готовності етапів
export const useStage1Ready = () => useOrderOnepageStore((state) => state.stage1Ready);
export const useStage2Ready = () => useOrderOnepageStore((state) => state.stage2Ready);
export const useStage3Ready = () => useOrderOnepageStore((state) => state.stage3Ready);
export const useStage4Ready = () => useOrderOnepageStore((state) => state.stage4Ready);

// Селектор загальної готовності
export const useAllStagesReady = () =>
  useOrderOnepageStore(
    (state) => state.stage1Ready && state.stage2Ready && state.stage3Ready && state.stage4Ready
  );
