/**
 * @fileoverview Загальні типи та енуми для Order Wizard Domain
 * @module domain/wizard/shared/types
 * @author AKSI Team
 * @since 1.0.0
 *
 * @description
 * Центральне місце для всіх типів, енумів та інтерфейсів які використовуються
 * в різних модулях Order Wizard. Забезпечує type safety та узгодженість
 * між компонентами.
 *
 * Типи покривають:
 * - Основні стани wizard та підстани Item Wizard
 * - Режими роботи та статуси валідації
 * - Метадані та контекст wizard
 * - Результати операцій та стан збереження
 */

/**
 * Основні стани Order Wizard згідно з документацією
 *
 * @enum {string}
 * @readonly
 * @description
 * П'ять основних етапів Order Wizard процесу оформлення замовлення:
 * 1. CLIENT_SELECTION - вибір або створення клієнта + базова інформація
 * 2. BRANCH_SELECTION - вибір філії та ініціація замовлення на бекенді
 * 3. ITEM_MANAGER - управління предметами замовлення (циклічний процес)
 * 4. ORDER_PARAMETERS - параметри замовлення (дати, знижки, оплата)
 * 5. ORDER_CONFIRMATION - підтвердження та завершення з формуванням квитанції
 *
 * @example
 * // Перевірка поточного кроку
 * if (currentStep === WizardStep.CLIENT_SELECTION) {
 *   console.log('Користувач вибирає клієнта');
 * }
 *
 * @example
 * // Маппінг кроків до UI компонентів
 * const stepComponents = {
 *   [WizardStep.CLIENT_SELECTION]: ClientSelectionStep,
 *   [WizardStep.BRANCH_SELECTION]: BranchSelectionStep,
 *   [WizardStep.ITEM_MANAGER]: ItemManagerStep,
 *   [WizardStep.ORDER_PARAMETERS]: OrderParametersStep,
 *   [WizardStep.ORDER_CONFIRMATION]: ConfirmationStep,
 * };
 *
 * @since 1.0.0
 */
export enum WizardStep {
  /** Етап 1: Вибір або створення клієнта + базова інформація замовлення */
  CLIENT_SELECTION = 'clientSelection',
  /** Етап 2: Вибір філії та ініціація замовлення на бекенді */
  BRANCH_SELECTION = 'branchSelection',
  /** Етап 3: Управління предметами замовлення (циклічний Item Wizard) */
  ITEM_MANAGER = 'itemManager',
  /** Етап 4: Параметри замовлення (дати, знижки, оплата) */
  ORDER_PARAMETERS = 'orderParameters',
  /** Етап 5: Підтвердження та завершення з формуванням квитанції */
  ORDER_CONFIRMATION = 'orderConfirmation',
}

/**
 * Підстани Item Wizard в рамках ITEM_MANAGER кроку
 *
 * @enum {string}
 * @readonly
 * @description
 * П'ять кроків циклічного процесу додавання предмета до замовлення:
 * 1. ITEM_BASIC_INFO - категорія послуги, найменування виробу, кількість
 * 2. ITEM_PROPERTIES - матеріал, колір, наповнювач, ступінь зносу
 * 3. DEFECTS_STAINS - плями, дефекти, ризики, примітки
 * 4. PRICE_CALCULATOR - модифікатори, коефіцієнти, розрахунок ціни
 * 5. PHOTO_DOCUMENTATION - завантаження та обробка фото предмета
 *
 * @example
 * // Навігація в Item Wizard
 * const nextItemStep = {
 *   [ItemWizardStep.ITEM_BASIC_INFO]: ItemWizardStep.ITEM_PROPERTIES,
 *   [ItemWizardStep.ITEM_PROPERTIES]: ItemWizardStep.DEFECTS_STAINS,
 *   // ... інші переходи
 * };
 *
 * @since 1.0.0
 */
