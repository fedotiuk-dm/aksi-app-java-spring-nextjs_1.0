/**
 * Константи wizard
 * Експорт найважливіших констант для зовнішнього використання
 */

// === КОНСТАНТИ КРОКІВ ===
export { WIZARD_STEPS_ORDER, ITEM_WIZARD_STEPS_ORDER } from './steps/wizard-steps-order.constants';

export { WIZARD_STEP_LABELS, ITEM_WIZARD_STEP_LABELS } from './steps/wizard-steps-labels.constants';

export {
  REQUIRED_STEPS,
  REQUIRED_ITEM_STEPS,
  STEPS_WITH_UNSAVED_CHANGES,
  STEPS_WITH_API_VALIDATION,
} from './steps/wizard-steps-config.constants';

// === КОНСТАНТИ ВАЛІДАЦІЇ ===
// API-based валідації
export {
  CLIENT_VALIDATION_RULES,
  BRANCH_VALIDATION_RULES,
  ITEMS_VALIDATION_RULES,
  ORDER_VALIDATION_RULES,
  VALIDATION_LIMITS,
  COMMUNICATION_CHANNELS,
  CLIENT_SOURCES,
  ORDER_STATUSES,
  EXPEDITE_TYPES,
} from './validation/api-validation.constants';
