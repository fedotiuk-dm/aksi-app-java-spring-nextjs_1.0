import { ValidationState } from './validation.types';

/**
 * Початковий стан валідації
 */
export const initialValidationState: ValidationState = {
  validationMap: {},  // Буде заповнено для кожного кроку під час початкової навігації
  isWizardValid: false,
  activeValidation: false
};
