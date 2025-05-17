import { StateCreator } from 'zustand';
import {
  OrderWizardState,
  WizardStep,
  NavigationHistoryItem,
} from '../types/types';

// Максимальна кількість кроків у історії
const MAX_HISTORY_LENGTH = 20;

// Допоміжна функція для виводу інформації про поточний стан навігації
const logNavigationState = (state: OrderWizardState, action: string) => {
  console.group(`OrderWizard Navigation - ${action}`);
  console.log('Current Step:', state.currentStep);
  console.log('Current SubStep:', state.currentSubStep);
  console.log('Navigation History:', [...state.navigationHistory]);
  console.groupEnd();
};

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
    console.log(`OrderWizard - setCurrentStep: ${step}`);

    set((state) => {
      // Просто змінюємо поточний крок
      state.currentStep = step;
      state.currentSubStep = undefined; // Скидаємо підкрок при зміні кроку

      // Логуємо зміну після оновлення стану
      setTimeout(() => {
        logNavigationState(get(), 'After setCurrentStep');
      }, 0);
    });
  },

  setCurrentSubStep: (subStep: string | undefined) => {
    console.log(`OrderWizard - setCurrentSubStep: ${subStep}`);

    set((state) => {
      state.currentSubStep = subStep;

      // Логуємо зміну після оновлення стану
      setTimeout(() => {
        logNavigationState(get(), 'After setCurrentSubStep');
      }, 0);
    });
  },

  navigateToStep: (step: WizardStep, subStep?: string) => {
    console.log(
      `OrderWizard - navigateToStep: ${step}${
        subStep ? ` (SubStep: ${subStep})` : ''
      }`
    );
    console.log('Поточний стан перед навігацією:', {
      currentStep: get().currentStep,
      currentSubStep: get().currentSubStep,
      history: [...get().navigationHistory],
    });

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

      // Логуємо зміну після оновлення стану
      setTimeout(() => {
        logNavigationState(get(), 'After navigateToStep');
      }, 0);
    });
  },

  navigateBack: () => {
    console.log('OrderWizard - navigateBack');
    const { navigationHistory } = get();

    if (navigationHistory.length === 0) {
      console.log('OrderWizard - navigateBack: Немає історії для повернення');
      return; // Немає історії для повернення
    }

    set((state) => {
      // Отримуємо останній крок з історії
      const lastStep =
        state.navigationHistory[state.navigationHistory.length - 1];

      console.log('OrderWizard - navigateBack: Повернення до', lastStep);

      // Оновлюємо поточний крок
      state.currentStep = lastStep.step;
      state.currentSubStep = lastStep.subStep;

      // Видаляємо крок з історії
      state.navigationHistory = state.navigationHistory.slice(0, -1);

      // Логуємо зміну після оновлення стану
      setTimeout(() => {
        logNavigationState(get(), 'After navigateBack');
      }, 0);
    });
  },

  resetNavigationHistory: () => {
    console.log('OrderWizard - resetNavigationHistory');

    set((state) => {
      state.navigationHistory = [];

      // Логуємо зміну після оновлення стану
      setTimeout(() => {
        logNavigationState(get(), 'After resetNavigationHistory');
      }, 0);
    });
  },
});
