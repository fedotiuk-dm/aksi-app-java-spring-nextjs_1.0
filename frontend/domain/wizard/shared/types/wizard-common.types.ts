/**
 * Загальні типи для Order Wizard
 * Використовуються у всіх кроках та модулях
 */

// Основні стани wizard
export enum WizardStep {
  CLIENT_SELECTION = 'clientSelection',
  BRANCH_SELECTION = 'branchSelection',
  ITEM_MANAGER = 'itemManager',
  ORDER_PARAMETERS = 'orderParameters',
  ORDER_CONFIRMATION = 'orderConfirmation',
}

// Підстани Item Wizard (в рамках ITEM_MANAGER)
export enum ItemWizardStep {
  ITEM_BASIC_INFO = 'itemBasicInfo',
  ITEM_PROPERTIES = 'itemProperties',
  DEFECTS_STAINS = 'defectsStains',
  PRICE_CALCULATOR = 'priceCalculator',
  PHOTO_DOCUMENTATION = 'photoDocumentation',
}

// Режим роботи wizard
export enum WizardMode {
  CREATE = 'create',
  EDIT = 'edit',
  VIEW = 'view',
}

// Статус валідації кроку
export enum ValidationStatus {
  PENDING = 'pending',
  VALID = 'valid',
  INVALID = 'invalid',
  NOT_VALIDATED = 'notValidated',
}

// Базовий інтерфейс для кроків
export interface WizardStepState {
  isValid: boolean;
  isComplete: boolean;
  validationStatus: ValidationStatus;
  errors: string[];
  lastValidated: Date | null;
}

// Метадані wizard
export interface WizardMetadata {
  startedAt: string;
  lastUpdated?: string;
  userAgent?: string;
  sessionId?: string;
  version?: string;
}

// Контекст wizard
export interface WizardContext {
  mode: WizardMode;
  orderId?: string;
  customerId?: string;
  metadata: WizardMetadata;
}

// Результат операції
export interface WizardOperationResult<T = void> {
  success: boolean;
  data?: T;
  errors?: string[];
  warnings?: string[];
}

// Стан збереження
export interface SaveState {
  isDraft: boolean;
  autoSaveEnabled: boolean;
  lastSaved: Date | null;
  hasUnsavedChanges: boolean;
}
