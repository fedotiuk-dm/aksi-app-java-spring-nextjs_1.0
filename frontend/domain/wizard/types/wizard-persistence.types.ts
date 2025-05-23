/**
 * Wizard Persistence Types
 * Типи пов'язані з persistence та конфігурацією wizard
 *
 * SOLID принципи:
 * - Single Responsibility: тільки типи persistence
 * - Interface Segregation: малі специфічні інтерфейси
 */

/**
 * Налаштування persistence (Domain Configuration)
 */
export interface WizardPersistenceConfig {
  readonly storageKey: string;
  readonly enableAutoSave: boolean;
  readonly autoSaveInterval: number;
  readonly includeHistory: boolean;
  readonly maxHistoryEntries: number;
}
