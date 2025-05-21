import { create } from 'zustand';

import { initialNavigationState } from './navigation.initial';
import {
  NavigationStore,
  WizardStep,
  StepHistoryEntry
} from './navigation.types';

/**
 * Store для навігації між кроками OrderWizard
 * Відповідає за керування переходами між кроками, історію переходів
 * та визначення доступності кроків
 */
export const useNavigationStore = create<NavigationStore>((set, get) => ({
  ...initialNavigationState,

  /**
   * Перехід до конкретного кроку
   */
  goToStep: (step: WizardStep) => {
    const { availability, currentStep } = get();

    // Перевіряємо, чи доступний крок для переходу
    if (!availability[step]) {
      console.warn(`Крок ${step} недоступний для переходу`);
      return;
    }

    // Якщо ми вже на цьому кроці, нічого не робимо
    if (currentStep === step) {
      return;
    }

    // Створюємо новий запис в історії
    const historyEntry: StepHistoryEntry = {
      step,
      timestamp: Date.now()
    };

    set((state) => ({
      currentStep: step,
      stepHistory: [...state.stepHistory, historyEntry],
      isBackAllowed: true, // Після переходу на новий крок завжди можна вернутися
      isForwardAllowed: false // Стан forward буде оновлено через валідацію
    }));
  },

  /**
   * Перехід назад в історії
   */
  goBack: () => {
    const { stepHistory, isBackAllowed } = get();

    // Якщо немає історії або переходи назад заборонені
    if (stepHistory.length <= 1 || !isBackAllowed) {
      return;
    }

    // Отримуємо попередній крок (без поточного)
    const previousSteps = stepHistory.slice(0, -1);
    const previousStep = previousSteps[previousSteps.length - 1].step;

    set({
      currentStep: previousStep,
      stepHistory: previousSteps,
      isBackAllowed: previousSteps.length > 1, // Можемо повертатися, якщо є куди
      isForwardAllowed: true // Оскільки ми повернулися, то можемо йти вперед
    });
  },

  /**
   * Перехід вперед (після повернення назад)
   */
  goForward: () => {
    const { currentStep, isForwardAllowed, availability } = get();

    if (!isForwardAllowed) {
      return;
    }

    // Визначаємо наступний крок на основі поточного
    let nextStep: WizardStep;

    switch (currentStep) {
      case WizardStep.CLIENT_SELECTION:
        nextStep = WizardStep.BRANCH_SELECTION;
        break;
      case WizardStep.BRANCH_SELECTION:
        nextStep = WizardStep.BASIC_INFO;
        break;
      case WizardStep.BASIC_INFO:
        nextStep = WizardStep.ITEM_MANAGER;
        break;
      case WizardStep.ITEM_MANAGER:
        nextStep = WizardStep.ORDER_PARAMETERS;
        break;
      case WizardStep.ORDER_PARAMETERS:
        nextStep = WizardStep.ORDER_CONFIRMATION;
        break;
      // Навігація в рамках підкроків візарда предметів
      case WizardStep.ITEM_BASIC_INFO:
        nextStep = WizardStep.ITEM_PROPERTIES;
        break;
      case WizardStep.ITEM_PROPERTIES:
        nextStep = WizardStep.DEFECTS_STAINS;
        break;
      case WizardStep.DEFECTS_STAINS:
        nextStep = WizardStep.PRICE_CALCULATOR;
        break;
      case WizardStep.PRICE_CALCULATOR:
        nextStep = WizardStep.PHOTO_DOCUMENTATION;
        break;
      default:
        return; // Для інших кроків немає стандартного переходу вперед
    }

    // Перевіряємо, чи доступний наступний крок
    if (!availability[nextStep]) {
      console.warn(`Наступний крок ${nextStep} недоступний`);
      return;
    }

    // Створюємо новий запис в історії
    const historyEntry: StepHistoryEntry = {
      step: nextStep,
      timestamp: Date.now()
    };

    set((state) => ({
      currentStep: nextStep,
      stepHistory: [...state.stepHistory, historyEntry],
      isBackAllowed: true,
      isForwardAllowed: false // Буде оновлено через валідацію
    }));
  },

  /**
   * Запуск візарда додавання нового предмета
   */
  startItemWizard: () => {
    set({
      isItemWizardActive: true,
      currentStep: WizardStep.ITEM_BASIC_INFO,
      isBackAllowed: false, // На першому кроці новий стейт не дозволяє повернутися
      stepHistory: [
        {
          step: WizardStep.ITEM_BASIC_INFO,
          timestamp: Date.now()
        }
      ]
    });

    // Активуємо перший крок, інші будуть активовані по мірі заповнення
    set((state) => ({
      availability: {
        ...state.availability,
        [WizardStep.ITEM_BASIC_INFO]: true,
        [WizardStep.ITEM_PROPERTIES]: false,
        [WizardStep.DEFECTS_STAINS]: false,
        [WizardStep.PRICE_CALCULATOR]: false,
        [WizardStep.PHOTO_DOCUMENTATION]: false
      }
    }));
  },

  /**
   * Завершення візарда додавання нового предмета
   * @param saveItem - чи зберігати доданий предмет
   */
  finishItemWizard: (saveItem: boolean) => {
    // Додаткова логіка для збереження предмета буде в іншому сторі
    // Тут тільки навігаційна частина
    console.log(`Завершення візарда з параметром saveItem: ${saveItem}`);
    set({
      isItemWizardActive: false,
      currentStep: WizardStep.ITEM_MANAGER,
      isBackAllowed: true,
      isForwardAllowed: true,
      stepHistory: [
        {
          step: WizardStep.ITEM_MANAGER,
          timestamp: Date.now()
        }
      ]
    });
  },

  /**
   * Оновлення статусу доступності кроку
   */
  updateStepAvailability: (step: WizardStep, isAvailable: boolean) => {
    set((state) => ({
      availability: {
        ...state.availability,
        [step]: isAvailable
      }
    }));
  },

  /**
   * Скидання навігації до початкового стану
   */
  resetNavigation: () => {
    set(initialNavigationState);
  }
}));
