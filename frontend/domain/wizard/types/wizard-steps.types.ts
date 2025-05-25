/**
 * Типи кроків wizard - доменні концепти бізнес-логіки
 *
 * Це основні бізнес-концепти які використовуються в:
 * - XState машинах
 * - Zustand store
 * - React хуках
 * - API адаптерах
 * - Валідації
 */

/**
 * Основні кроки Order Wizard (бізнес-процес)
 */
export enum WizardStep {
  CLIENT_SELECTION = 'clientSelection', // 1. Вибір/створення клієнта
  BRANCH_SELECTION = 'branchSelection', // 2. Базова інформація замовлення (філія, квитанція)
  ITEM_MANAGER = 'itemManager', // 3. Менеджер предметів + циклічний процес
  ORDER_PARAMETERS = 'orderParameters', // 4. Параметри замовлення
  CONFIRMATION = 'confirmation', // 5. Підтвердження та квитанція
  COMPLETED = 'completed', // Завершений стан
}

/**
 * Підкроки Item Wizard (в рамках ITEM_MANAGER)
 */
export enum ItemWizardStep {
  BASIC_INFO = 'basicInfo', // 2.1: Основна інформація (категорія, найменування)
  PROPERTIES = 'properties', // 2.2: Характеристики (матеріал, колір, наповнювач)
  DEFECTS = 'defects', // 2.3: Дефекти та плями
  PRICING = 'pricing', // 2.4: Калькулятор ціни з модифікаторами
  PHOTOS = 'photos', // 2.5: Фотодокументація
}

/**
 * Тип для всіх можливих кроків
 */
export type AnyWizardStep = WizardStep | ItemWizardStep;
