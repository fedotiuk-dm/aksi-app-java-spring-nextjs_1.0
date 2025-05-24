/**
 * Константи кроків Order Wizard
 */

import { WizardStep, ItemWizardStep } from '../types/wizard-common.types';

// Порядок основних кроків
export const WIZARD_STEPS_ORDER: WizardStep[] = [
  WizardStep.CLIENT_SELECTION,
  WizardStep.BRANCH_SELECTION,
  WizardStep.ITEM_MANAGER,
  WizardStep.ORDER_PARAMETERS,
  WizardStep.ORDER_CONFIRMATION,
];

// Порядок підкроків Item Wizard
export const ITEM_WIZARD_STEPS_ORDER: ItemWizardStep[] = [
  ItemWizardStep.ITEM_BASIC_INFO,
  ItemWizardStep.ITEM_PROPERTIES,
  ItemWizardStep.DEFECTS_STAINS,
  ItemWizardStep.PRICE_CALCULATOR,
  ItemWizardStep.PHOTO_DOCUMENTATION,
];

// Назви кроків для відображення
export const WIZARD_STEP_LABELS: Record<WizardStep, string> = {
  [WizardStep.CLIENT_SELECTION]: 'Вибір клієнта',
  [WizardStep.BRANCH_SELECTION]: 'Вибір філії',
  [WizardStep.ITEM_MANAGER]: 'Управління предметами',
  [WizardStep.ORDER_PARAMETERS]: 'Параметри замовлення',
  [WizardStep.ORDER_CONFIRMATION]: 'Підтвердження',
};

// Назви підкроків Item Wizard
export const ITEM_WIZARD_STEP_LABELS: Record<ItemWizardStep, string> = {
  [ItemWizardStep.ITEM_BASIC_INFO]: 'Основна інформація',
  [ItemWizardStep.ITEM_PROPERTIES]: 'Властивості предмета',
  [ItemWizardStep.DEFECTS_STAINS]: 'Дефекти та плями',
  [ItemWizardStep.PRICE_CALCULATOR]: 'Розрахунок ціни',
  [ItemWizardStep.PHOTO_DOCUMENTATION]: 'Фотодокументація',
};

// Короткі описи кроків
export const WIZARD_STEP_DESCRIPTIONS: Record<WizardStep, string> = {
  [WizardStep.CLIENT_SELECTION]: 'Оберіть існуючого клієнта або створіть нового',
  [WizardStep.BRANCH_SELECTION]: 'Оберіть філію для оформлення замовлення',
  [WizardStep.ITEM_MANAGER]: 'Додайте предмети до замовлення',
  [WizardStep.ORDER_PARAMETERS]: 'Встановіть параметри виконання та оплати',
  [WizardStep.ORDER_CONFIRMATION]: 'Перевірте та підтвердіть замовлення',
};

// Обов'язкові кроки (не можна пропустити)
export const REQUIRED_STEPS: WizardStep[] = [
  WizardStep.CLIENT_SELECTION,
  WizardStep.BRANCH_SELECTION,
  WizardStep.ITEM_MANAGER,
  WizardStep.ORDER_CONFIRMATION,
];

// Обов'язкові підкроки Item Wizard
export const REQUIRED_ITEM_STEPS: ItemWizardStep[] = [
  ItemWizardStep.ITEM_BASIC_INFO,
  ItemWizardStep.ITEM_PROPERTIES,
  ItemWizardStep.PRICE_CALCULATOR,
];

// Кроки що можуть мати незбережені зміни
export const STEPS_WITH_UNSAVED_CHANGES: WizardStep[] = [
  WizardStep.CLIENT_SELECTION,
  WizardStep.ITEM_MANAGER,
  WizardStep.ORDER_PARAMETERS,
];

// Кроки які потребують API валідації
export const STEPS_WITH_API_VALIDATION: WizardStep[] = [
  WizardStep.CLIENT_SELECTION,
  WizardStep.BRANCH_SELECTION,
  WizardStep.ITEM_MANAGER,
];

// Утилітарні функції
export const getStepIndex = (step: WizardStep): number => {
  return WIZARD_STEPS_ORDER.indexOf(step);
};

export const getItemStepIndex = (step: ItemWizardStep): number => {
  return ITEM_WIZARD_STEPS_ORDER.indexOf(step);
};

export const getNextStep = (currentStep: WizardStep): WizardStep | null => {
  const currentIndex = getStepIndex(currentStep);
  const nextIndex = currentIndex + 1;
  return nextIndex < WIZARD_STEPS_ORDER.length ? WIZARD_STEPS_ORDER[nextIndex] : null;
};

export const getPrevStep = (currentStep: WizardStep): WizardStep | null => {
  const currentIndex = getStepIndex(currentStep);
  const prevIndex = currentIndex - 1;
  return prevIndex >= 0 ? WIZARD_STEPS_ORDER[prevIndex] : null;
};

export const isStepRequired = (step: WizardStep): boolean => {
  return REQUIRED_STEPS.includes(step);
};

export const calculateProgress = (currentStep: WizardStep): number => {
  const currentIndex = getStepIndex(currentStep);
  return ((currentIndex + 1) / WIZARD_STEPS_ORDER.length) * 100;
};
