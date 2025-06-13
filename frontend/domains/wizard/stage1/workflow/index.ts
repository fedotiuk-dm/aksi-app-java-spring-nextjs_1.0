// Публічне API для Stage1 Workflow домену

// =================== ГОЛОВНИЙ ХУК ===================
export { useStage1Workflow } from './use-stage1-workflow.hook';
export type { UseStage1WorkflowReturn } from './use-stage1-workflow.hook';

// =================== СТОР ТА СЕЛЕКТОРИ ===================
export { useStage1WorkflowStore } from './workflow.store';

// =================== ORVAL СХЕМИ (якщо потрібні в UI) ===================
export {
  // TypeScript типи
  type NewClientFormDTO,
  type BasicOrderInfoDTO,
  type ClientSearchCriteriaDTO,
  type ClientSearchResultDTO,
  type BranchLocationDTO,
  type ClientResponse,

  // Zod схеми
  ClientFormDataParamsSchema,
  ClientFormDataResponseSchema,
  BasicOrderDataParamsSchema,
  BasicOrderDataResponseSchema,
  SearchClientsParamsSchema,
  SearchClientsResponseSchema,
} from './schemas';
