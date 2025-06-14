// 📋 ПІДЕТАП 2.3: Zustand стор для забруднень та дефектів
// Тільки UI стан, API дані керуються React Query

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

import {
  SUBSTEP3_UI_STEPS,
  SUBSTEP3_VALIDATION_RULES,
  SUBSTEP3_LIMITS,
  calculateSubstep3Progress,
  getNextSubstep3Step,
  getPreviousSubstep3Step,
  type Substep3UIStep,
} from './constants';

// =================== ТИПИ СТАНУ ===================
interface StainsDefectsUIState {
  // Сесія
  sessionId: string | null;

  // UI налаштування
  showStainDetails: boolean;
  showDefectDetails: boolean;
  showAdvancedOptions: boolean;

  // Форми стан
  selectedStains: string[];
  selectedDefects: string[];
  otherStains: string;
  defectNotes: string;
  noGuaranteeReason: string;
  specialInstructions: string;

  // UI прапорці
  isStainSelectionExpanded: boolean;
  isDefectSelectionExpanded: boolean;
  isNotesExpanded: boolean;

  // Workflow стан
  currentStep: Substep3UIStep;
  stepsCompleted: string[];
}

interface StainsDefectsUIActions {
  // Сесія
  setSessionId: (sessionId: string | null) => void;

  // UI налаштування
  setShowStainDetails: (show: boolean) => void;
  setShowDefectDetails: (show: boolean) => void;
  setShowAdvancedOptions: (show: boolean) => void;

  // Форми
  setSelectedStains: (stains: string[]) => void;
  addSelectedStain: (stainId: string) => void;
  removeSelectedStain: (stainId: string) => void;

  setSelectedDefects: (defects: string[]) => void;
  addSelectedDefect: (defectId: string) => void;
  removeSelectedDefect: (defectId: string) => void;

  setOtherStains: (stains: string) => void;
  setDefectNotes: (notes: string) => void;
  setNoGuaranteeReason: (reason: string) => void;
  setSpecialInstructions: (instructions: string) => void;

  // UI прапорці
  toggleStainSelectionExpanded: () => void;
  toggleDefectSelectionExpanded: () => void;
  toggleNotesExpanded: () => void;

  // Workflow
  setCurrentStep: (step: Substep3UIStep) => void;
  markStepCompleted: (step: string) => void;

  // Скидання
  resetUIState: () => void;
  resetForms: () => void;
}

// =================== ПОЧАТКОВИЙ СТАН ===================
const initialState: StainsDefectsUIState = {
  // Сесія
  sessionId: null,

  // UI налаштування
  showStainDetails: true,
  showDefectDetails: true,
  showAdvancedOptions: false,

  // Форми стан
  selectedStains: [],
  selectedDefects: [],
  otherStains: '',
  defectNotes: '',
  noGuaranteeReason: '',
  specialInstructions: '',

  // UI прапорці
  isStainSelectionExpanded: true,
  isDefectSelectionExpanded: false,
  isNotesExpanded: false,

  // Workflow стан
  currentStep: SUBSTEP3_UI_STEPS.STAIN_SELECTION,
  stepsCompleted: [],
};

