// 📋 ПІДЕТАП 2.2: Zustand стор для характеристик предмета
// Тільки UI стан, API дані керуються React Query

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

// Локальні імпорти
import {
  SUBSTEP2_UI_STEPS,
  SUBSTEP2_STEP_ORDER,
  SUBSTEP2_VALIDATION_RULES,
  SUBSTEP2_LIMITS,
  calculateSubstep2Progress,
  getNextSubstep2Step,
  getPreviousSubstep2Step,
  isFirstSubstep2Step,
  isLastSubstep2Step,
  type Substep2UIStep,
} from './constants';

// =================== ТИПИ СТАНУ ===================
interface ItemCharacteristicsUIState {
  // Сесія
  sessionId: string | null;

  // UI стан workflow (БЕЗ API даних)
  currentStep: Substep2UIStep;

  // Вибори користувача (тільки IDs)
  selectedMaterialId: string | null;
  selectedColorId: string | null;
  selectedFillerId: string | null;
  selectedWearLevelId: string | null;

  // UI налаштування
  showMaterialDetails: boolean;
  showColorDetails: boolean;
  showFillerDetails: boolean;
  showWearLevelDetails: boolean;

  // Пошук
  materialSearchTerm: string;
  colorSearchTerm: string;
  fillerSearchTerm: string;

  // UI прапорці
  isWorkflowStarted: boolean;
  canProceedToNext: boolean;
  hasUnsavedChanges: boolean;
}

interface ItemCharacteristicsUIActions {
  // Ініціалізація
  initializeWorkflow: (sessionId: string) => void;
  resetWorkflow: () => void;

  // Кроки workflow
  setCurrentStep: (step: Substep2UIStep) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;

  // Вибори
  setSelectedMaterial: (materialId: string | null) => void;
  setSelectedColor: (colorId: string | null) => void;
  setSelectedFiller: (fillerId: string | null) => void;
  setSelectedWearLevel: (wearLevelId: string | null) => void;

  // UI налаштування
  setShowMaterialDetails: (show: boolean) => void;
  setShowColorDetails: (show: boolean) => void;
  setShowFillerDetails: (show: boolean) => void;
  setShowWearLevelDetails: (show: boolean) => void;

  // Пошук
  setMaterialSearchTerm: (term: string) => void;
  setColorSearchTerm: (term: string) => void;
  setFillerSearchTerm: (term: string) => void;

  // UI стан
  setCanProceedToNext: (canProceed: boolean) => void;
  markHasUnsavedChanges: () => void;
  markChangesSaved: () => void;
}

type ItemCharacteristicsStore = ItemCharacteristicsUIState & ItemCharacteristicsUIActions;

// =================== ПОЧАТКОВИЙ СТАН ===================
const initialState: ItemCharacteristicsUIState = {
  sessionId: null,
  currentStep: SUBSTEP2_UI_STEPS.MATERIAL_SELECTION,
  selectedMaterialId: null,
  selectedColorId: null,
  selectedFillerId: null,
  selectedWearLevelId: null,
  showMaterialDetails: false,
  showColorDetails: false,
  showFillerDetails: false,
  showWearLevelDetails: false,
  materialSearchTerm: '',
  colorSearchTerm: '',
  fillerSearchTerm: '',
  isWorkflowStarted: false,
  canProceedToNext: false,
  hasUnsavedChanges: false,
};

