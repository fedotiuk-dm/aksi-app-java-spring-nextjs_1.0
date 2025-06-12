/**
 * @fileoverview Типи для управління Order Wizard State Machine
 *
 * Визначає інтерфейси для:
 * - Стани етапів
 * - Навігація між етапами
 * - Ініціалізація State Machine
 * - Session management
 */

/**
 * Основні етапи Order Wizard
 */
export enum WizardStage {
  STAGE1 = 'STAGE1',
  STAGE2 = 'STAGE2',
  STAGE3 = 'STAGE3',
  STAGE4 = 'STAGE4',
}

/**
 * Стани для кожного етапу
 */
export interface WizardStageStatus {
  isCompleted: boolean;
  isActive: boolean;
  isEnabled: boolean;
  hasErrors: boolean;
}

/**
 * Загальний стан Order Wizard
 */
export interface OrderWizardState {
  currentStage: WizardStage;
  stages: Record<WizardStage, WizardStageStatus>;
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
}

/**
 * Конфігурація сесій для кожного етапу
 */
export interface StageSessionConfig {
  stage1: {
    clientSearchSessionId: string | null;
    clientCreationSessionId: string | null;
    basicOrderInfoSessionId: string | null;
  };
  stage2: {
    itemManagerSessionId: string | null;
  };
  stage3: {
    executionParamsSessionId: string | null;
  };
  stage4: {
    orderReviewSessionId: string | null;
  };
}

/**
 * Дії для управління workflow
 */
export interface WizardWorkflowActions {
  // Ініціалізація
  initializeWizard: () => Promise<void>;
  resetWizard: () => void;

  // Навігація
  goToStage: (stage: WizardStage) => Promise<void>;
  completeCurrentStage: () => Promise<void>;

  // Stage 1 специфічні
  initializeStage1: () => Promise<StageSessionConfig['stage1']>;
  completeStage1: () => Promise<void>;

  // Session management
  cleanupSessions: () => Promise<void>;
}

/**
 * Повертається основним Order Wizard хуком
 */
export interface UseOrderWizardReturn {
  // Стан
  state: OrderWizardState;
  sessions: StageSessionConfig;

  // Дії
  actions: WizardWorkflowActions;

  // Статуси
  canNavigateToStage: (stage: WizardStage) => boolean;
  isStageCompleted: (stage: WizardStage) => boolean;
  isStageActive: (stage: WizardStage) => boolean;
}
