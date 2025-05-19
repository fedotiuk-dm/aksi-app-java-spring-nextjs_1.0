/**
 * Типи для управління станом Order Wizard
 */

/**
 * Типи етапів Order Wizard
 */
export type WizardMainStep =
  | 'client-selection'     // Етап 1: Вибір клієнта
  | 'basic-info'          // Етап 2: Основна інформація замовлення
  | 'item-manager'        // Етап 3: Менеджер предметів
  | 'item-wizard';        // Етап 4: Візард додавання/редагування предмета - циклічний процес.

/**
 * Типи підетапів для візарда предметів (Етап 4)
 */
export type ItemWizardSubStep =
  | 'basic-info'           // Підетап 1: Основна інформація предмета
  | 'item-properties'      // Підетап 2: Властивості предмета
  | 'defects-stains'       // Підетап 3: Дефекти та плями
  | 'price-calculator'     // Підетап 4: Калькулятор ціни
  | 'photo-documentation'; // Підетап 5: Фотодокументація

/**
 * Статус валідації для кроку
 */
export type StepValidationStatus =
  | 'not-validated'      // Крок ще не валідувався
  | 'valid'              // Крок валідний
  | 'invalid';           // Крок невалідний

/**
 * Інтерфейс для інформації про крок
 */
export interface WizardStepInfo {
  title: string;          // Заголовок кроку
  description: string;    // Опис кроку
  validationStatus: StepValidationStatus; // Статус валідації кроку
}

/**
 * Інтерфейс конфігурації кроків візарда
 */
export interface WizardStepsConfig {
  mainSteps: Record<WizardMainStep, WizardStepInfo>;
  itemSubSteps: Record<ItemWizardSubStep, WizardStepInfo>;
}

/**
 * Інтерфейс поточного стану кроку візарда
 */
export interface WizardCurrentStep {
  mainStep: WizardMainStep;
  itemSubStep: ItemWizardSubStep | null;
}

/**
 * Історія кроків для навігації назад
 */
export interface WizardHistory {
  steps: WizardCurrentStep[];
  currentIndex: number;
}

/**
 * Стан стору візарда
 */
export interface WizardState {
  // Поточний крок
  currentStep: WizardCurrentStep;
  // Конфігурація кроків
  stepsConfig: WizardStepsConfig;
  // Історія кроків для навігації назад
  history: WizardHistory;
  // Статус збереження візарда
  isSaving: boolean;
  // Помилки візарда
  error: string | null;
}

/**
 * Типи дій для модуля візарда
 */
export interface WizardActions {
  // Навігація
  goToStep: (mainStep: WizardMainStep, itemSubStep?: ItemWizardSubStep | null) => void;
  goToNextMainStep: () => void;
  goToPreviousMainStep: () => void;
  goToNextItemSubStep: () => void;
  goToPreviousItemSubStep: () => void;

  // Валідація
  setStepValidationStatus: (
    mainStep: WizardMainStep,
    status: StepValidationStatus,
    itemSubStep?: ItemWizardSubStep
  ) => void;

  // Скидання стану
  resetWizard: () => void;

  // Обробка помилок
  setError: (error: string | null) => void;
}

/**
 * Повний стор візарда
 */
export interface WizardStore extends WizardState, WizardActions {}
