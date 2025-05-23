/**
 * Wizard Steps Types
 * Типи пов'язані з кроками та навігацією wizard
 *
 * SOLID принципи:
 * - Single Responsibility: тільки типи кроків та навігації
 * - Interface Segregation: малі специфічні інтерфейси
 */

/**
 * Основні етапи Order Wizard для послуги хімчистки
 *
 * Бізнес-логіка:
 * 1. Клієнт приходить до хімчистки
 * 2. Вибирає філію обслуговування
 * 3. Додає речі через Item Wizard (таблиця предметів)
 * 4. Налаштовує параметри замовлення
 * 5. Підтверджує замовлення
 */
export enum WizardStep {
  // 🎯 5 основних етапів замовлення хімчистки
  CLIENT_SELECTION = 'client-selection', // 1. Вибір клієнта
  BRANCH_SELECTION = 'branch-selection', // 2. Вибір філії
  ITEM_MANAGER = 'item-manager', // 3. Управління предметами (таблиця)
  ORDER_PARAMETERS = 'order-parameters', // 4. Параметри замовлення
  ORDER_CONFIRMATION = 'order-confirmation', // 5. Підтвердження замовлення

  // 👕 5 підетапів конфігурації кожної речі (Item Wizard)
  // Виконується для кожного предмету окремо, після завершення повертаємось до ITEM_MANAGER
  ITEM_BASIC_INFO = 'item-basic-info', // 1. Базова інформація про річ
  ITEM_PROPERTIES = 'item-properties', // 2. Властивості речі (тип тканини, колір)
  DEFECTS_STAINS = 'defects-stains', // 3. Дефекти та плями
  PRICE_CALCULATOR = 'price-calculator', // 4. Розрахунок вартості
  PHOTO_DOCUMENTATION = 'photo-documentation', // 5. Фотодокументація
}

/**
 * Напрямки навігації (Domain Value Objects)
 */
export enum NavigationDirection {
  FORWARD = 'forward', // Перехід до наступного кроку
  BACKWARD = 'backward', // Повернення до попереднього кроку
  JUMP = 'jump', // Прямий перехід до конкретного кроку
}

/**
 * Запис в історії переходів (Domain Value Object)
 */
export interface StepHistoryEntry {
  readonly step: WizardStep;
  readonly timestamp: number;
  readonly direction: NavigationDirection;
  readonly metadata?: Record<string, unknown>;
}

/**
 * Доступність кроків wizard (Domain Value Object)
 * Mutable для внутрішніх доменних операцій
 */
export type StepAvailability = {
  [key in WizardStep]: boolean;
};

/**
 * Конфігурація кроку wizard (Domain Entity)
 */
export interface WizardStepConfig {
  readonly id: WizardStep;
  readonly title: string;
  readonly description?: string;
  readonly icon?: string;
  readonly order: number;
  readonly isSubstep?: boolean;
  readonly parentStep?: WizardStep;
  readonly isRequired: boolean;
  readonly validationRules?: string[];
}

/**
 * Маппінг кроків до їх конфігурацій
 */
export type WizardStepConfigMap = {
  readonly [key in WizardStep]: WizardStepConfig;
};

/**
 * Результат навігації (Domain Value Object)
 */
export interface NavigationResult {
  readonly success: boolean;
  readonly fromStep: WizardStep;
  readonly toStep: WizardStep;
  readonly direction: NavigationDirection;
  readonly errors?: string[];
  readonly timestamp: number;
}
