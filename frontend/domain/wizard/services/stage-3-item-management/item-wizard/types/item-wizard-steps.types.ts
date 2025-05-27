/**
 * @fileoverview Типи кроків item wizard
 * @module domain/wizard/services/stage-3-item-management/item-wizard/types/item-wizard-steps
 */

/**
 * Кроки item wizard згідно з документацією
 */
export enum ItemWizardStep {
  BASIC_INFO = 'basic-info', // 2.1: Основна інформація
  CHARACTERISTICS = 'characteristics', // 2.2: Характеристики
  DEFECTS_RISKS = 'defects-risks', // 2.3: Забруднення, дефекти та ризики
  PRICE_CALCULATION = 'price-calculation', // 2.4: Знижки та надбавки (калькулятор)
  PHOTO_DOCUMENTATION = 'photo-documentation', // 2.5: Фотодокументація
}

/**
 * Статус кроку wizard
 */
export enum ItemWizardStepStatus {
  NOT_STARTED = 'not-started',
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed',
  ERROR = 'error',
}

/**
 * Інформація про крок wizard
 */
export interface ItemWizardStepInfo {
  step: ItemWizardStep;
  status: ItemWizardStepStatus;
  isAccessible: boolean;
  isCompleted: boolean;
  errorMessage?: string;
}
