import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

import type {
  ServiceCategorySelectionData,
  PriceListItemSelectionData,
  QuantityInputData,
  ItemBasicInfoFormData,
} from './item-basic-info.schemas';

// UI стан для Item Basic Info
interface ItemBasicInfoUIState {
  // Сесія та ідентифікатори
  sessionId: string | null;
  itemId: string | null;

  // Вибрані значення
  selectedCategoryId: string | null;
  selectedItemId: string | null;
  enteredQuantity: number | null;
  selectedUnitOfMeasure: 'PIECES' | 'KILOGRAMS' | null;

  // UI стани
  isLoading: boolean;
  error: string | null;

  // Кроки завершення
  categorySelected: boolean;
  itemSelected: boolean;
  quantityEntered: boolean;
  substepCompleted: boolean;

  // Валідація
  isValid: boolean;
  validationErrors: string[];

  // Налаштування
  showAdvancedOptions: boolean;
  autoAdvanceToNext: boolean;
}

// Дії для Item Basic Info
interface ItemBasicInfoUIActions {
  // Основні сеттери
  setSessionId: (sessionId: string | null) => void;
  setItemId: (itemId: string | null) => void;
  setSelectedCategoryId: (categoryId: string | null) => void;
  setSelectedItemId: (itemId: string | null) => void;
  setEnteredQuantity: (quantity: number | null) => void;
  setSelectedUnitOfMeasure: (unit: 'PIECES' | 'KILOGRAMS' | null) => void;

  // UI стани
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;

  // Кроки завершення
  setCategorySelected: (selected: boolean) => void;
  setItemSelected: (selected: boolean) => void;
  setQuantityEntered: (entered: boolean) => void;
  setSubstepCompleted: (completed: boolean) => void;

  // Валідація
  setValid: (isValid: boolean) => void;
  setValidationErrors: (errors: string[]) => void;

  // Налаштування
  setShowAdvancedOptions: (show: boolean) => void;
  setAutoAdvanceToNext: (auto: boolean) => void;

  // Складні дії
  resetForm: () => void;
  resetState: () => void;
  updateFormData: (data: Partial<ItemBasicInfoFormData>) => void;

  // Валідація форми
  validateForm: () => boolean;
  getFormData: () => ItemBasicInfoFormData | null;
}

// Початковий стан
const initialState: ItemBasicInfoUIState = {
  sessionId: null,
  itemId: null,
  selectedCategoryId: null,
  selectedItemId: null,
  enteredQuantity: null,
  selectedUnitOfMeasure: null,
  isLoading: false,
  error: null,
  categorySelected: false,
  itemSelected: false,
  quantityEntered: false,
  substepCompleted: false,
  isValid: false,
  validationErrors: [],
  showAdvancedOptions: false,
  autoAdvanceToNext: true,
};

export const useItemBasicInfoStore = create<ItemBasicInfoUIState & ItemBasicInfoUIActions>()(
  subscribeWithSelector((set, get) => ({
    ...initialState,

    // Основні сеттери
    setSessionId: (sessionId) => set({ sessionId }),
    setItemId: (itemId) => set({ itemId }),
    setSelectedCategoryId: (categoryId) => {
      set({ selectedCategoryId: categoryId, categorySelected: !!categoryId });
      get().validateForm();
    },
    setSelectedItemId: (itemId) => {
      set({ selectedItemId: itemId, itemSelected: !!itemId });
      get().validateForm();
    },
    setEnteredQuantity: (quantity) => {
      set({ enteredQuantity: quantity, quantityEntered: !!quantity && quantity > 0 });
      get().validateForm();
    },
    setSelectedUnitOfMeasure: (unit) => set({ selectedUnitOfMeasure: unit }),

    // UI стани
    setLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error }),

    // Кроки завершення
    setCategorySelected: (selected) => set({ categorySelected: selected }),
    setItemSelected: (selected) => set({ itemSelected: selected }),
    setQuantityEntered: (entered) => set({ quantityEntered: entered }),
    setSubstepCompleted: (completed) => set({ substepCompleted: completed }),

    // Валідація
    setValid: (isValid) => set({ isValid }),
    setValidationErrors: (errors) => set({ validationErrors: errors }),

    // Налаштування
    setShowAdvancedOptions: (show) => set({ showAdvancedOptions: show }),
    setAutoAdvanceToNext: (auto) => set({ autoAdvanceToNext: auto }),

    // Складні дії
    resetForm: () => {
      set({
        selectedCategoryId: null,
        selectedItemId: null,
        enteredQuantity: null,
        selectedUnitOfMeasure: null,
        categorySelected: false,
        itemSelected: false,
        quantityEntered: false,
        substepCompleted: false,
        isValid: false,
        validationErrors: [],
        error: null,
      });
    },

    resetState: () => set(initialState),

    updateFormData: (data) => {
      const updates: Partial<ItemBasicInfoUIState> = {};

      if (data.categoryId !== undefined) {
        updates.selectedCategoryId = data.categoryId;
        updates.categorySelected = !!data.categoryId;
      }

      if (data.itemId !== undefined) {
        updates.selectedItemId = data.itemId;
        updates.itemSelected = !!data.itemId;
      }

      if (data.quantity !== undefined) {
        updates.enteredQuantity = data.quantity;
        updates.quantityEntered = !!data.quantity && data.quantity > 0;
      }

      if (data.unitOfMeasure !== undefined) {
        updates.selectedUnitOfMeasure = data.unitOfMeasure;
      }

      set(updates);
      get().validateForm();
    },

    // Валідація форми
    validateForm: () => {
      const state = get();
      const errors: string[] = [];

      if (!state.selectedCategoryId) {
        errors.push('Оберіть категорію послуги');
      }

      if (!state.selectedItemId) {
        errors.push('Оберіть предмет з прайс-листа');
      }

      if (!state.enteredQuantity || state.enteredQuantity <= 0) {
        errors.push('Введіть коректну кількість');
      }

      const isValid = errors.length === 0;

      set({
        isValid,
        validationErrors: errors,
        substepCompleted:
          isValid && state.categorySelected && state.itemSelected && state.quantityEntered,
      });

      return isValid;
    },

    getFormData: () => {
      const state = get();

      if (!state.isValid) {
        return null;
      }

      return {
        categoryId: state.selectedCategoryId!,
        itemId: state.selectedItemId!,
        quantity: state.enteredQuantity!,
        unitOfMeasure: state.selectedUnitOfMeasure || undefined,
        notes: undefined,
      };
    },
  }))
);
