// 🔥 ЕТАП 4: ПУБЛІЧНЕ API - wizard/main domain
// Експорт тільки публічного API для використання в UI

// 🎯 Головний композиційний хук
export { useMain } from './hooks/use-main.hook';
export type { UseMainReturn } from './hooks/use-main.hook';

// 🎨 Константи та утиліти для UI
export {
  WIZARD_STAGES,
  WIZARD_STAGE_NAMES,
  mapApiStateToStage,
  getStageProgress,
  isStageCompleted,
  isStageActive,
  canNavigateToStage,
} from './utils/wizard-stage-mapping';
export type { WizardStage } from './utils/wizard-stage-mapping';

// 🚫 НЕ ЕКСПОРТУЄМО:
// - Внутрішні деталі store (useMainStore, mainSelectors)
// - Внутрішні типи (MainUIState, MainUIActions)
