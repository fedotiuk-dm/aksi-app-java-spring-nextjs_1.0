import { WizardEntity } from '../../entities';
import { WizardNavigationService } from '../../services/wizard-navigation.service';
import { WizardStep, WizardStatus, WizardContext, NavigationDirection } from '../../types';
import { generateSessionId } from '../wizard-state.store';

/**
 * Wizard Factory
 * Factory для створення wizard entities
 *
 * SOLID принципи:
 * - Single Responsibility: тільки створення wizard
 * - Factory Pattern: централізоване створення об'єктів
 */

/**
 * Create wizard navigation service
 */
const createNavigationService = (): WizardNavigationService => {
  return new WizardNavigationService();
};

/**
 * Create wizard entity with proper initialization
 */
export const createWizardEntity = (context: WizardContext): WizardEntity => {
  const navigation = createNavigationService();
  const availability = navigation.calculateInitialAvailability();

  return new WizardEntity(
    generateSessionId(),
    WizardStep.CLIENT_SELECTION,
    context.mode,
    WizardStatus.IDLE,
    context,
    [
      {
        step: WizardStep.CLIENT_SELECTION,
        timestamp: Date.now(),
        direction: NavigationDirection.JUMP,
      },
    ],
    availability,
    false
  );
};
