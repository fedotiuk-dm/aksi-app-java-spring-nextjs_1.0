import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

import type {
  MaterialSelectionData,
  ColorSelectionData,
  FillerSelectionData,
  WearLevelSelectionData,
  ItemCharacteristicsFormData,
  MaterialFilterData,
} from './item-characteristics.schemas';

// UI стан для Item Characteristics
interface ItemCharacteristicsUIState {
  // Сесія та ідентифікатори
  sessionId: string | null;
  itemId: string | null;

  // Вибрані характеристики
  selectedMaterialId: string | null;
  selectedColor: string | null;
  isCustomColor: boolean;
  selectedFillerType: string | null;
  isFillerDamaged: boolean;
  hasNoFiller: boolean;
  selectedWearPercentage: number | null;

  // UI стани
  isLoading: boolean;
  error: string | null;

  // Кроки завершення
  materialSelected: boolean;
  colorSelected: boolean;
  fillerSelected: boolean;
  wearLevelSelected: boolean;
  substepCompleted: boolean;

  // Валідація
  isValid: boolean;
  validationErrors: string[];

  // Налаштування
  showAdvancedOptions: boolean;
  autoAdvanceToNext: boolean;
  showMaterialFilter: boolean;

  // Фільтри та пошук
  materialFilter: MaterialFilterData;
  colorSuggestions: string[];

  // Доступні опції
  availableMaterials: string[];
  availableColors: string[];
  availableFillers: string[];
}

// Дії для Item Characteristics
interface ItemCharacteristicsUIActions {
  // Основні сеттери
  setSessionId: (sessionId: string | null) => void;
  setItemId: (itemId: string | null) => void;
  setSelectedMaterialId: (materialId: string | null) => void;
  setSelectedColor: (color: string | null) => void;
  setIsCustomColor: (isCustom: boolean) => void;
  setSelectedFillerType: (fillerType: string | null) => void;
  setIsFillerDamaged: (isDamaged: boolean) => void;
  setHasNoFiller: (hasNo: boolean) => void;
  setSelectedWearPercentage: (percentage: number | null) => void;

  // UI стани
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;

  // Кроки завершення
  setMaterialSelected: (selected: boolean) => void;
  setColorSelected: (selected: boolean) => void;
  setFillerSelected: (selected: boolean) => void;
  setWearLevelSelected: (selected: boolean) => void;
  setSubstepCompleted: (completed: boolean) => void;

  // Валідація
  setValid: (isValid: boolean) => void;
  setValidationErrors: (errors: string[]) => void;

  // Налаштування
  setShowAdvancedOptions: (show: boolean) => void;
  setAutoAdvanceToNext: (auto: boolean) => void;
  setShowMaterialFilter: (show: boolean) => void;

  // Фільтри та пошук
  setMaterialFilter: (filter: MaterialFilterData) => void;
  setColorSuggestions: (suggestions: string[]) => void;

  // Доступні опції
  setAvailableMaterials: (materials: string[]) => void;
  setAvailableColors: (colors: string[]) => void;
  setAvailableFillers: (fillers: string[]) => void;

  // Складні дії
  resetForm: () => void;
  resetState: () => void;
  updateFormData: (data: Partial<ItemCharacteristicsFormData>) => void;

  // Валідація форми
  validateForm: () => boolean;
  getFormData: () => ItemCharacteristicsFormData | null;

  // Логіка наповнювача
  toggleFillerDamaged: () => void;
  toggleNoFiller: () => void;
}

// Початковий стан
const initialState: ItemCharacteristicsUIState = {
  sessionId: null,
  itemId: null,
  selectedMaterialId: null,
  selectedColor: null,
  isCustomColor: false,
  selectedFillerType: null,
  isFillerDamaged: false,
  hasNoFiller: false,
  selectedWearPercentage: null,
  isLoading: false,
  error: null,
  materialSelected: false,
  colorSelected: false,
  fillerSelected: false,
  wearLevelSelected: false,
  substepCompleted: false,
  isValid: false,
  validationErrors: [],
  showAdvancedOptions: false,
  autoAdvanceToNext: true,
  showMaterialFilter: false,
  materialFilter: {
    categoryId: undefined,
    searchTerm: undefined,
    showOnlyAvailable: true,
  },
  colorSuggestions: [],
  availableMaterials: [],
  availableColors: [],
  availableFillers: [],
};

export const useItemCharacteristicsStore = create<
  ItemCharacteristicsUIState & ItemCharacteristicsUIActions