export enum ItemWizardStep {
  /** Підетап 2.1: Категорія послуги, найменування виробу, кількість */
  ITEM_BASIC_INFO = 'itemBasicInfo',
  /** Підетап 2.2: Матеріал, колір, наповнювач, ступінь зносу */
  ITEM_PROPERTIES = 'itemProperties',
  /** Підетап 2.3: Плями, дефекти, ризики, примітки */
  DEFECTS_STAINS = 'defectsStains',
  /** Підетап 2.4: Модифікатори, коефіцієнти, розрахунок ціни */
  PRICE_CALCULATOR = 'priceCalculator',
  /** Підетап 2.5: Завантаження та обробка фото предмета */
  PHOTO_DOCUMENTATION = 'photoDocumentation',
}

/**
 * Режим роботи wizard
 *
 * @enum {string}
 * @readonly
 * @description
 * Визначає поведінку wizard в залежності від сценарію використання
 *
 * @example
 * // Різна поведінка залежно від режиму
 * const config = {
 *   [WizardMode.CREATE]: { autoSave: true, validation: 'strict' },
 *   [WizardMode.EDIT]: { autoSave: false, validation: 'relaxed' },
 *   [WizardMode.VIEW]: { readonly: true, navigation: false }
 * };
 *
 * @since 1.0.0
 */
export enum WizardMode {
  /** Створення нового замовлення */
  CREATE = 'create',
  /** Редагування існуючого замовлення */
  EDIT = 'edit',
  /** Перегляд замовлення (read-only) */
  VIEW = 'view',
}

/**
 * Статус валідації кроку
 *
 * @enum {string}
 * @readonly
 * @description
 * Відображає поточний стан валідації даних кроку для UI індикаторів
 *
 * @example
 * // UI індикатор на основі статусу
 * const getStepIcon = (status: ValidationStatus) => {
 *   switch (status) {
 *     case ValidationStatus.VALID: return '✅';
 *     case ValidationStatus.INVALID: return '❌';
 *     case ValidationStatus.PENDING: return '⏳';
 *     default: return '⚪';
 *   }
 * };
 *
 * @since 1.0.0
 */
export enum ValidationStatus {
  /** Валідація в процесі */
  PENDING = 'pending',
  /** Дані валідні */
  VALID = 'valid',
  /** Дані невалідні */
  INVALID = 'invalid',
  /** Валідація ще не запускалась */
  NOT_VALIDATED = 'notValidated',
}

/**
 * Базовий інтерфейс для стану кроку wizard
 *
 * @interface WizardStepState
 * @description
 * Спільний контракт для всіх кроків wizard, забезпечує узгоджену
 * поведінку валідації та готовності до переходу
 *
 * @property {boolean} isValid - Чи пройшов крок валідацію
 * @property {boolean} isComplete - Чи завершений крок (можна переходити далі)
 * @property {ValidationStatus} validationStatus - Поточний статус валідації
 * @property {string[]} errors - Список помилок валідації
 * @property {Date | null} lastValidated - Час останньої валідації
 *
 * @example
 * // Реалізація в конкретному кроці
 * interface ClientStepState extends WizardStepState {
 *   selectedClientId: string | null;
 *   searchResults: Client[];
 * }
 *
 * @since 1.0.0
 */
export interface WizardStepState {
  /** Чи пройшов крок валідацію */
  isValid: boolean;
  /** Чи завершений крок (можна переходити далі) */
  isComplete: boolean;
  /** Поточний статус валідації */
  validationStatus: ValidationStatus;
  /** Список помилок валідації */
  errors: string[];
  /** Час останньої валідації */
  lastValidated: Date | null;
}

/**
 * Метадані wizard для аналітики та діагностики
 *
 * @interface WizardMetadata
 * @description
 * Службова інформація про сесію wizard для логування,
 * аналітики та діагностики проблем
 *
 * @property {string} startedAt - ISO дата початку wizard
 * @property {string} [lastUpdated] - ISO дата останнього оновлення
 * @property {string} [userAgent] - User agent браузера
 * @property {string} [sessionId] - Ідентифікатор сесії
 * @property {string} [version] - Версія додатку
 *
 * @example
 * const metadata: WizardMetadata = {
 *   startedAt: new Date().toISOString(),
 *   userAgent: navigator.userAgent,
 *   sessionId: generateSessionId(),
 *   version: process.env.NEXT_PUBLIC_VERSION
 * };
 *
 * @since 1.0.0
 */
