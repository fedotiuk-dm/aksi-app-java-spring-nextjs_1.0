/**
 * Лейбли та описи кроків wizard - відповідальність за UI відображення
 */

import { WizardStep, ItemWizardStep } from '../../types/common';

/**
 * Назви кроків для відображення
 */
export const WIZARD_STEP_LABELS: Record<WizardStep, string> = {
  [WizardStep.CLIENT_SELECTION]: 'Вибір клієнта',
  [WizardStep.BRANCH_SELECTION]: 'Вибір філії',
  [WizardStep.ITEM_MANAGER]: 'Управління предметами',
  [WizardStep.ORDER_PARAMETERS]: 'Параметри замовлення',
  [WizardStep.ORDER_CONFIRMATION]: 'Підтвердження',
} as const;

/**
 * Назви підкроків Item Wizard
 */
export const ITEM_WIZARD_STEP_LABELS: Record<ItemWizardStep, string> = {
  [ItemWizardStep.ITEM_BASIC_INFO]: 'Основна інформація',
  [ItemWizardStep.ITEM_PROPERTIES]: 'Властивості предмета',
  [ItemWizardStep.DEFECTS_STAINS]: 'Дефекти та плями',
  [ItemWizardStep.PRICE_CALCULATOR]: 'Розрахунок ціни',
  [ItemWizardStep.PHOTO_DOCUMENTATION]: 'Фотодокументація',
} as const;

/**
 * Короткі описи кроків
 */
export const WIZARD_STEP_DESCRIPTIONS: Record<WizardStep, string> = {
  [WizardStep.CLIENT_SELECTION]: 'Оберіть існуючого клієнта або створіть нового',
  [WizardStep.BRANCH_SELECTION]: 'Оберіть філію для оформлення замовлення',
  [WizardStep.ITEM_MANAGER]: 'Додайте предмети до замовлення',
  [WizardStep.ORDER_PARAMETERS]: 'Встановіть параметри виконання та оплати',
  [WizardStep.ORDER_CONFIRMATION]: 'Перевірте та підтвердіть замовлення',
} as const;
