/**
 * Wizard State Types
 * Типи пов'язані зі станом та режимами wizard
 *
 * SOLID принципи:
 * - Single Responsibility: тільки типи стану wizard
 * - Interface Segregation: малі специфічні інтерфейси
 */

/**
 * Режими роботи wizard (Domain Value Objects)
 */
export enum WizardMode {
  CREATE = 'create', // Створення нового замовлення
  EDIT = 'edit', // Редагування існуючого замовлення
  VIEW = 'view', // Перегляд замовлення (read-only)
}

/**
 * Статуси wizard (Domain Value Objects)
 */
export enum WizardStatus {
  IDLE = 'idle', // Очікування дій користувача
  LOADING = 'loading', // Завантаження даних
  VALIDATING = 'validating', // Валідація поточного кроку
  SUBMITTING = 'submitting', // Збереження даних
  SUCCESS = 'success', // Успішне виконання операції
  ERROR = 'error', // Помилка виконання
}

/**
 * Контекст wizard (Domain Aggregate Root)
 */
export interface WizardContext {
  readonly mode: WizardMode;
  readonly orderId?: string;
  readonly customerId?: string;
  readonly branchId?: string;
  readonly metadata: Record<string, unknown>;
}
