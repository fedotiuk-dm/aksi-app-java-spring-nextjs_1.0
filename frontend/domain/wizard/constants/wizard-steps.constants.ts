/**
 * @fileoverview Константи кроків wizard
 * @module domain/wizard/constants/wizard-steps
 *
 * Відповідальність: управління конфігурацією кроків wizard
 * - Порядок кроків
 * - Лейбли та описи кроків
 * - Конфігурація кроків
 */

import { WizardStep, ItemWizardStep } from '../types';

// ========================================
// ПОРЯДОК КРОКІВ
// ========================================

/**
 * Порядок основних кроків wizard
 */
export const WIZARD_STEPS_ORDER: WizardStep[] = [
  WizardStep.CLIENT_SELECTION,
  WizardStep.BRANCH_SELECTION,
  WizardStep.ITEM_MANAGER,
  WizardStep.ORDER_PARAMETERS,
  WizardStep.CONFIRMATION,
] as const;

/**
 * Порядок підкроків Item Wizard
 */
export const ITEM_WIZARD_STEPS_ORDER: ItemWizardStep[] = [
  ItemWizardStep.BASIC_INFO,
  ItemWizardStep.PROPERTIES,
  ItemWizardStep.DEFECTS,
  ItemWizardStep.PRICING,
  ItemWizardStep.PHOTOS,
] as const;

// ========================================
// ЛЕЙБЛИ ТА ОПИСИ КРОКІВ
// ========================================

/**
 * Лейбли основних кроків wizard
 */
export const WIZARD_STEP_LABELS: Record<WizardStep, string> = {
  [WizardStep.CLIENT_SELECTION]: 'Вибір клієнта',
  [WizardStep.BRANCH_SELECTION]: 'Вибір філії',
  [WizardStep.ITEM_MANAGER]: 'Управління предметами',
  [WizardStep.ORDER_PARAMETERS]: 'Параметри замовлення',
  [WizardStep.CONFIRMATION]: 'Підтвердження',
  [WizardStep.COMPLETED]: 'Завершено',
} as const;

/**
 * Лейбли підкроків Item Wizard
 */
export const ITEM_WIZARD_STEP_LABELS: Record<ItemWizardStep, string> = {
  [ItemWizardStep.BASIC_INFO]: 'Основна інформація',
  [ItemWizardStep.PROPERTIES]: 'Властивості предмета',
  [ItemWizardStep.DEFECTS]: 'Дефекти та плями',
  [ItemWizardStep.PRICING]: 'Розрахунок ціни',
  [ItemWizardStep.PHOTOS]: 'Фотодокументація',
} as const;

/**
 * Описи основних кроків wizard
 */
export const WIZARD_STEP_DESCRIPTIONS: Record<WizardStep, string> = {
  [WizardStep.CLIENT_SELECTION]: 'Оберіть існуючого клієнта або створіть нового',
  [WizardStep.BRANCH_SELECTION]: 'Оберіть філію для оформлення замовлення',
  [WizardStep.ITEM_MANAGER]: 'Додайте предмети до замовлення',
  [WizardStep.ORDER_PARAMETERS]: 'Встановіть параметри виконання та оплати',
  [WizardStep.CONFIRMATION]: 'Перевірте та підтвердіть замовлення',
  [WizardStep.COMPLETED]: 'Завершено',
} as const;

// ========================================
// КОНФІГУРАЦІЯ КРОКІВ
// ========================================

/**
 * Обов'язкові кроки для завершення wizard
 */
export const REQUIRED_STEPS: WizardStep[] = [
  WizardStep.CLIENT_SELECTION,
  WizardStep.BRANCH_SELECTION,
  WizardStep.ITEM_MANAGER,
  WizardStep.CONFIRMATION,
] as const;

/**
 * Обов'язкові підкроки для Item Wizard
 */
export const REQUIRED_ITEM_STEPS: ItemWizardStep[] = [
  ItemWizardStep.BASIC_INFO,
  ItemWizardStep.PROPERTIES,
  ItemWizardStep.PRICING,
] as const;

/**
 * Кроки з можливими незбереженими змінами
 */
export const STEPS_WITH_UNSAVED_CHANGES: WizardStep[] = [
  WizardStep.CLIENT_SELECTION,
  WizardStep.ITEM_MANAGER,
  WizardStep.ORDER_PARAMETERS,
] as const;

/**
 * Кроки з валідацією на сервері
 */
export const STEPS_WITH_API_VALIDATION: WizardStep[] = [
  WizardStep.CLIENT_SELECTION,
  WizardStep.BRANCH_SELECTION,
  WizardStep.ITEM_MANAGER,
] as const;
