import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

import { initialWizardState, mainStepsOrder, itemSubStepsOrder } from './wizard.initial';
import {
  ItemWizardSubStep,
  WizardMainStep,
  WizardStore,
  StepValidationStatus,
} from '../types/wizard.types';

// Константи для типів кроків
const ITEM_WIZARD = 'item-wizard' as WizardMainStep;
const ITEM_MANAGER = 'item-manager' as WizardMainStep;
const BASIC_INFO = 'basic-info' as ItemWizardSubStep;

/**
 * Zustand стор для управління станом Order Wizard
 */
export const useWizardStore = create<WizardStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialWizardState,

        // Навігація між кроками
        goToStep: (mainStep: WizardMainStep, itemSubStep: ItemWizardSubStep | null = null) => {
          const { history } = get();
          const newStep = { mainStep, itemSubStep };

          // Оновлюємо історію для можливості повернення назад
          const newHistory = {
            steps: [...history.steps.slice(0, history.currentIndex + 1), newStep],
            currentIndex: history.currentIndex + 1,
          };

          set({
            currentStep: newStep,
            history: newHistory,
          });
        },

        goToNextMainStep: () => {
          const { currentStep } = get();
          const currentIndex = mainStepsOrder.indexOf(currentStep.mainStep);

          if (currentIndex < mainStepsOrder.length - 1) {
            const nextMainStep = mainStepsOrder[currentIndex + 1];

            // Якщо переходимо до певних етапів, встановлюємо відповідні підетапи
            const nextItemSubStep = nextMainStep === ITEM_WIZARD ? BASIC_INFO as ItemWizardSubStep : null;

            get().goToStep(nextMainStep, nextItemSubStep);
          }
        },

        goToPreviousMainStep: () => {
          const { history } = get();

          if (history.currentIndex > 0) {
            const previousStep = history.steps[history.currentIndex - 1];

            set({
              currentStep: previousStep,
              history: {
                ...history,
                currentIndex: history.currentIndex - 1,
              },
            });
          }
        },

        goToNextItemSubStep: () => {
          const { currentStep } = get();

          // Працює тільки в етапі додавання/редагування предмета
          if (currentStep.mainStep !== ITEM_WIZARD || !currentStep.itemSubStep) {
            return;
          }

          const currentIndex = itemSubStepsOrder.indexOf(currentStep.itemSubStep);

          if (currentIndex < itemSubStepsOrder.length - 1) {
            const nextItemSubStep = itemSubStepsOrder[currentIndex + 1];
            get().goToStep(ITEM_WIZARD, nextItemSubStep);
          } else {
            // Якщо це останній підетап, повертаємось до менеджера предметів
            get().goToStep(ITEM_MANAGER, null);
          }
        },

        goToPreviousItemSubStep: () => {
          const { currentStep } = get();

          // Працює тільки в етапі додавання/редагування предмета
          if (currentStep.mainStep !== ITEM_WIZARD || !currentStep.itemSubStep) {
            return;
          }

          const currentIndex = itemSubStepsOrder.indexOf(currentStep.itemSubStep);

          if (currentIndex > 0) {
            const prevItemSubStep = itemSubStepsOrder[currentIndex - 1];
            get().goToStep(ITEM_WIZARD, prevItemSubStep);
          } else {
            // Якщо це перший підетап, повертаємось до менеджера предметів
            get().goToStep(ITEM_MANAGER, null);
          }
        },

        // Валідація кроків
        setStepValidationStatus: (
          mainStep: WizardMainStep,
          status: StepValidationStatus,
          itemSubStep?: ItemWizardSubStep
        ) => {
          const { stepsConfig } = get();

          if (itemSubStep) {
            // Оновлюємо статус підетапу
            set({
              stepsConfig: {
                ...stepsConfig,
                itemSubSteps: {
                  ...stepsConfig.itemSubSteps,
                  [itemSubStep]: {
                    ...stepsConfig.itemSubSteps[itemSubStep],
                    validationStatus: status,
                  },
                },
              },
            });
          } else {
            // Оновлюємо статус основного етапу
            set({
              stepsConfig: {
                ...stepsConfig,
                mainSteps: {
                  ...stepsConfig.mainSteps,
                  [mainStep]: {
                    ...stepsConfig.mainSteps[mainStep],
                    validationStatus: status,
                  },
                },
              },
            });
          }
        },

        // Скидання стану
        resetWizard: () => {
          set(initialWizardState);
        },

        // Обробка помилок
        setError: (error: string | null) => {
          set({ error });
        },
      }),
      {
        name: 'order-wizard-store',
        // Зберігаємо стан візарда локально для можливості відновлення при оновленні сторінки
        // Міграцію версій даних можна додати в майбутньому, якщо буде потрібно
      }
    )
  )
);
