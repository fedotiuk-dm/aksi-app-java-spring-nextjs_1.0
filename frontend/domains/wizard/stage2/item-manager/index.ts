// 📋 STAGE2 ITEM MANAGER: Публічне API домену
// Експорт тільки необхідного для UI компонентів

// =================== ГОЛОВНИЙ ХУК ===================
export { useStage2ItemManager } from './use-stage2-item-manager.hook';
export type { UseStage2ItemManagerReturn } from './use-stage2-item-manager.hook';

// =================== ТИПИ ДЛЯ UI ===================
// Експортуємо тільки типи, які потрібні в UI компонентах
export type {
  ItemManagerSearchFormData,
  TableDisplayFormData,
  DeleteConfirmationFormData,
  ProceedToNextStageFormData,
} from './schemas';

export type { ItemManagerOperation, ItemManagerUIState, ViewMode } from './constants';

// =================== КОНСТАНТИ ДЛЯ UI ===================
// Експортуємо тільки константи, які потрібні в UI компонентах
export {
  ITEM_MANAGER_OPERATIONS,
  ITEM_MANAGER_UI_STATES,
  VIEW_MODES,
  TABLE_CONFIG,
} from './constants';
