import { WizardEntity } from '../../entities';
import {
  WizardPersistenceConfig,
  WizardStep,
  WizardMode,
  WizardStatus,
  WizardContext,
  StepHistoryEntry,
  StepAvailability,
} from '../../types';

/**
 * Persistence Helper
 * Helper для конфігурації persistence wizard store
 *
 * SOLID принципи:
 * - Single Responsibility: тільки persistence логіка
 * - Configuration as Code: централізована конфігурація
 */

/**
 * Типи для persistence state
 */
interface PersistedWizardState {
  wizard: {
    id: string;
    currentStep: WizardStep;
    mode: WizardMode;
    status: WizardStatus;
    context: WizardContext;
    stepHistory: StepHistoryEntry[];
    availability: StepAvailability;
    isItemWizardActive: boolean;
  } | null;
  isInitialized: boolean;
  lastError: string | null;
  sessionId: string;
  lastSavedAt: number | null;
}

interface WizardStoreState {
  wizard: WizardEntity | null;
  isInitialized: boolean;
  lastError: string | null;
  sessionId: string;
  lastSavedAt: number | null;
}

/**
 * Default persistence configuration
 */
export const DEFAULT_PERSISTENCE_CONFIG: WizardPersistenceConfig = {
  storageKey: 'aksi-wizard-state',
  enableAutoSave: true,
  autoSaveInterval: 5000,
  includeHistory: true,
  maxHistoryEntries: 50,
};

/**
 * State partializer - що зберігати в localStorage
 */
export const createStatePartializer =
  () =>
  (state: WizardStoreState): PersistedWizardState => ({
    wizard: state.wizard
      ? {
          id: state.wizard.id,
          currentStep: state.wizard.currentStep,
          mode: state.wizard.mode,
          status: state.wizard.status,
          context: state.wizard.context,
          stepHistory: [...state.wizard.stepHistory],
          availability: state.wizard.availability,
          isItemWizardActive: state.wizard.isItemWizardActive,
        }
      : null,
    isInitialized: state.isInitialized,
    lastError: state.lastError,
    sessionId: state.sessionId,
    lastSavedAt: state.lastSavedAt,
  });

/**
 * Rehydration handler - як відновлювати стан
 */
export const createRehydrationHandler =
  () =>
  () =>
  (state: PersistedWizardState, _error?: unknown): void => {
    if (state?.wizard) {
      const data = state.wizard;
      // Створюємо новий WizardEntity з відновлених даних
      const restoredWizard = new WizardEntity(
        data.id,
        data.currentStep,
        data.mode,
        data.status,
        data.context,
        data.stepHistory || [],
        data.availability,
        data.isItemWizardActive || false
      );

      // Оновлюємо wizard в state
      (state as unknown as WizardStoreState).wizard = restoredWizard;
    }
  };

/**
 * Complete persistence configuration factory
 */
export const createPersistenceConfig = (config: Partial<WizardPersistenceConfig> = {}) => {
  const finalConfig = { ...DEFAULT_PERSISTENCE_CONFIG, ...config };

  return {
    name: finalConfig.storageKey,
    partialize: createStatePartializer(),
    onRehydrateStorage: createRehydrationHandler(),
  };
};
