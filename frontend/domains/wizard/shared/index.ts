// ЕТАП 4: Публічне API домену wizard/shared
// Експорт тільки через цей файл згідно з архітектурними принципами

// ========== ГОЛОВНИЙ ХУК ==========
export { useWizardManagement } from './hooks/use-wizard-management.hook';
export type { UseWizardManagementReturn } from './hooks/use-wizard-management.hook';

// ========== ТИПИ ЯКЩО ПОТРІБНІ В UI ==========
export type { WizardSessionState, WizardSystemState } from './schemas';

// ========== ВСЕ ІНШЕ ПРИХОВАНО ==========
// НЕ експортуємо:
// - store напряму (інкапсульовано в хуку)
// - внутрішні селектори
// - внутрішні утиліти
