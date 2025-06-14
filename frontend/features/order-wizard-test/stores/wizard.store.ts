import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

// Тільки UI стан - sessionId, етапи, підетапи
interface WizardUIState {
  // Основний стан
  sessionId: string | null;
  currentStage: 'stage1' | 'stage2' | 'stage3' | 'stage4' | null;
  currentSubstep: string | null;

  // Stage1 специфічний стан
  activeStep: number;

  // UI флаги
  isLoading: boolean;
  isInitialized: boolean;

  // Stage1 прогрес
  clientSelected: boolean;
  clientFormCompleted: boolean;
  basicOrderCompleted: boolean;
}

interface WizardUIActions {
  // Основні дії
  setSessionId: (sessionId: string | null) => void;
  setCurrentStage: (stage: WizardUIState['currentStage']) => void;
  setCurrentSubstep: (substep: string | null) => void;

  // Stage1 навігація
  setActiveStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;

  // UI дії
  setLoading: (loading: boolean) => void;
  setInitialized: (initialized: boolean) => void;

  // Stage1 прогрес
  setClientSelected: (selected: boolean) => void;
  setClientFormCompleted: (completed: boolean) => void;
  setBasicOrderCompleted: (completed: boolean) => void;

  // Утиліти
  reset: () => void;
  resetStage1: () => void;
}

type WizardStore = WizardUIState & WizardUIActions;

const initialState: WizardUIState = {
  sessionId: null,
  currentStage: null,
  currentSubstep: null,
  activeStep: 0,
  isLoading: false,
  isInitialized: false,
  clientSelected: false,
  clientFormCompleted: false,
  basicOrderCompleted: false,
};

export const useWizardStore = create<WizardStore>()(
  subscribeWithSelector((set, get) => ({
    ...initialState,

    // Основні дії
    setSessionId: (sessionId) => set({ sessionId }),
    setCurrentStage: (currentStage) => set({ currentStage }),
    setCurrentSubstep: (currentSubstep) => set({ currentSubstep }),

    // Stage1 навігація
    setActiveStep: (activeStep) => set({ activeStep }),
    nextStep: () => set((state) => ({ activeStep: state.activeStep + 1 })),
    prevStep: () => set((state) => ({ activeStep: Math.max(0, state.activeStep - 1) })),

    // UI дії
    setLoading: (isLoading) => set({ isLoading }),
    setInitialized: (isInitialized) => set({ isInitialized }),

    // Stage1 прогрес
    setClientSelected: (clientSelected) => set({ clientSelected }),
    setClientFormCompleted: (clientFormCompleted) => set({ clientFormCompleted }),
    setBasicOrderCompleted: (basicOrderCompleted) => set({ basicOrderCompleted }),

    // Утиліти
    reset: () => set(initialState),
    resetStage1: () =>
      set({
        activeStep: 0,
        clientSelected: false,
        clientFormCompleted: false,
        basicOrderCompleted: false,
      }),
  }))
);
