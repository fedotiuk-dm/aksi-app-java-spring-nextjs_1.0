import { create } from 'zustand';

import { initialValidationState } from './validation.initial';
import { ValidationStore, ValidationStatus, StepValidation } from './validation.types';
import { WizardStep } from '../navigation';

/**
 * Store для валідації кроків OrderWizard
 * Відповідає за відстеження статусу валідації для кожного кроку
 * та загального статусу валідації візарда
 */
export const useValidationStore = create<ValidationStore>((set, get) => ({
  ...initialValidationState,

  /**
   * Встановлення статусу валідації для конкретного кроку
   */
  setStepValidation: (step: WizardStep, validation: StepValidation) => {
    set((state) => ({
      validationMap: {
        ...state.validationMap,
        [step]: validation,
      },
      activeValidation: false,
    }));

    // Оновлюємо загальний статус валідації візарда
    get().updateWizardValidStatus();
  },

  /**
   * Валідація конкретного кроку
   * Цей метод буде викликатися з хуків конкретних кроків,
   * які міститимуть власну логіку валідації
   */
  validateStep: (step: WizardStep, forcedStatus?: ValidationStatus) => {
    const { validationMap } = get();

    // Встановлюємо стан активної валідації
    set({ activeValidation: true });

    // Якщо передано примусовий статус, використовуємо його
    if (forcedStatus !== undefined) {
      const currentStep = validationMap[step];
      const updatedValidation: StepValidation = {
        status: forcedStatus,
        errors: currentStep?.errors || {},
        isComplete: forcedStatus === ValidationStatus.VALID,
        timestamp: Date.now(),
      };

      get().setStepValidation(step, updatedValidation);
      return;
    }

    // В іншому випадку статус буде встановлено через відповідний хук кроку,
    // який викличе setStepValidation
  },

  /**
   * Скидання валідації для конкретного кроку
   */
  resetStepValidation: (step: WizardStep) => {
    set((state) => {
      const updatedMap = { ...state.validationMap };
      delete updatedMap[step];

      return {
        validationMap: updatedMap,
        activeValidation: false,
      };
    });

    // Оновлюємо загальний статус валідації візарда
    get().updateWizardValidStatus();
  },

  /**
   * Скидання всієї валідації для всіх кроків
   */
  resetAllValidation: () => {
    set({
      validationMap: {},
      isWizardValid: false,
      activeValidation: false,
    });
  },

  /**
   * Оновлення загального статусу валідації візарда
   * на основі статусів окремих кроків
   */
  updateWizardValidStatus: () => {
    const { validationMap } = get();

    // Перевіряємо, чи є кроки, які пройшли валідацію
    if (Object.keys(validationMap).length === 0) {
      set({ isWizardValid: false });
      return;
    }

    // Перевіряємо, чи всі кроки, для яких проводилася валідація, валідні
    const allStepsValid = Object.values(validationMap).every(
      (validation) => validation.status === ValidationStatus.VALID
    );

    set({ isWizardValid: allStepsValid });
  },
}));
