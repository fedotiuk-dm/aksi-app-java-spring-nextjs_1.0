/**
 * Загальні типи для Order Wizard, які використовуються
 * в різних модулях та компонентах
 */

/**
 * Структура кроку wizard для відображення у навігації
 */
export interface WizardStepConfig {
  id: string;              // Ідентифікатор кроку
  title: string;           // Назва кроку для відображення
  description?: string;    // Опис кроку
  icon?: string;           // Іконка кроку
  order: number;           // Порядковий номер для відображення
  isSubstep?: boolean;     // Чи є підкроком
  parentStep?: string;     // Посилання на батьківський крок (для підкроків)
}

/**
 * Загальні статуси для різних станів у Wizard
 */
export enum WizardStatus {
  IDLE = 'idle',
  LOADING = 'loading',
  SUBMITTING = 'submitting',
  SUCCESS = 'success',
  ERROR = 'error'
}

/**
 * Тип режиму для OrderWizard
 */
export enum WizardMode {
  CREATE = 'create',  // Режим створення нового замовлення
  EDIT = 'edit'       // Режим редагування існуючого замовлення
}

/**
 * Базовий інтерфейс для сторів кроків
 */
export interface BaseStepStore {
  status: WizardStatus;
  setStatus: (status: WizardStatus) => void;
  reset: () => void;
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: (value: boolean) => void;
}
