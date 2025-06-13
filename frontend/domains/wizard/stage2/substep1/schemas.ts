// Схеми для Substep1 - ТІЛЬКИ Orval схеми
// Використовуємо готові Orval схеми БЕЗ кастомних UI форм

// =================== ORVAL СХЕМИ ===================

// Реекспорт TypeScript типів
export type {
  ItemBasicInfoDTO,
  ServiceCategoryDTO,
  PriceListItemDTO,
  SubstepResultDTO,
} from '@/shared/api/generated/substep1';

// Реекспорт Zod схем для валідації
export {
  // Params схеми
  substep1SelectServiceCategoryParams as SelectServiceCategoryParamsSchema,
  substep1SelectServiceCategoryQueryParams as SelectServiceCategoryQueryParamsSchema,
  substep1SelectPriceListItemParams as SelectPriceListItemParamsSchema,
  substep1SelectPriceListItemQueryParams as SelectPriceListItemQueryParamsSchema,
  substep1EnterQuantityParams as EnterQuantityParamsSchema,
  substep1EnterQuantityQueryParams as EnterQuantityQueryParamsSchema,
  substep1ValidateAndCompleteParams as ValidateAndCompleteParamsSchema,
  substep1ResetParams as ResetParamsSchema,
  substep1FinalizeSessionParams as FinalizeSessionParamsSchema,
  substep1GetStatusParams as GetStatusParamsSchema,
  substep1GetItemsForCategoryParams as GetItemsForCategoryParamsSchema,

  // Response схеми
  substep1StartSubstep200Response as StartSubstepResponseSchema,
  substep1SelectServiceCategory200Response as SelectServiceCategoryResponseSchema,
  substep1SelectPriceListItem200Response as SelectPriceListItemResponseSchema,
  substep1EnterQuantity200Response as EnterQuantityResponseSchema,
  substep1ValidateAndComplete200Response as ValidateAndCompleteResponseSchema,
  substep1Reset200Response as ResetResponseSchema,
  substep1GetStatus200Response as GetStatusResponseSchema,
  substep1GetServiceCategories200Response as GetServiceCategoriesResponseSchema,
  substep1GetItemsForCategory200Response as GetItemsForCategoryResponseSchema,
} from '@/shared/api/generated/substep1';
