// 🎯 ПУБЛІЧНЕ API для Stage1 Order Wizard домену
// Експорт тільки необхідних хуків та типів для UI компонентів

// ✅ СПРОЩЕНІ КОМПОЗИЦІЙНІ ХУКИ (НОВА ЛОГІКА)
export { useStage1SimplifiedWorkflow } from './hooks/use-stage1-simplified-workflow.hook';
export { useClientSelection } from './hooks/use-client-selection.hook';
export { useBranchSelection } from './hooks/use-branch-selection.hook';

// ✅ БАЗОВІ ХУКИ (для внутрішнього використання)
export { useClientSearch } from './hooks/use-client-search.hook';
export { useClientCreate } from './hooks/use-client-create.hook';
export { useBasicOrderInfo } from './hooks/use-basic-order-info.hook';

// ⚠️ СТАРИЙ WORKFLOW ХУК (для сумісності, буде видалений)
export { useStage1Workflow } from './hooks/use-stage1-workflow.hook';

// 📋 ТИПИ
export type { UseStage1SimplifiedWorkflowReturn } from './hooks/use-stage1-simplified-workflow.hook';
export type { UseClientSelectionReturn } from './hooks/use-client-selection.hook';
export type { UseBranchSelectionReturn } from './hooks/use-branch-selection.hook';
export type { UseClientSearchReturn } from './hooks/use-client-search.hook';
export type { UseClientCreateReturn } from './hooks/use-client-create.hook';
export type { UseBasicOrderInfoReturn } from './hooks/use-basic-order-info.hook';

// 📋 КОНСТАНТИ та УТИЛІТИ
export {
  STAGE1_SUBSTEPS,
  STAGE1_SUBSTEP_NAMES,
  CLIENT_MODES,
  type Stage1Substep,
  type ClientMode,
} from './utils/stage1-mapping';
