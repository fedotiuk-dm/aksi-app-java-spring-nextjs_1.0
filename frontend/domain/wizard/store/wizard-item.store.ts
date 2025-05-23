/**
 * Wizard Item Store
 * Спеціалізований store для Item Wizard операцій
 *
 * SOLID принципи:
 * - Single Responsibility: тільки Item Wizard логіка
 * - Open/Closed: легко розширюється новими Item операціями
 * - Interface Segregation: мінімальний API для Item Wizard
 */

/**
 * Domain Constants для Item Wizard
 */
export const ITEM_WIZARD_ERRORS = {
  ITEM_WIZARD_START_FAILED: 'Помилка запуску Item Wizard',
  ITEM_WIZARD_FINISH_FAILED: 'Помилка завершення Item Wizard',
  INVALID_PARENT_STEP: 'Item Wizard можна запустити тільки з ITEM_MANAGER кроку',
  NOT_ACTIVE: 'Item Wizard не активний',
} as const;

/**
 * Item Wizard дії
 */
export interface WizardItemActions {
  // Item Wizard lifecycle
  startItemWizard: () => void;
  finishItemWizard: (saveItem: boolean) => void;

  // Item Wizard status
  isItemWizardAllowed: () => boolean;
  getItemWizardStatus: () => 'inactive' | 'active' | 'blocked';
}

/**
 * Helper: перевірка можливості запуску Item Wizard
 */
export const canStartItemWizard = (currentStep: string): boolean => {
  return currentStep === 'item-manager';
};

/**
 * Helper: валідація стану Item Wizard
 */
export const validateItemWizardState = (
  isActive: boolean,
  currentStep: string
): { valid: boolean; error?: string } => {
  if (isActive && !currentStep.startsWith('item-')) {
    return {
      valid: false,
      error: 'Item Wizard активний, але поточний крок не належить Item Wizard',
    };
  }

  return { valid: true };
};