// =================== ZUSTAND СТОР ===================
export const useStainsDefectsStore = create<StainsDefectsUIState & StainsDefectsUIActions>()(
  subscribeWithSelector((set) => ({
    ...initialState,

    // =================== СЕСІЯ ===================
    setSessionId: (sessionId) => set({ sessionId }),

    // =================== UI НАЛАШТУВАННЯ ===================
    setShowStainDetails: (showStainDetails) => set({ showStainDetails }),
    setShowDefectDetails: (showDefectDetails) => set({ showDefectDetails }),
    setShowAdvancedOptions: (showAdvancedOptions) => set({ showAdvancedOptions }),

    // =================== ФОРМИ ===================
    setSelectedStains: (selectedStains) => set({ selectedStains }),

    addSelectedStain: (stainId) =>
      set((state) => ({
        selectedStains: state.selectedStains.includes(stainId)
          ? state.selectedStains
          : [...state.selectedStains, stainId],
      })),

    removeSelectedStain: (stainId) =>
      set((state) => ({
        selectedStains: state.selectedStains.filter((id) => id !== stainId),
      })),

    setSelectedDefects: (selectedDefects) => set({ selectedDefects }),

    addSelectedDefect: (defectId) =>
      set((state) => ({
        selectedDefects: state.selectedDefects.includes(defectId)
          ? state.selectedDefects
          : [...state.selectedDefects, defectId],
      })),

    removeSelectedDefect: (defectId) =>
      set((state) => ({
        selectedDefects: state.selectedDefects.filter((id) => id !== defectId),
      })),

    setOtherStains: (otherStains) => set({ otherStains }),
    setDefectNotes: (defectNotes) => set({ defectNotes }),
    setNoGuaranteeReason: (noGuaranteeReason) => set({ noGuaranteeReason }),
    setSpecialInstructions: (specialInstructions) => set({ specialInstructions }),

    // =================== UI ПРАПОРЦІ ===================
    toggleStainSelectionExpanded: () =>
      set((state) => ({
        isStainSelectionExpanded: !state.isStainSelectionExpanded,
      })),

    toggleDefectSelectionExpanded: () =>
      set((state) => ({
        isDefectSelectionExpanded: !state.isDefectSelectionExpanded,
      })),

    toggleNotesExpanded: () =>
      set((state) => ({
        isNotesExpanded: !state.isNotesExpanded,
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
        selectedStains: [],
        selectedDefects: [],
        otherStains: '',
        defectNotes: '',
        noGuaranteeReason: '',
        specialInstructions: '',
      }),
  }))
);

// =================== СЕЛЕКТОРИ З КОНСТАНТАМИ ===================
export const useStainsDefectsSelectors = () => {
  const store = useStainsDefectsStore();

  return {
    // Базові селектори
    hasSession: !!store.sessionId,
    hasSelectedStains: store.selectedStains.length > 0,
    hasSelectedDefects: store.selectedDefects.length > 0,
    hasOtherStains: !!store.otherStains.trim(),
    hasDefectNotes: !!store.defectNotes.trim(),

    // Обчислені значення з константами
    stainsCount: store.selectedStains.length,
    defectsCount: store.selectedDefects.length,
    completedStepsCount: store.stepsCompleted.length,
    progressPercentage: calculateSubstep3Progress(store.currentStep),

    // Валідація з константами
    canProceedFromStainSelection: SUBSTEP3_VALIDATION_RULES.canProceedFromStainSelection(
      store.selectedStains
    ),
    canProceedFromDefectSelection: SUBSTEP3_VALIDATION_RULES.canProceedFromDefectSelection(
      store.selectedDefects,
      store.noGuaranteeReason
    ),
    canProceedFromDefectNotes: SUBSTEP3_VALIDATION_RULES.canProceedFromDefectNotes(
      store.defectNotes
    ),
    canCompleteSubstep: SUBSTEP3_VALIDATION_RULES.canCompleteSubstep(
      store.selectedStains,
      store.selectedDefects,
      store.defectNotes
    ),

    // Навігація з константами
    nextStep: getNextSubstep3Step(store.currentStep),
    previousStep: getPreviousSubstep3Step(store.currentStep),

    // Ліміти з константами
    isStainSelectionAtLimit: store.selectedStains.length >= SUBSTEP3_LIMITS.MAX_STAIN_SELECTION,
    isDefectSelectionAtLimit: store.selectedDefects.length >= SUBSTEP3_LIMITS.MAX_DEFECT_SELECTION,
    defectNotesCharacterCount: store.defectNotes.length,
    defectNotesCharacterLimit: SUBSTEP3_LIMITS.MAX_DEFECT_NOTES_LENGTH,

    // UI стан
    isExpanded:
      store.isStainSelectionExpanded || store.isDefectSelectionExpanded || store.isNotesExpanded,
    showAdvanced: store.showAdvancedOptions,

    // Workflow
    isStepCompleted: (step: string) => store.stepsCompleted.includes(step),
    currentStepIndex: Object.values(SUBSTEP3_UI_STEPS).indexOf(store.currentStep),
  };
};
