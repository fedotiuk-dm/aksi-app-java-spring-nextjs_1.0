import { NavigationState, WizardStep } from './navigation.types';

/**
 * Початковий стан доступності кроків
 */
const initialStepAvailability = {
  [WizardStep.CLIENT_SELECTION]: true, // Перший крок завжди доступний
  [WizardStep.BRANCH_SELECTION]: false, // Буде доступний після вибору клієнта
  [WizardStep.BASIC_INFO]: false,
  [WizardStep.ITEM_MANAGER]: false,
  [WizardStep.ORDER_PARAMETERS]: false,
  [WizardStep.ORDER_CONFIRMATION]: false,

  // Підкроки візарда предметів спочатку недоступні
  [WizardStep.ITEM_BASIC_INFO]: false,
  [WizardStep.ITEM_PROPERTIES]: false,
  [WizardStep.DEFECTS_STAINS]: false,
  [WizardStep.PRICE_CALCULATOR]: false,
  [WizardStep.PHOTO_DOCUMENTATION]: false,
};

/**
 * Початковий стан навігації
 */
export const initialNavigationState: NavigationState = {
  currentStep: WizardStep.CLIENT_SELECTION, // Початковий крок - вибір клієнта
  stepHistory: [
    {
      step: WizardStep.CLIENT_SELECTION,
      timestamp: Date.now(),
    },
  ],
  availability: initialStepAvailability,
  isItemWizardActive: false, // Візард предметів спочатку неактивний
  isBackAllowed: false, // На першому кроці немає куди вертатися
  isForwardAllowed: false, // Поки не заповнені дані, не можна йти далі
};