export interface WizardMetadata {
  /** ISO дата початку wizard */
  startedAt: string;
  /** ISO дата останнього оновлення */
  lastUpdated?: string;
  /** User agent браузера */
  userAgent?: string;
  /** Ідентифікатор сесії */
  sessionId?: string;
  /** Версія додатку */
  version?: string;
}

/**
 * Контекст wizard з глобальною інформацією
 *
 * @interface WizardContext
 * @description
 * Глобальний контекст який передається через всі кроки wizard
 * і містить інформацію про режим роботи та ідентифікатори
 *
 * @property {WizardMode} mode - Режим роботи wizard
 * @property {string} [orderId] - ID замовлення (для режиму EDIT)
 * @property {string} [customerId] - ID клієнта (для швидкого заповнення)
 * @property {WizardMetadata} metadata - Метадані сесії
 *
 * @example
 * // Створення контексту для нового замовлення
 * const context: WizardContext = {
 *   mode: WizardMode.CREATE,
 *   metadata: {
 *     startedAt: new Date().toISOString(),
 *     sessionId: generateId()
 *   }
 * };
 *
 * @since 1.0.0
 */
export interface WizardContext {
  /** Режим роботи wizard */
  mode: WizardMode;
  /** ID замовлення (для режиму EDIT) */
  orderId?: string;
  /** ID клієнта (для швидкого заповнення) */
  customerId?: string;
  /** Метадані сесії */
  metadata: WizardMetadata;
}

/**
 * Результат операції wizard з типізацією
 *
 * @template T - Тип даних результату
 * @interface WizardOperationResult
 * @description
 * Стандартизований формат результату для всіх операцій wizard,
 * забезпечує узгоджену обробку успішних результатів та помилок
 *
 * @property {boolean} success - Чи успішна операція
 * @property {T} [data] - Дані результату (якщо операція успішна)
 * @property {string[]} [errors] - Критичні помилки
 * @property {string[]} [warnings] - Попередження (не блокують операцію)
 *
 * @example
 * // Результат збереження кроку
 * const saveResult: WizardOperationResult<SavedStep> = {
 *   success: true,
 *   data: { stepId: 'client-selection', savedAt: new Date() },
 *   warnings: ['Деякі поля не заповнені']
 * };
 *
 * @example
 * // Результат з помилкою
 * const errorResult: WizardOperationResult = {
 *   success: false,
 *   errors: ['Клієнт не обраний', 'Телефон обов\'язковий']
 * };
 *
 * @since 1.0.0
 */
export interface WizardOperationResult<T = void> {
  /** Чи успішна операція */
  success: boolean;
  /** Дані результату (якщо операція успішна) */
  data?: T;
  /** Критичні помилки */
  errors?: string[];
  /** Попередження (не блокують операцію) */
  warnings?: string[];
}

/**
 * Стан автозбереження wizard
 *
 * @interface SaveState
 * @description
 * Управління збереженням чернетки замовлення та відстеженням
 * незбережених змін для попередження втрати даних
 *
 * @property {boolean} isDraft - Чи є замовлення чернеткою
 * @property {boolean} autoSaveEnabled - Чи увімкнено автозбереження
 * @property {Date | null} lastSaved - Час останнього збереження
 * @property {boolean} hasUnsavedChanges - Чи є незбережені зміни
 *
 * @example
 * // Перевірка перед закриттям
 * if (saveState.hasUnsavedChanges) {
 *   const confirmed = confirm('Є незбережені зміни. Продовжити?');
 *   if (!confirmed) return;
 * }
 *
 * @since 1.0.0
 */
export interface SaveState {
  /** Чи є замовлення чернеткою */
  isDraft: boolean;
  /** Чи увімкнено автозбереження */
  autoSaveEnabled: boolean;
  /** Час останнього збереження */
  lastSaved: Date | null;
  /** Чи є незбережені зміни */
  hasUnsavedChanges: boolean;
}
