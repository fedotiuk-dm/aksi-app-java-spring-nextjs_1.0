// 📋 ПІДЕТАП 2.2: Zustand стор для характеристик предмета
// Тільки UI стан, API дані керуються React Query

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

// =================== ТИПИ СТАНУ ===================
interface ItemCharacteristicsUIState {
  // Сесія
  sessionId: string | null;

  // UI налаштування
  showMaterialDetails: boolean;
  showColorPicker: boolean;
  showFillerOptions: boolean;
  showWearLevelDetails: boolean;

  // Форми стан
  selectedMaterialId: string | null;
  customMaterial: string;
  selectedColorId: string | null;
  customColor: string;
  selectedFillerId: string | null;
  customFiller: string;
  isFillerDamaged: boolean;
  selectedWearLevelId: string | null;
  wearPercentage: number;

  // UI прапорці
  isMaterialExpanded: boolean;
  isColorExpanded: boolean;
  isFillerExpanded: boolean;
  isWearLevelExpanded: boolean;

  // Workflow стан
  currentStep: 'material' | 'color' | 'filler' | 'wearLevel' | 'completed';
  stepsCompleted: string[];
}

interface ItemCharacteristicsUIActions {
  // Сесія
  setSessionId: (sessionId: string | null) => void;

  // UI налаштування
  setShowMaterialDetails: (show: boolean) => void;
  setShowColorPicker: (show: boolean) => void;
  setShowFillerOptions: (show: boolean) => void;
  setShowWearLevelDetails: (show: boolean) => void;

  // Форми - Матеріал
  setSelectedMaterialId: (materialId: string | null) => void;
  setCustomMaterial: (material: string) => void;

  // Форми - Колір
  setSelectedColorId: (colorId: string | null) => void;
  setCustomColor: (color: string) => void;

  // Форми - Наповнювач
  setSelectedFillerId: (fillerId: string | null) => void;
  setCustomFiller: (filler: string) => void;
  setIsFillerDamaged: (damaged: boolean) => void;

  // Форми - Ступінь зносу
  setSelectedWearLevelId: (wearLevelId: string | null) => void;
  setWearPercentage: (percentage: number) => void;

  // UI прапорці
  toggleMaterialExpanded: () => void;
  toggleColorExpanded: () => void;
  toggleFillerExpanded: () => void;
  toggleWearLevelExpanded: () => void;

  // Workflow
  setCurrentStep: (step: 'material' | 'color' | 'filler' | 'wearLevel' | 'completed') => void;
  markStepCompleted: (step: string) => void;

  // Скидання
  resetUIState: () => void;
  resetForms: () => void;
}

// =================== ПОЧАТКОВИЙ СТАН ===================
const initialState: ItemCharacteristicsUIState = {
  // Сесія
  sessionId: null,

  // UI налаштування
  showMaterialDetails: true,
  showColorPicker: false,
  showFillerOptions: false,
  showWearLevelDetails: true,

  // Форми стан
  selectedMaterialId: null,
  customMaterial: '',
  selectedColorId: null,
  customColor: '',
  selectedFillerId: null,
  customFiller: '',
  isFillerDamaged: false,
  selectedWearLevelId: null,
  wearPercentage: 10,

  // UI прапорці
  isMaterialExpanded: true,
  isColorExpanded: false,
  isFillerExpanded: false,
  isWearLevelExpanded: false,

  // Workflow стан
  currentStep: 'material',
  stepsCompleted: [],
};

// =================== ZUSTAND СТОР ===================
export const useItemCharacteristicsStore = create<
  ItemCharacteristicsUIState & ItemCharacteristicsUIActions
