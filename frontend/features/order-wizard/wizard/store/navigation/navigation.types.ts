/**
 * Перелік усіх можливих кроків в OrderWizard
 */
export enum WizardStep {
  // Основні кроки візарда
  CLIENT_SELECTION = 'client-selection',
  BRANCH_SELECTION = 'branch-selection',
  BASIC_INFO = 'basic-info',
  ITEM_MANAGER = 'item-manager',
  ORDER_PARAMETERS = 'order-parameters',
  ORDER_CONFIRMATION = 'order-confirmation',

  // Підкроки візарда предметів
  ITEM_BASIC_INFO = 'item-basic-info',
  ITEM_PROPERTIES = 'item-properties',
  DEFECTS_STAINS = 'defects-stains',
  PRICE_CALCULATOR = 'price-calculator',
  PHOTO_DOCUMENTATION = 'photo-documentation',
}

/**
 * Типи для історії переходів між кроками
 */
export type StepHistoryEntry = {
  step: WizardStep;
  timestamp: number;
};

/**
 * Стан доступності кроків
 */
export type StepAvailability = {
  [key in WizardStep]: boolean;
};

/**
 * Стан системи навігації між кроками
 */
export interface NavigationState {
  currentStep: WizardStep;
  stepHistory: StepHistoryEntry[];
  availability: StepAvailability;
  isItemWizardActive: boolean;
  isBackAllowed: boolean;
  isForwardAllowed: boolean;
}

/**
 * Дії, які можна виконувати з навігацією
 */
export type NavigationActions = {
  goToStep: (step: WizardStep) => void;
  goBack: () => void;
  goForward: () => void;
  startItemWizard: () => void;
  finishItemWizard: (saveItem: boolean) => void;
  updateStepAvailability: (step: WizardStep, isAvailable: boolean) => void;
  resetNavigation: () => void;
};

/**
 * Повний тип стору навігації
 */
export type NavigationStore = NavigationState & NavigationActions;