// =================== СТОР ===================
export const useItemCharacteristicsStore = create<ItemCharacteristicsStore>()(
  subscribeWithSelector((set, get) => ({
    ...initialState,

    // Ініціалізація
    initializeWorkflow: (sessionId: string) => {
      set({
        sessionId,
        isWorkflowStarted: true,
        currentStep: SUBSTEP2_UI_STEPS.MATERIAL_SELECTION,
        hasUnsavedChanges: false,
      });
    },

    resetWorkflow: () => {
      set(initialState);
    },

    // Кроки workflow
    setCurrentStep: (step) => {
      set({ currentStep: step });
    },

    goToNextStep: () => {
      const { currentStep } = get();
      const nextStep = getNextSubstep2Step(currentStep);
      if (nextStep) {
        set({ currentStep: nextStep });
      }
    },

    goToPreviousStep: () => {
      const { currentStep } = get();
      const previousStep = getPreviousSubstep2Step(currentStep);
      if (previousStep) {
        set({ currentStep: previousStep });
      }
    },

    // Вибори
    setSelectedMaterial: (materialId) => {
      set({
        selectedMaterialId: materialId,
        selectedColorId: null, // Reset наступних вибоків
        selectedFillerId: null,
        selectedWearLevelId: null,
        hasUnsavedChanges: true,
      });
    },

    setSelectedColor: (colorId) => {
      set({
        selectedColorId: colorId,
        selectedFillerId: null, // Reset наступних вибоків
        selectedWearLevelId: null,
        hasUnsavedChanges: true,
      });
    },

    setSelectedFiller: (fillerId) => {
      set({
        selectedFillerId: fillerId,
        selectedWearLevelId: null, // Reset наступних вибоків
        hasUnsavedChanges: true,
      });
    },

    setSelectedWearLevel: (wearLevelId) => {
      set({
        selectedWearLevelId: wearLevelId,
        hasUnsavedChanges: true,
      });
    },

    // UI налаштування
    setShowMaterialDetails: (show) => set({ showMaterialDetails: show }),
    setShowColorDetails: (show) => set({ showColorDetails: show }),
    setShowFillerDetails: (show) => set({ showFillerDetails: show }),
    setShowWearLevelDetails: (show) => set({ showWearLevelDetails: show }),

    // Пошук
    setMaterialSearchTerm: (term) => set({ materialSearchTerm: term }),
    setColorSearchTerm: (term) => set({ colorSearchTerm: term }),
    setFillerSearchTerm: (term) => set({ fillerSearchTerm: term }),

    // UI стан
    setCanProceedToNext: (canProceed) => set({ canProceedToNext: canProceed }),
    markHasUnsavedChanges: () => set({ hasUnsavedChanges: true }),
    markChangesSaved: () => set({ hasUnsavedChanges: false }),
  }))
);

// =================== СЕЛЕКТОРИ З КОНСТАНТАМИ ===================
export const useItemCharacteristicsSelectors = () => {
  const store = useItemCharacteristicsStore();

  return {
    // Основні селектори
    isInitialized: store.sessionId !== null,
    isCompleted: store.currentStep === SUBSTEP2_UI_STEPS.COMPLETED,
    isFirstStep: isFirstSubstep2Step(store.currentStep),
    isLastStep: isLastSubstep2Step(store.currentStep),
    progressPercentage: calculateSubstep2Progress(store.currentStep),

    // Валідація переходів з константами
    canGoToColorSelection: SUBSTEP2_VALIDATION_RULES.canGoToColorSelection(
      store.selectedMaterialId
    ),
    canGoToFillerSelection: SUBSTEP2_VALIDATION_RULES.canGoToFillerSelection(
      store.selectedMaterialId,
      store.selectedColorId
    ),
    canGoToWearLevelSelection: SUBSTEP2_VALIDATION_RULES.canGoToWearLevelSelection(
      store.selectedMaterialId,
      store.selectedColorId,
      store.selectedFillerId
    ),
    canValidate: SUBSTEP2_VALIDATION_RULES.canValidate(
      store.selectedMaterialId,
      store.selectedColorId,
      store.selectedFillerId,
      store.selectedWearLevelId
    ),
    canComplete: SUBSTEP2_VALIDATION_RULES.canComplete(
      store.selectedMaterialId,
      store.selectedColorId,
      store.selectedFillerId,
      store.selectedWearLevelId
    ),

    // Навігація з константами
    nextStep: getNextSubstep2Step(store.currentStep),
    previousStep: getPreviousSubstep2Step(store.currentStep),
    canGoNext: getNextSubstep2Step(store.currentStep) !== null,
    canGoBack: getPreviousSubstep2Step(store.currentStep) !== null,

    // Пошук валідація
    isMaterialSearchValid: store.materialSearchTerm.length >= SUBSTEP2_LIMITS.MIN_SEARCH_LENGTH,
    isColorSearchValid: store.colorSearchTerm.length >= SUBSTEP2_LIMITS.MIN_SEARCH_LENGTH,
    isFillerSearchValid: store.fillerSearchTerm.length >= SUBSTEP2_LIMITS.MIN_SEARCH_LENGTH,

    // Стан workflow
    ...store,
  };
};
