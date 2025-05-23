import { WizardStep } from './wizard-steps.types';

/**
 * Wizard Events Types
 * Типи пов'язані з доменними подіями wizard
 *
 * SOLID принципи:
 * - Single Responsibility: тільки типи подій
 * - Interface Segregation: малі специфічні інтерфейси
 */

/**
 * Події wizard domain (Domain Events)
 */
export enum WizardEventType {
  STEP_ENTERED = 'wizard.step.entered',
  STEP_EXITED = 'wizard.step.exited',
  STEP_VALIDATED = 'wizard.step.validated',
  NAVIGATION_ATTEMPTED = 'wizard.navigation.attempted',
  NAVIGATION_COMPLETED = 'wizard.navigation.completed',
  NAVIGATION_FAILED = 'wizard.navigation.failed',
  WIZARD_STARTED = 'wizard.started',
  WIZARD_COMPLETED = 'wizard.completed',
  WIZARD_RESET = 'wizard.reset',
  ITEM_WIZARD_STARTED = 'wizard.item.started',
  ITEM_WIZARD_COMPLETED = 'wizard.item.completed',
}

/**
 * Базова структура доменної події
 */
export interface WizardDomainEvent {
  readonly type: WizardEventType;
  readonly timestamp: number;
  readonly step?: WizardStep;
  readonly payload: Record<string, unknown>;
}
