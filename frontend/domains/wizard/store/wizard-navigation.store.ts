/**
 * @fileoverview Zustand сторе для управління навігацією в Order Wizard
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WizardNavigationState {
  currentStage: number;
  completedStages: Set<number>;
  sessionId: string | null;
}

export interface WizardNavigationActions {
  setCurrentStage: (stage: number) => void;
  markStageCompleted: (stage: number) => void;
  setSessionId: (sessionId: string | null) => void;
  resetNavigation: () => void;
  canNavigateToStage: (stage: number) => boolean;
}

export type WizardNavigationStore = WizardNavigationState & WizardNavigationActions;

const initialState: WizardNavigationState = {
  currentStage: 1,
  completedStages: new Set(),
  sessionId: null,
};

export const useWizardNavigationStore = create<WizardNavigationStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setCurrentStage: (stage: number) => {
        set({ currentStage: stage });
      },

      markStageCompleted: (stage: number) => {
        set((state) => ({
          completedStages: new Set([...state.completedStages, stage]),
        }));
      },

      setSessionId: (sessionId: string | null) => {
        set({ sessionId });
      },

      resetNavigation: () => {
        set(initialState);
      },

      canNavigateToStage: (stage: number) => {
        const { currentStage, completedStages } = get();
        return stage <= currentStage || completedStages.has(stage);
      },
    }),
    {
      name: 'wizard-navigation',
      partialize: (state) => ({
        ...state,
        completedStages: Array.from(state.completedStages),
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.completedStages = new Set(state.completedStages as unknown as number[]);
        }
      },
    }
  )
);
