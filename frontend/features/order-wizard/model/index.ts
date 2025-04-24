/**
 * Основний експорт моделі даних для OrderWizard
 */

// Експорт типів даних з UI частини
export * from './types/wizard.types';

// Експорт схем валідації Zod
export * from './schema/client.schema';

// Експорт машини станів XState
export { 
  initialContext,
  orderWizardMachine,
  // Вибірковий експорт типів подій для уникнення дублювання
  type OrderWizardEvent 
} from './machine/orderWizard.machine';
