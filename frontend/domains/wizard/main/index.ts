// ЕТАП 4: Публічне API для головного управління Order Wizard
// Експорт тільки через цей файл згідно з архітектурними принципами

// ========== ГОЛОВНИЙ ХУК ==========
export { useOrderWizardMain } from './use-order-wizard-main.hook';
export type { UseOrderWizardMainReturn } from './use-order-wizard-main.hook';

// ========== СХЕМИ ДЛЯ UI (ЯКЩО ПОТРІБНІ) ==========
export { stageStateSchema, wizardNavigationSchema } from './main.schemas';
export type { StageState, WizardNavigation } from './main.schemas';

// ========== СТОР (ЯКЩО ПОТРІБЕН ПРЯМИЙ ДОСТУП) ==========
export {
  useOrderWizardMainStore,
  selectSessionInfo,
  selectNavigationState,
  selectDebugInfo,
} from './main.store';

// ========== ВСЕ ІНШЕ ПРИХОВАНО ==========
// НЕ експортуємо:
// - Внутрішні утиліти
// - Конфігураційні константи
// - Приватні методи стору
