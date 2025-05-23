import { WizardEntity } from '../../entities';
import {
  WizardStep,
  WizardMode,
  WizardStatus,
  WizardContext,
  NavigationResult,
  WizardDomainEvent,
} from '../../types';

/**
 * Store Actions Types
 * Типізовані інтерфейси для всіх store actions
 *
 * SOLID принципи:
 * - Single Responsibility: тільки типізація store actions
 * - Interface Segregation: окремі інтерфейси для різних груп дій
 */

/**
 * State Management Actions Types
 */
export interface WizardStateActions {
  setWizard: (wizard: WizardEntity | null) => void;
  setInitialized: (isInitialized: boolean) => void;
  setError: (error: string | null) => void;
  updateLastSaved: () => void;
  getEvents: () => readonly WizardDomainEvent[];
  clearEvents: () => void;
  isValidState: () => boolean;
}

/**
 * Navigation Actions Types
 */
export interface WizardNavigationStoreActions {
  goToStep: (step: WizardStep) => NavigationResult;
  goBack: () => NavigationResult;
  goForward: () => NavigationResult;
  validateStep: (step: WizardStep) => boolean;
  calculateProgress: () => number;
}

/**
 * Item Wizard Actions Types
 */
export interface WizardItemStoreActions {
  startItemWizard: () => void;
  finishItemWizard: (saveItem: boolean) => void;
  isItemWizardAllowed: () => boolean;
  getItemWizardStatus: () => 'active' | 'inactive' | 'blocked';
}

/**
 * Management Actions Types
 */
export interface WizardManagementStoreActions {
  initialize: (context: WizardContext) => void;
  reset: () => void;
  updateStepAvailability: (step: WizardStep, isAvailable: boolean) => void;
  changeMode: (mode: WizardMode) => void;
  updateStatus: (status: WizardStatus) => void;
}

/**
 * Complete Store Actions Type
 */
export type WizardStoreActions = WizardStateActions &
  WizardNavigationStoreActions &
  WizardItemStoreActions &
  WizardManagementStoreActions;