>()(
  subscribeWithSelector((set) => ({
    ...initialState,

    // =================== СЕСІЯ ===================
    setSessionId: (sessionId) => set({ sessionId }),

    // =================== UI НАЛАШТУВАННЯ ===================
    setShowMaterialDetails: (showMaterialDetails) => set({ showMaterialDetails }),
    setShowColorPicker: (showColorPicker) => set({ showColorPicker }),
    setShowFillerOptions: (showFillerOptions) => set({ showFillerOptions }),
    setShowWearLevelDetails: (showWearLevelDetails) => set({ showWearLevelDetails }),

    // =================== ФОРМИ - МАТЕРІАЛ ===================
    setSelectedMaterialId: (selectedMaterialId) => set({ selectedMaterialId }),
    setCustomMaterial: (customMaterial) => set({ customMaterial }),

    // =================== ФОРМИ - КОЛІР ===================
    setSelectedColorId: (selectedColorId) => set({ selectedColorId }),
    setCustomColor: (customColor) => set({ customColor }),

    // =================== ФОРМИ - НАПОВНЮВАЧ ===================
    setSelectedFillerId: (selectedFillerId) => set({ selectedFillerId }),
    setCustomFiller: (customFiller) => set({ customFiller }),
    setIsFillerDamaged: (isFillerDamaged) => set({ isFillerDamaged }),

    // =================== ФОРМИ - СТУПІНЬ ЗНОСУ ===================
    setSelectedWearLevelId: (selectedWearLevelId) => set({ selectedWearLevelId }),
    setWearPercentage: (wearPercentage) => set({ wearPercentage }),

    // =================== UI ПРАПОРЦІ ===================
    toggleMaterialExpanded: () =>
      set((state) => ({
        isMaterialExpanded: !state.isMaterialExpanded,
      })),

    toggleColorExpanded: () =>
      set((state) => ({
        isColorExpanded: !state.isColorExpanded,
      })),

    toggleFillerExpanded: () =>
      set((state) => ({
        isFillerExpanded: !state.isFillerExpanded,
      })),

    toggleWearLevelExpanded: () =>
      set((state) => ({
        isWearLevelExpanded: !state.isWearLevelExpanded,
      })),

    // =================== WORKFLOW ===================
    setCurrentStep: (currentStep) => set({ currentStep }),

    markStepCompleted: (step) =>
      set((state) => ({
        stepsCompleted: state.stepsCompleted.includes(step)
          ? state.stepsCompleted
          : [...state.stepsCompleted, step],
      })),

    // =================== СКИДАННЯ ===================
    resetUIState: () => set(initialState),

    resetForms: () =>
      set({
        selectedMaterialId: null,
        customMaterial: '',
        selectedColorId: null,
        customColor: '',
        selectedFillerId: null,
        customFiller: '',
        isFillerDamaged: false,
        selectedWearLevelId: null,
        wearPercentage: 10,
      }),
  }))
);

// =================== СЕЛЕКТОРИ ===================
export const useItemCharacteristicsSelectors = () => {
  const store = useItemCharacteristicsStore();

  return {
    // Базові селектори
    hasSession: !!store.sessionId,
    hasMaterialSelected: !!store.selectedMaterialId || !!store.customMaterial.trim(),
    hasColorSelected: !!store.selectedColorId || !!store.customColor.trim(),
    hasFillerSelected: !!store.selectedFillerId || !!store.customFiller.trim(),
    hasWearLevelSelected: !!store.selectedWearLevelId,

    // Обчислені значення
    completedStepsCount: store.stepsCompleted.length,
    totalSteps: 4, // material, color, filler, wearLevel

    // UI стан
    isAnyExpanded:
      store.isMaterialExpanded ||
      store.isColorExpanded ||
      store.isFillerExpanded ||
      store.isWearLevelExpanded,

    // Workflow
    isStepCompleted: (step: string) => store.stepsCompleted.includes(step),
    canProceedToNext:
      store.selectedMaterialId && store.customColor.trim() && store.selectedWearLevelId,

    // Прогрес
    progressPercentage: Math.round((store.stepsCompleted.length / 4) * 100),
  };
};
