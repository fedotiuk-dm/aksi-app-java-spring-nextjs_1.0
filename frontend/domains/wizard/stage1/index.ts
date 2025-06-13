// 🔥 ЕТАП 4: ПУБЛІЧНЕ API - wizard/stage1 domain
// Експорт композиційних хуків та типів для UI компонентів

// 🎯 ГОЛОВНИЙ WORKFLOW ХУК (рекомендований для UI)
export { useStage1Workflow } from './hooks/use-stage1-workflow.hook';
export type { UseStage1WorkflowReturn } from './hooks/use-stage1-workflow.hook';

// Композиційні хуки для окремих підетапів (якщо потрібні)
export { useClientSearch } from './hooks/use-client-search.hook';
export type { UseClientSearchReturn } from './hooks/use-client-search.hook';

export { useClientCreate } from './hooks/use-client-create.hook';
export type { UseClientCreateReturn } from './hooks/use-client-create.hook';

export { useBasicOrderInfo } from './hooks/use-basic-order-info.hook';
export type { UseBasicOrderInfoReturn } from './hooks/use-basic-order-info.hook';

// Константи та утиліти (якщо потрібні в UI)
export {
  STAGE1_SUBSTEPS,
  STAGE1_SUBSTEP_NAMES,
  CLIENT_SEARCH_CRITERIA,
  CLIENT_SEARCH_CRITERIA_NAMES,
  CONTACT_METHODS,
  CONTACT_METHOD_NAMES,
  INFO_SOURCES,
  INFO_SOURCE_NAMES,
  getSearchCriteriaName,
  getContactMethodName,
  getInfoSourceName,
  isValidSearchTerm,
  isValidContactMethod,
  isValidInfoSource,
} from './utils/stage1-mapping';

// Типи (якщо потрібні в UI)
export type { Stage1Substep } from './utils/stage1-mapping';
