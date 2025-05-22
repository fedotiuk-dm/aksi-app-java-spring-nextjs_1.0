import { WizardState } from './wizard.schema';
import { WizardStep } from '../store/navigation/navigation.types';

/**
 * Перевірка вибору клієнта
 */
export const isClientSelected = (state?: WizardState): boolean => {
  if (!state) return false;
  return !!(
    state.clientData?.clientId ||
    (state.clientData?.client && Object.keys(state.clientData.client).length > 0)
  );
};

/**
 * Перевірка вибору філії
 */
export const isBranchSelected = (state?: WizardState): boolean => {
  if (!state) return false;
  return !!(
    state.branchData?.branchId ||
    (state.branchData?.branch && Object.keys(state.branchData.branch).length > 0)
  );
};

/**
 * Перевірка заповнення базових даних замовлення
 */
export const isOrderBasicInfoComplete = (state?: WizardState): boolean => {
  if (!state) return false;
  return !!(state.orderData?.receiptNumber && state.orderData?.expectedCompletionDate);
};

/**
 * Перевірка заповнення базових даних предмета
 */
export const isItemBasicInfoComplete = (state?: WizardState): boolean => {
  if (!state || !state.currentItem) return false;
  return !!(state.currentItem.name && state.currentItem.quantity);
};

/**
 * Перевірка наявності предметів у замовленні
 */
export const hasItems = (state?: WizardState): boolean => {
  if (!state) return false;
  return !!(state.items && state.items.length > 0);
};

/**
 * Перевірка наявності даних про ціни
 */
export const hasPricingData = (state?: WizardState): boolean => {
  if (!state) return false;
  return !!(state.pricingData && state.pricingData.totalAmount);
};

/**
 * Визначає, чи можливий перехід між кроками
 */
export const canNavigateBetweenSteps = (
  from: WizardStep,
  to: WizardStep,
  state?: WizardState
): boolean => {
  // Спеціальні перевірки для переходів між конкретними кроками
  if (from === WizardStep.CLIENT_SELECTION && to === WizardStep.BRANCH_SELECTION) {
    return isClientSelected(state);
  }

  if (from === WizardStep.BRANCH_SELECTION && to === WizardStep.BASIC_INFO) {
    return isBranchSelected(state);
  }

  if (from === WizardStep.BASIC_INFO && to === WizardStep.ITEM_MANAGER) {
    return isOrderBasicInfoComplete(state);
  }

  if (from === WizardStep.ITEM_MANAGER && to === WizardStep.ITEM_BASIC_INFO) {
    return true; // Завжди дозволено почати створення предмета
  }

  if (from === WizardStep.ITEM_BASIC_INFO && to === WizardStep.ITEM_PROPERTIES) {
    return isItemBasicInfoComplete(state);
  }

  if (from === WizardStep.ITEM_MANAGER && to === WizardStep.ORDER_PARAMETERS) {
    return hasItems(state);
  }

  if (to === WizardStep.ORDER_CONFIRMATION) {
    return hasPricingData(state);
  }

  // Для підкроків підвізарду предметів
  const itemSubsteps = [
    WizardStep.ITEM_BASIC_INFO,
    WizardStep.ITEM_PROPERTIES,
    WizardStep.DEFECTS_STAINS,
    WizardStep.PRICE_CALCULATOR,
    WizardStep.PHOTO_DOCUMENTATION,
  ];

  // Перехід між підкроками
  if (itemSubsteps.includes(from) && itemSubsteps.includes(to)) {
    const fromIndex = itemSubsteps.indexOf(from);
    const toIndex = itemSubsteps.indexOf(to);
    return Math.abs(toIndex - fromIndex) <= 1;
  }

  return true; // За замовчуванням дозволяємо переходи
};

/**
 * Отримати наступний дозволений крок на основі стану візарда
 */
export const getNextStepFromState = (
  currentStep: WizardStep,
  state?: WizardState
): WizardStep | null => {
  // Основні кроки візарда
  const mainSteps = [
    WizardStep.CLIENT_SELECTION,
    WizardStep.BRANCH_SELECTION,
    WizardStep.BASIC_INFO,
    WizardStep.ITEM_MANAGER,
    WizardStep.ORDER_PARAMETERS,
    WizardStep.ORDER_CONFIRMATION,
  ];

  // Підкроки візарда предметів
  const itemSubsteps = [
    WizardStep.ITEM_BASIC_INFO,
    WizardStep.ITEM_PROPERTIES,
    WizardStep.DEFECTS_STAINS,
    WizardStep.PRICE_CALCULATOR,
    WizardStep.PHOTO_DOCUMENTATION,
  ];

  // Наступний крок в основному візарді
  if (mainSteps.includes(currentStep)) {
    const currentIndex = mainSteps.indexOf(currentStep);

    // Якщо це останній крок, немає наступного
    if (currentIndex === mainSteps.length - 1) {
      return null;
    }

    // Наступний крок у послідовності
    const nextStep = mainSteps[currentIndex + 1];

    // Перевіряємо чи можна перейти до наступного кроку
    if (canNavigateBetweenSteps(currentStep, nextStep, state)) {
      return nextStep;
    }

    return null;
  }

  // Наступний крок в підвізарді предметів
  if (itemSubsteps.includes(currentStep)) {
    const currentIndex = itemSubsteps.indexOf(currentStep);

    // Якщо це останній підкрок, повертаємось до менеджера предметів
    if (currentIndex === itemSubsteps.length - 1) {
      return WizardStep.ITEM_MANAGER;
    }

    // Наступний підкрок
    const nextStep = itemSubsteps[currentIndex + 1];

    if (canNavigateBetweenSteps(currentStep, nextStep, state)) {
      return nextStep;
    }

    return null;
  }

  return null;
};
