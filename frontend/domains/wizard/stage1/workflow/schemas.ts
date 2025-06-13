// Схеми для Stage1 Workflow - ТІЛЬКИ Orval схеми
// Використовуємо готові Orval схеми БЕЗ кастомних UI форм

// =================== ORVAL СХЕМИ ===================

// Реекспорт TypeScript типів
export type {
  // Основні типи
  NewClientFormDTO,
  BasicOrderInfoDTO,
  ClientSearchCriteriaDTO,
  ClientSearchResultDTO,
  BranchLocationDTO,
  ClientResponse,

  // Параметри
  Stage1SelectClientParams,
  Stage1SearchClientsByPhoneParams,
  Stage1SetUniqueTagParams,
  Stage1SelectBranchParams,
  Stage1GenerateReceiptNumberParams,

  // Стани
  Stage1GetClientFormState200,
  Stage1GetClientSearchState200,
  Stage1GetBasicOrderState200,
} from '@/shared/api/generated/stage1';

// Реекспорт Zod схем для валідації
export {
  // Client Form
  stage1GetClientFormDataParams as ClientFormDataParamsSchema,
  stage1GetClientFormData200Response as ClientFormDataResponseSchema,
  stage1UpdateClientDataParams as UpdateClientDataParamsSchema,
  stage1UpdateClientDataBody as UpdateClientDataBodySchema,
  stage1ValidateClientForm200Response as ValidateClientFormResponseSchema,
  stage1CreateClient200Response as CreateClientResponseSchema,
  stage1InitializeNewClient200Response as InitializeNewClientResponseSchema,

  // Client Search
  stage1SearchClientsParams as SearchClientsParamsSchema,
  stage1SearchClients200Response as SearchClientsResponseSchema,
  stage1SearchClientsByPhoneParams as SearchClientsByPhoneParamsSchema,
  stage1SearchClientsByPhone200Response as SearchClientsByPhoneResponseSchema,

  // Basic Order Info
  stage1GetBasicOrderDataParams as BasicOrderDataParamsSchema,
  stage1GetBasicOrderData200Response as BasicOrderDataResponseSchema,
  stage1SetUniqueTagParams as SetUniqueTagParamsSchema,
  stage1SelectBranchParams as SelectBranchParamsSchema,
  stage1GenerateReceiptNumberParams as GenerateReceiptNumberParamsSchema,
} from '@/shared/api/generated/stage1';
