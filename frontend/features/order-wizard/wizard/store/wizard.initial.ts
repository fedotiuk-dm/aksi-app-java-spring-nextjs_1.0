import { 
  ItemWizardSubStep,
  WizardCurrentStep, 
  WizardHistory, 
  WizardMainStep, 
  WizardState, 
  WizardStepsConfig 
} from '../types/wizard.types';

/**
 * Константи статусів валідації
 */
export const NOT_VALIDATED = 'not-validated' as const;

/**
 * Початковий крок візарда
 */
export const initialCurrentStep: WizardCurrentStep = {
  mainStep: 'client-selection',
  itemSubStep: null,
};

/**
 * Початкова історія кроків
 */
export const initialHistory: WizardHistory = {
  steps: [initialCurrentStep],
  currentIndex: 0,
};

/**
 * Конфігурація кроків візарда з заголовками та описами
 */
export const stepsConfig: WizardStepsConfig = {
  mainSteps: {
    'client-selection': {
      title: 'Вибір клієнта',
      description: 'Виберіть існуючого клієнта або створіть нового',
      validationStatus: NOT_VALIDATED,
    },
    'basic-info': {
      title: 'Основна інформація',
      description: 'Заповніть базову інформацію про замовлення',
      validationStatus: NOT_VALIDATED,
    },
    'item-manager': {
      title: 'Предмети замовлення',
      description: 'Управління списком предметів замовлення',
      validationStatus: NOT_VALIDATED,
    },
    'item-wizard': {
      title: 'Додавання предмета',
      description: 'Детальна інформація про предмет',
      validationStatus: NOT_VALIDATED,
    },
  },
  itemSubSteps: {
    'basic-info': {
      title: 'Основна інформація',
      description: 'Виберіть категорію та найменування предмета',
      validationStatus: NOT_VALIDATED,
    },
    'item-properties': {
      title: 'Властивості',
      description: 'Вкажіть матеріал, колір та інші характеристики',
      validationStatus: NOT_VALIDATED,
    },
    'defects-stains': {
      title: 'Дефекти та плями',
      description: 'Вкажіть наявні дефекти та забруднення',
      validationStatus: NOT_VALIDATED,
    },
    'price-calculator': {
      title: 'Розрахунок ціни',
      description: 'Налаштуйте коефіцієнти та модифікатори ціни',
      validationStatus: NOT_VALIDATED,
    },
    'photo-documentation': {
      title: 'Фотодокументація',
      description: 'Додайте фотографії предмета',
      validationStatus: NOT_VALIDATED,
    },
  },
};

/**
 * Порядок основних кроків для навігації
 */
export const mainStepsOrder: WizardMainStep[] = [
  'client-selection',
  'basic-info',
  'item-manager',
  'item-wizard',
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
 * Початковий стан візарда
 */
export const initialWizardState: WizardState = {
  currentStep: initialCurrentStep,
  stepsConfig,
  history: initialHistory,
  isSaving: false,
  error: null,
};