>()(
  subscribeWithSelector((set, get) => ({
    ...initialState,

    // Основні сеттери
    setSessionId: (sessionId) => set({ sessionId }),
    setItemId: (itemId) => set({ itemId }),
    setSelectedMaterialId: (materialId) => {
      set({ selectedMaterialId: materialId, materialSelected: !!materialId });
      get().validateForm();
    },
    setSelectedColor: (color) => {
      set({ selectedColor: color, colorSelected: !!color });
      get().validateForm();
    },
    setIsCustomColor: (isCustom) => set({ isCustomColor: isCustom }),
    setSelectedFillerType: (fillerType) => {
      set({ selectedFillerType: fillerType, fillerSelected: !!fillerType });
      get().validateForm();
    },
    setIsFillerDamaged: (isDamaged) => set({ isFillerDamaged: isDamaged }),
    setHasNoFiller: (hasNo) => {
      set({ hasNoFiller: hasNo });
      if (hasNo) {
        set({ selectedFillerType: null, isFillerDamaged: false, fillerSelected: true });
      }
      get().validateForm();
    },
    setSelectedWearPercentage: (percentage) => {
      set({ selectedWearPercentage: percentage, wearLevelSelected: percentage !== null });
      get().validateForm();
    },

    // UI стани
    setLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error }),

    // Кроки завершення
    setMaterialSelected: (selected) => set({ materialSelected: selected }),
    setColorSelected: (selected) => set({ colorSelected: selected }),
    setFillerSelected: (selected) => set({ fillerSelected: selected }),
    setWearLevelSelected: (selected) => set({ wearLevelSelected: selected }),
    setSubstepCompleted: (completed) => set({ substepCompleted: completed }),

    // Валідація
    setValid: (isValid) => set({ isValid }),
    setValidationErrors: (errors) => set({ validationErrors: errors }),

    // Налаштування
    setShowAdvancedOptions: (show) => set({ showAdvancedOptions: show }),
    setAutoAdvanceToNext: (auto) => set({ autoAdvanceToNext: auto }),
    setShowMaterialFilter: (show) => set({ showMaterialFilter: show }),

    // Фільтри та пошук
    setMaterialFilter: (filter) => set({ materialFilter: filter }),
    setColorSuggestions: (suggestions) => set({ colorSuggestions: suggestions }),

    // Доступні опції
    setAvailableMaterials: (materials) => set({ availableMaterials: materials }),
    setAvailableColors: (colors) => set({ availableColors: colors }),
    setAvailableFillers: (fillers) => set({ availableFillers: fillers }),

    // Складні дії
    resetForm: () => {
      set({
        selectedMaterialId: null,
        selectedColor: null,
        isCustomColor: false,
        selectedFillerType: null,
        isFillerDamaged: false,
        hasNoFiller: false,
        selectedWearPercentage: null,
        materialSelected: false,
        colorSelected: false,
        fillerSelected: false,
        wearLevelSelected: false,
        substepCompleted: false,
        isValid: false,
        validationErrors: [],
        error: null,
      });
    },

    resetState: () => set(initialState),

    updateFormData: (data) => {
      const updates: Partial<ItemCharacteristicsUIState> = {};

      if (data.materialId !== undefined) {
        updates.selectedMaterialId = data.materialId;
        updates.materialSelected = !!data.materialId;
      }

      if (data.color !== undefined) {
        updates.selectedColor = data.color;
        updates.colorSelected = !!data.color;
      }

      if (data.isCustomColor !== undefined) {
        updates.isCustomColor = data.isCustomColor;
      }

      if (data.fillerType !== undefined) {
        updates.selectedFillerType = data.fillerType;
        updates.fillerSelected = !!data.fillerType;
      }

      if (data.isFillerDamaged !== undefined) {
        updates.isFillerDamaged = data.isFillerDamaged;
      }

      if (data.hasNoFiller !== undefined) {
        updates.hasNoFiller = data.hasNoFiller;
        if (data.hasNoFiller) {
          updates.selectedFillerType = null;
          updates.isFillerDamaged = false;
          updates.fillerSelected = true;
        }
      }

      if (data.wearPercentage !== undefined) {
        updates.selectedWearPercentage = data.wearPercentage;
        updates.wearLevelSelected = true;
      }

      set(updates);
      get().validateForm();
    },

    // Валідація форми
    validateForm: () => {
      const state = get();
      const errors: string[] = [];

      if (!state.selectedMaterialId) {
        errors.push('Оберіть матеріал');
      }

      if (!state.selectedColor) {
        errors.push('Введіть або оберіть колір');
      }

      if (!state.hasNoFiller && !state.selectedFillerType) {
        errors.push('Оберіть тип наповнювача або вкажіть що його немає');
      }

      if (
        state.selectedWearPercentage === null ||
        state.selectedWearPercentage < 0 ||
        state.selectedWearPercentage > 100
      ) {
        errors.push('Введіть коректний ступінь зносу (0-100%)');
      }

      const isValid = errors.length === 0;

      set({
        isValid,
        validationErrors: errors,
        substepCompleted:
          isValid &&
          state.materialSelected &&
          state.colorSelected &&
          state.fillerSelected &&
          state.wearLevelSelected,
      });

      return isValid;
    },

    getFormData: () => {
      const state = get();

      if (!state.isValid) {
        return null;
      }

      return {
        materialId: state.selectedMaterialId!,
        color: state.selectedColor!,
        isCustomColor: state.isCustomColor,
        fillerType: state.hasNoFiller ? undefined : state.selectedFillerType || undefined,
        isFillerDamaged: state.isFillerDamaged,
        hasNoFiller: state.hasNoFiller,
        wearPercentage: state.selectedWearPercentage!,
        notes: undefined,
      };
    },

    // Логіка наповнювача
    toggleFillerDamaged: () => {
      const state = get();
      set({ isFillerDamaged: !state.isFillerDamaged });
    },

    toggleNoFiller: () => {
      const state = get();
      const newHasNoFiller = !state.hasNoFiller;

      set({
        hasNoFiller: newHasNoFiller,
        selectedFillerType: newHasNoFiller ? null : state.selectedFillerType,
        isFillerDamaged: newHasNoFiller ? false : state.isFillerDamaged,
        fillerSelected: newHasNoFiller ? true : !!state.selectedFillerType,
      });

      get().validateForm();
    },
  }))
);
