/**
 * Основний експорт моделі даних для OrderWizard
 */

// Експорт типів даних з UI частини
export * from './types/wizard.types';

// Експорт схем валідації Zod
export * from './schema/client.schema';

// Експорт Zustand сховища
export * from './store';
