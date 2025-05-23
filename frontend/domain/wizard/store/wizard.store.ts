import { create } from 'zustand';

import { WizardContext, WizardStep, NavigationDirection } from '../types';
import { createWizardEntity } from './factories/wizard-factory';
import {
  executeNavigationSafely,
  executeSafely,
  STORE_ERRORS,
  validateWizardExists,
} from './helpers/store-error-handler';
import { WizardStoreActions } from './types/store-actions.types';
import { ITEM_WIZARD_ERRORS, canStartItemWizard } from './wizard-item.store';
import { MANAGEMENT_ERRORS, validateWizardContext } from './wizard-management.store';
import { NAVIGATION_ERRORS, createNavigationService } from './wizard-navigation.store';
import { WizardStateStore, createInitialWizardState } from './wizard-state.store';

/**
 * Optimized Wizard Store
 * Оптимізований композиційний store з SOLID принципами та строгою типізацією
 *
 * SOLID принципи:
 * - Single Responsibility: тільки композиція та координація
 * - Open/Closed: легко розширюється новими модулями
 * - DRY: уникаємо дублювання через helpers
 * - Clean Code: читабельність через delegation
 * - Type Safety: строга типізація всіх actions
 */
type WizardStore = WizardStateStore & WizardStoreActions;

/**
 * Optimized Wizard Store Implementation з строгою типізацією
 */
