import { WizardStep } from '../store/navigation';
import { WizardStepConfig } from '../types';

/**
 * Конфігурація кроків для OrderWizard
 * Описує всі можливі кроки та їх властивості
 */
export const WIZARD_STEPS_CONFIG: Record<WizardStep, WizardStepConfig> = {
  // Основні кроки
  [WizardStep.CLIENT_SELECTION]: {
    id: WizardStep.CLIENT_SELECTION,
    title: 'Вибір клієнта',
    description: 'Виберіть існуючого або створіть нового клієнта',
    order: 1,
    isSubstep: false
  },
  [WizardStep.BRANCH_SELECTION]: {
    id: WizardStep.BRANCH_SELECTION,
    title: 'Вибір філії',
    description: 'Виберіть пункт прийому (філію)',
    order: 2,
    isSubstep: false
  },
  [WizardStep.BASIC_INFO]: {
    id: WizardStep.BASIC_INFO,
    title: 'Базова інформація',
    description: 'Вкажіть основну інформацію про замовлення',
    order: 3,
    isSubstep: false
  },
  [WizardStep.ITEM_MANAGER]: {
    id: WizardStep.ITEM_MANAGER,
    title: 'Управління предметами',
    description: 'Додайте предмети в замовлення',
    order: 4,
    isSubstep: false
  },
  [WizardStep.ORDER_PARAMETERS]: {
    id: WizardStep.ORDER_PARAMETERS,
    title: 'Параметри замовлення',
    description: 'Вкажіть загальні параметри замовлення',
    order: 5,
    isSubstep: false
  },
  [WizardStep.ORDER_CONFIRMATION]: {
    id: WizardStep.ORDER_CONFIRMATION,
    title: 'Підтвердження',
    description: 'Перевірте та підтвердіть замовлення',
    order: 6,
    isSubstep: false
  },
  
  // Підкроки візарда предметів
  [WizardStep.ITEM_BASIC_INFO]: {
    id: WizardStep.ITEM_BASIC_INFO,
    title: 'Основна інформація предмета',
    description: 'Вкажіть основну інформацію про предмет',
    order: 1,
    isSubstep: true,
    parentStep: WizardStep.ITEM_MANAGER
  },
  [WizardStep.ITEM_PROPERTIES]: {
    id: WizardStep.ITEM_PROPERTIES,
    title: 'Характеристики предмета',
    description: 'Вкажіть характеристики предмета',
    order: 2,
    isSubstep: true,
    parentStep: WizardStep.ITEM_MANAGER
  },
  [WizardStep.DEFECTS_STAINS]: {
    id: WizardStep.DEFECTS_STAINS,
    title: 'Дефекти та забруднення',
    description: 'Вкажіть дефекти та забруднення предмета',
    order: 3,
    isSubstep: true,
    parentStep: WizardStep.ITEM_MANAGER
  },
  [WizardStep.PRICE_CALCULATOR]: {
    id: WizardStep.PRICE_CALCULATOR,
    title: 'Калькулятор ціни',
    description: 'Розрахуйте ціну за послуги',
    order: 4,
    isSubstep: true,
    parentStep: WizardStep.ITEM_MANAGER
  },
  [WizardStep.PHOTO_DOCUMENTATION]: {
    id: WizardStep.PHOTO_DOCUMENTATION,
    title: 'Фотодокументація',
    description: 'Додайте фотографії предмета',
    order: 5,
    isSubstep: true,
    parentStep: WizardStep.ITEM_MANAGER
  }
};

/**
 * Отримати наступний крок після поточного
 */
export const getNextStep = (currentStep: WizardStep): WizardStep | null => {
  switch (currentStep) {
    case WizardStep.CLIENT_SELECTION:
      return WizardStep.BRANCH_SELECTION;
    case WizardStep.BRANCH_SELECTION:
      return WizardStep.BASIC_INFO;
    case WizardStep.BASIC_INFO:
      return WizardStep.ITEM_MANAGER;
    case WizardStep.ITEM_MANAGER:
      return WizardStep.ORDER_PARAMETERS;
    case WizardStep.ORDER_PARAMETERS:
      return WizardStep.ORDER_CONFIRMATION;
    case WizardStep.ITEM_BASIC_INFO:
      return WizardStep.ITEM_PROPERTIES;
    case WizardStep.ITEM_PROPERTIES:
      return WizardStep.DEFECTS_STAINS;
    case WizardStep.DEFECTS_STAINS:
      return WizardStep.PRICE_CALCULATOR;
    case WizardStep.PRICE_CALCULATOR:
      return WizardStep.PHOTO_DOCUMENTATION;
    case WizardStep.PHOTO_DOCUMENTATION:
      return null; // Останній підкрок
    case WizardStep.ORDER_CONFIRMATION:
      return null; // Останній крок
    default:
      return null;
  }
};

/**
 * Отримати попередній крок перед поточним
 */
export const getPreviousStep = (currentStep: WizardStep): WizardStep | null => {
  switch (currentStep) {
    case WizardStep.BRANCH_SELECTION:
      return WizardStep.CLIENT_SELECTION;
    case WizardStep.BASIC_INFO:
      return WizardStep.BRANCH_SELECTION;
    case WizardStep.ITEM_MANAGER:
      return WizardStep.BASIC_INFO;
    case WizardStep.ORDER_PARAMETERS:
      return WizardStep.ITEM_MANAGER;
    case WizardStep.ORDER_CONFIRMATION:
      return WizardStep.ORDER_PARAMETERS;
    case WizardStep.ITEM_PROPERTIES:
      return WizardStep.ITEM_BASIC_INFO;
    case WizardStep.DEFECTS_STAINS:
      return WizardStep.ITEM_PROPERTIES;
    case WizardStep.PRICE_CALCULATOR:
      return WizardStep.DEFECTS_STAINS;
    case WizardStep.PHOTO_DOCUMENTATION:
      return WizardStep.PRICE_CALCULATOR;
    case WizardStep.CLIENT_SELECTION:
      return null; // Перший крок
    case WizardStep.ITEM_BASIC_INFO:
      return null; // Перший підкрок
    default:
      return null;
  }
};

/**
 * Отримати конфігурацію кроку за його ідентифікатором
 */
export const getStepConfig = (step: WizardStep): WizardStepConfig => {
  return WIZARD_STEPS_CONFIG[step];
};

/**
 * Отримати всі основні кроки (не підкроки)
 */
export const getMainSteps = (): WizardStepConfig[] => {
  return Object.values(WIZARD_STEPS_CONFIG)
    .filter(step => !step.isSubstep)
    .sort((a, b) => a.order - b.order);
};

/**
 * Отримати всі підкроки для вказаного батьківського кроку
 */
export const getSubsteps = (parentStep: WizardStep): WizardStepConfig[] => {
  return Object.values(WIZARD_STEPS_CONFIG)
    .filter(step => step.isSubstep && step.parentStep === parentStep)
    .sort((a, b) => a.order - b.order);
};

/**
 * Перевірити, чи є крок підкроком
 */
export const isSubstep = (step: WizardStep): boolean => {
  return WIZARD_STEPS_CONFIG[step].isSubstep || false;
};

/**
 * Отримати батьківський крок для підкроку
 */
export const getParentStep = (step: WizardStep): WizardStep | null => {
  const parentStepId = WIZARD_STEPS_CONFIG[step].parentStep;
  return parentStepId ? parentStepId as WizardStep : null;
};
