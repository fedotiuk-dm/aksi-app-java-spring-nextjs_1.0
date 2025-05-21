import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

import { BaseStore } from './baseStore';
import {
  ItemWizardSubStep,
  WizardCurrentStep,
  WizardHistory,
  WizardMainStep,
  WizardStepsConfig,
  StepValidationStatus
} from '../../types/wizard.types';

/**
 * Константи для дублювання рядків
 */
export const BASIC_INFO_VALUE = 'basic-info';
export const NOT_VALIDATED_VALUE: StepValidationStatus = 'not-validated';

/**
 * Константи для типів кроків
 */
export const ITEM_WIZARD = 'item-wizard' as WizardMainStep;
export const ITEM_MANAGER = 'item-manager' as WizardMainStep;
export const CLIENT_SELECTION = 'client-selection' as WizardMainStep;
export const BASIC_INFO_MAIN = BASIC_INFO_VALUE as WizardMainStep;
export const BASIC_INFO_SUB = BASIC_INFO_VALUE as ItemWizardSubStep;

/**
 * Порядок основних кроків для навігації
 */
export const mainStepsOrder: WizardMainStep[] = [
  CLIENT_SELECTION,
  BASIC_INFO_MAIN,
  ITEM_MANAGER,
  ITEM_WIZARD,
];

/**
 * Порядок підкроків візарда предметів для навігації
 */
export const itemSubStepsOrder: ItemWizardSubStep[] = [
  'basic-info',
  'item-properties',
  'defects-stains',
  'price-calculator',
  'photo-documentation',
];

/**
 * Інтерфейс стану стору навігації
 */
export interface NavigationState extends BaseStore {
  // Поточний крок
  currentStep: WizardCurrentStep;
  // Історія кроків для навігації назад
  history: WizardHistory;
  // Конфігурація кроків
  stepsConfig: WizardStepsConfig;

  // Методи для оновлення стану
  goToStep: (mainStep: WizardMainStep, itemSubStep?: ItemWizardSubStep | null) => void;
  goToNextMainStep: () => void;
  goToPreviousMainStep: () => void;
  goToNextItemSubStep: () => void;
  goToPreviousItemSubStep: () => void;
}

/**
 * Початкова конфігурація кроків візарда з заголовками та описами
 */
const stepsConfig: WizardStepsConfig = {
  mainSteps: {
    'client-selection': {
      title: 'Вибір клієнта',
      description: 'Виберіть існуючого клієнта або створіть нового',
      validationStatus: NOT_VALIDATED_VALUE,
    },
    [BASIC_INFO_VALUE]: {
      title: 'Основна інформація',
      description: 'Заповніть базову інформацію про замовлення',
      validationStatus: NOT_VALIDATED_VALUE,
    },
    'item-manager': {
      title: 'Предмети замовлення',
      description: 'Управління списком предметів замовлення',
      validationStatus: NOT_VALIDATED_VALUE,
    },
    'item-wizard': {
      title: 'Додавання предмета',
      description: 'Детальна інформація про предмет',
      validationStatus: NOT_VALIDATED_VALUE,
    },
  },
  itemSubSteps: {
    [BASIC_INFO_VALUE]: {
      title: 'Основна інформація',
      description: 'Виберіть категорію та найменування предмета',
      validationStatus: NOT_VALIDATED_VALUE,
    },
    'item-properties': {
      title: 'Властивості',
      description: 'Вкажіть матеріал, колір та інші характеристики',
      validationStatus: NOT_VALIDATED_VALUE,
    },
    'defects-stains': {
      title: 'Дефекти та плями',
      description: 'Вкажіть наявні дефекти та забруднення',
      validationStatus: NOT_VALIDATED_VALUE,
    },
    'price-calculator': {
      title: 'Розрахунок ціни',
      description: 'Налаштуйте коефіцієнти та модифікатори ціни',
      validationStatus: NOT_VALIDATED_VALUE,
    },
    'photo-documentation': {
      title: 'Фотодокументація',
      description: 'Додайте фотографії предмета',
      validationStatus: NOT_VALIDATED_VALUE,
    },
  },
};

/**
 * Початковий крок візарда
 */
const initialCurrentStep: WizardCurrentStep = {
  mainStep: CLIENT_SELECTION,
  itemSubStep: null,
};

/**
 * Початкова історія кроків
 */
const initialHistory: WizardHistory = {
  steps: [initialCurrentStep],
  currentIndex: 0,
};

/**
 * Початковий стан для стору навігації
 */
const initialState = {
  currentStep: initialCurrentStep,
  history: initialHistory,
  stepsConfig,
  error: null,
  isSaving: false,
};

/**
 * Стор для управління навігацією між кроками Order Wizard
 */
export const useNavigationStore = create<NavigationState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // Навігація між кроками
        goToStep: (mainStep, itemSubStep = null) => {
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
            const nextItemSubStep = nextMainStep === ITEM_WIZARD ? BASIC_INFO_SUB : null;

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

        // Встановлення помилки
        setError: (error) => set({
          error,
        }),

        // Встановлення статусу збереження
        setIsSaving: (isSaving) => set({
          isSaving,
        }),

        // Скидання стану стору
        reset: () => set(initialState),
      }),
      {
        name: 'order-wizard-navigation',
      }
    )
  )
);