export const useWizardStore = create<WizardStore>((set, get): WizardStore => {
  const navigation = createNavigationService();

  // Helper для отримання контексту error handling
  const getErrorContext = () => ({
    wizard: get().wizard,
    setError: (error: string | null) => set({ lastError: error }),
    updateLastSaved: () => set({ lastSavedAt: Date.now() }),
  });

  return {
    // State (від WizardStateStore)
    ...createInitialWizardState(),

    // State Actions - строго типізовані
    setWizard: (wizard) => set({ wizard, lastSavedAt: Date.now() }),
    setInitialized: (isInitialized) => set({ isInitialized }),
    setError: (lastError) => set({ lastError }),
    updateLastSaved: () => set({ lastSavedAt: Date.now() }),

    getEvents: () => get().wizard?.getEvents() || [],
    clearEvents: () => {
      const { wizard } = get();
      wizard?.clearEvents();
    },
    isValidState: () => {
      const { wizard, isInitialized, sessionId } = get();
      return Boolean(sessionId && (!isInitialized || wizard));
    },

    // Navigation Actions - строго типізовані з executeNavigationSafely
    goToStep: (step: WizardStep) => {
      const context = getErrorContext();
      const { wizard } = context;

      if (!validateWizardExists(wizard, context.setError)) {
        return executeNavigationSafely(
          () => {
            throw new Error(STORE_ERRORS.WIZARD_NOT_INITIALIZED);
          },
          context,
          WizardStep.CLIENT_SELECTION,
          step,
          NavigationDirection.JUMP,
          NAVIGATION_ERRORS.WIZARD_NOT_INITIALIZED
        );
      }

      const fromStep = wizard.currentStep;
      return executeNavigationSafely(
        () => {
          const validation = navigation.validateNavigation(fromStep, step);
          if (!validation.canProceed) {
            throw new Error(validation.errors.join(', '));
          }
          wizard.navigateToStep(step);
        },
        context,
        fromStep,
        step,
        NavigationDirection.JUMP,
        NAVIGATION_ERRORS.NAVIGATION_FAILED
      );
    },

    goBack: () => {
      const context = getErrorContext();
      const { wizard } = context;

      if (!validateWizardExists(wizard, context.setError)) {
        return executeNavigationSafely(
          () => {
            throw new Error(STORE_ERRORS.WIZARD_NOT_INITIALIZED);
          },
          context,
          WizardStep.CLIENT_SELECTION,
          WizardStep.CLIENT_SELECTION,
          NavigationDirection.BACKWARD,
          NAVIGATION_ERRORS.WIZARD_NOT_INITIALIZED
        );
      }

      const fromStep = wizard.currentStep;
      const toStep = wizard.previousStep;

      return executeNavigationSafely(
        () => {
          if (!toStep) throw new Error(NAVIGATION_ERRORS.NO_PREVIOUS_STEP);
          wizard.goBack();
        },
        context,
        fromStep,
        toStep || fromStep,
        NavigationDirection.BACKWARD,
        NAVIGATION_ERRORS.BACK_NAVIGATION_FAILED
      );
    },

    goForward: () => {
      const context = getErrorContext();
      const { wizard } = context;

      if (!validateWizardExists(wizard, context.setError)) {
        return executeNavigationSafely(
          () => {
            throw new Error(STORE_ERRORS.WIZARD_NOT_INITIALIZED);
          },
          context,
          WizardStep.CLIENT_SELECTION,
          WizardStep.CLIENT_SELECTION,
          NavigationDirection.FORWARD,
          NAVIGATION_ERRORS.WIZARD_NOT_INITIALIZED
        );
      }

      const fromStep = wizard.currentStep;
      const toStep = navigation.getNextStep(fromStep, wizard.isItemWizardActive);

      return executeNavigationSafely(
        () => {
          if (!toStep) throw new Error(NAVIGATION_ERRORS.NO_NEXT_STEP);
          wizard.goForward();
        },
        context,
        fromStep,
        toStep || fromStep,
        NavigationDirection.FORWARD,
        NAVIGATION_ERRORS.FORWARD_NAVIGATION_FAILED
      );
    },

    validateStep: (step: WizardStep) => {
      const { wizard } = get();
      return wizard ? navigation.canNavigateToStep(step, wizard.availability) : false;
    },

    calculateProgress: () => {
      const { wizard } = get();
      return wizard
        ? navigation.calculateProgress(wizard.currentStep, wizard.isItemWizardActive)
        : 0;
    },

    // Item Wizard Actions - строго типізовані з executeSafely
    startItemWizard: () => {
      const context = getErrorContext();
      const { wizard } = context;

      if (!validateWizardExists(wizard, context.setError)) return;

      executeSafely(
        () => {
          if (!canStartItemWizard(wizard.currentStep)) {
            throw new Error(ITEM_WIZARD_ERRORS.INVALID_PARENT_STEP);
          }
          wizard.startItemWizard();
        },
        context,
        ITEM_WIZARD_ERRORS.ITEM_WIZARD_START_FAILED
      );
    },

    finishItemWizard: (saveItem: boolean) => {
      const context = getErrorContext();
      const { wizard } = context;

      if (!validateWizardExists(wizard, context.setError)) return;

      executeSafely(
        () => {
          if (!wizard.isItemWizardActive) {
            throw new Error(ITEM_WIZARD_ERRORS.NOT_ACTIVE);
          }
          wizard.finishItemWizard(saveItem);
        },
        context,
        ITEM_WIZARD_ERRORS.ITEM_WIZARD_FINISH_FAILED
      );
    },

    isItemWizardAllowed: () => {
      const { wizard } = get();
      return wizard ? canStartItemWizard(wizard.currentStep) : false;
    },

    getItemWizardStatus: () => {
      const { wizard } = get();
      if (!wizard) return 'blocked';
      if (wizard.isItemWizardActive) return 'active';
      return canStartItemWizard(wizard.currentStep) ? 'inactive' : 'blocked';
    },

    // Management Actions - строго типізовані з executeSafely
    initialize: (context: WizardContext) => {
      const errorContext = getErrorContext();

      executeSafely(
        () => {
          const validation = validateWizardContext(context);
          if (!validation.valid) {
            throw new Error(
              `${MANAGEMENT_ERRORS.INVALID_CONTEXT}: ${validation.errors.join(', ')}`
            );
          }

          const wizard = createWizardEntity(context);
          set({
            wizard,
            isInitialized: true,
            lastError: null,
            lastSavedAt: Date.now(),
          });
        },
        errorContext,
        MANAGEMENT_ERRORS.INITIALIZATION_FAILED
      );
    },

    reset: () => {
      const context = getErrorContext();
      executeSafely(() => {
        const { wizard } = get();
        wizard?.reset();
      }, context);
    },

    updateStepAvailability: (step: WizardStep, isAvailable: boolean) => {
      const context = getErrorContext();
      executeSafely(() => {
        const { wizard } = get();
        wizard?.updateStepAvailability(step, isAvailable);
      }, context);
    },

    changeMode: (mode) => {
      const context = getErrorContext();
      executeSafely(() => {
        const { wizard } = get();
        wizard?.changeMode(mode);
      }, context);
    },

    updateStatus: (status) => {
      const context = getErrorContext();
      executeSafely(() => {
        const { wizard } = get();
        wizard?.updateStatus(status);
      }, context);
    },
  };
});
