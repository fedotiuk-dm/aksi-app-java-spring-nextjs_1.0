import { WizardEntity } from '../entities/wizard.entity';
import { WizardDomainEvent } from '../types';

/**
 * Wizard State Store
 * Спеціалізований store для управління основним станом wizard
 *
 * SOLID принципи:
 * - Single Responsibility: тільки управління станом wizard entity
 * - Interface Segregation: мінімальний API для стану
 * - Open/Closed: легко розширюється новими властивостями стану
 */

/**
 * Стан Wizard State Store
 */
export interface WizardStateStore {
  // Основна доменна сутність
  wizard: WizardEntity | null;

  // Допоміжні стани
  isInitialized: boolean;
  lastError: string | null;

  // Метадані
  lastSavedAt: number | null;
  sessionId: string;
}

/**
 * Дії Wizard State Store
 */
export interface WizardStateActions {
  // Управління wizard entity
  setWizard: (wizard: WizardEntity | null) => void;

  // Управління станом ініціалізації
  setInitialized: (isInitialized: boolean) => void;

  // Управління помилками
  setError: (error: string | null) => void;

  // Оновлення метаданих
  updateLastSaved: () => void;

  // Отримання доменних подій
  getEvents: () => readonly WizardDomainEvent[];
  clearEvents: () => void;

  // Валідація стану
  isValidState: () => boolean;
}

/**
 * Повний інтерфейс Wizard State Store
 */
export type WizardStateStoreType = WizardStateStore & WizardStateActions;

/**
 * Domain Service: генерація унікального ID сесії
 */
export const generateSessionId = (): string => {
  return `wizard-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Factory Method: створення початкового стану
 */
export const createInitialWizardState = (): WizardStateStore => ({
  wizard: null,
  isInitialized: false,
  lastError: null,
  lastSavedAt: null,
  sessionId: generateSessionId(),
});

/**
 * Helper: перевірка валідності стану wizard
 */
export const validateWizardState = (state: WizardStateStore): boolean => {
  // Базова валідація стану
  if (state.isInitialized && !state.wizard) {
    return false;
  }

  return Boolean(state.sessionId);
};
