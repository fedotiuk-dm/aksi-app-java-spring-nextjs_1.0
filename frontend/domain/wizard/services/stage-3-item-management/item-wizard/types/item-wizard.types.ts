/**
 * @fileoverview Типи для сервісів менеджера предметів Order Wizard
 * @module domain/wizard/services/stage-3-item-management/item-wizard/types
 */

import type { WizardOrderItem } from '../../../../adapters/order';

/**
 * Статус етапів додавання предмета
 */
export enum ItemWizardStepStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}

/**
 * Етапи додавання предмета
 */
export enum ItemWizardStep {
  BASIC_INFO = 'BASIC_INFO',
  ITEM_CHARACTERISTICS = 'ITEM_CHARACTERISTICS',
  DEFECTS_AND_RISKS = 'DEFECTS_AND_RISKS',
  PRICE_CALCULATION = 'PRICE_CALCULATION',
  PHOTO_MANAGEMENT = 'PHOTO_MANAGEMENT',
  SUMMARY = 'SUMMARY'
}

/**
 * Стан окремого етапу додавання предмета
 */
export interface ItemWizardStepState {
  /** Статус етапу */
  status: ItemWizardStepStatus;
  /** Повідомлення про помилку (якщо є) */
  error?: string;
  /** Чи доступний етап для переходу */
  isAvailable: boolean;
  /** Чи завершений етап */
  isCompleted: boolean;
}

/**
 * Загальний стан ItemWizard
 */
export interface ItemWizardState {
  /** Поточний етап */
  currentStep: ItemWizardStep;
  /** Стан кожного етапу */
  steps: Record<ItemWizardStep, ItemWizardStepState>;
  /** Поточний предмет у процесі додавання */
  currentItem?: WizardOrderItem;
  /** Список доданих предметів */
  items: WizardOrderItem[];
  /** Індикатор завантаження */
  loading: boolean;
  /** Помилка (якщо є) */
  error?: string;
}

/**
 * Результат операції з предметом
 */
export interface ItemOperationResult<T> {
  /** Успішність операції */
  success: boolean;
  /** Дані у випадку успіху */
  data?: T;
  /** Текст помилки у випадку неуспішної операції */
  error?: string;
  /** Помилки валідації за полями */
  validationErrors?: Record<string, string>;
}

/**
 * Результат валідації даних предмета
 */
export interface ItemValidationResult {
  /** Успішність валідації */
  valid: boolean;
  /** Помилки валідації за полями */
  errors: Record<string, string>;
}

/**
 * Напрямок переходу між етапами
 */
export enum ItemStepDirection {
  NEXT = 'NEXT',
  PREVIOUS = 'PREVIOUS',
  SPECIFIC = 'SPECIFIC'
}

/**
 * Результат навігації між етапами
 */
export interface ItemWizardNavigationResult {
  /** Успішність навігації */
  success: boolean;
  /** Поточний етап після навігації */
  currentStep?: ItemWizardStep;
  /** Напрямок переходу */
  direction?: ItemStepDirection;
  /** Повідомлення про помилку (якщо є) */
  error?: string;
}
