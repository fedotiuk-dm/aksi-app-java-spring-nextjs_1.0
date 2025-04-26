import { StateCreator } from 'zustand';
import {
  OrderWizardState,
  WizardStep,
  NavigationHistoryItem,
} from '../types/types';

// Максимальна кількість кроків у історії
const MAX_HISTORY_LENGTH = 20;

export const createNavigationSlice: StateCreator<
  OrderWizardState,
  [['zustand/immer', never]],
  [],
  Pick<
    OrderWizardState,
    | 'setCurrentStep'
    | 'setCurrentSubStep'
    | 'navigateToStep'
    | 'navigateBack'
    | 'resetNavigationHistory'
  >
> = (set, get) => ({
  setCurrentStep: (step: WizardStep) => {
    set((state) => {
      // Просто змінюємо поточний крок
      state.currentStep = step;
      state.currentSubStep = undefined; // Скидаємо підкрок при зміні кроку
    });
  },

  setCurrentSubStep: (subStep: string | undefined) => {
    set((state) => {
      state.currentSubStep = subStep;
    });
  },

  navigateToStep: (step: WizardStep, subStep?: string) => {
    set((state) => {
      // Зберігаємо поточний крок в історію
      const currentHistoryItem: NavigationHistoryItem = {
        step: state.currentStep,
        subStep: state.currentSubStep,
      };

      // Обмежуємо розмір історії
      const newHistory = [...state.navigationHistory, currentHistoryItem].slice(
        -MAX_HISTORY_LENGTH
      );

      // Оновлюємо стан
      state.navigationHistory = newHistory;
      state.currentStep = step;
      state.currentSubStep = subStep;
    });
  },

  navigateBack: () => {
    const { navigationHistory } = get();

    if (navigationHistory.length === 0) {
      return; // Немає історії для повернення
    }

    set((state) => {
      // Отримуємо останній крок з історії
      const lastStep =
        state.navigationHistory[state.navigationHistory.length - 1];

      // Оновлюємо поточний крок
      state.currentStep = lastStep.step;
      state.currentSubStep = lastStep.subStep;

      // Видаляємо крок з історії
      state.navigationHistory = state.navigationHistory.slice(0, -1);
    });
  },

  resetNavigationHistory: () => {
    set((state) => {
      state.navigationHistory = [];
    });
  },
});
