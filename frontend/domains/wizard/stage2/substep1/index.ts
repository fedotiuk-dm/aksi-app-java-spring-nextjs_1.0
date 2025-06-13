// Публічне API для Substep1 домену
// Експортуємо тільки головний хук та Orval схеми

// =================== ГОЛОВНИЙ ХУК ===================
export { useSubstep1ItemBasicInfo } from './use-substep1-item-basic-info.hook';
export type { UseSubstep1ItemBasicInfoReturn } from './use-substep1-item-basic-info.hook';

// =================== ORVAL СХЕМИ (якщо потрібні в UI) ===================
export {
  // TypeScript типи
  type ItemBasicInfoDTO,
  type ServiceCategoryDTO,
  type PriceListItemDTO,
  type SubstepResultDTO,

  // Zod схеми
  SelectServiceCategoryParamsSchema,
  SelectServiceCategoryQueryParamsSchema,
  SelectPriceListItemParamsSchema,
  SelectPriceListItemQueryParamsSchema,
  EnterQuantityParamsSchema,
  EnterQuantityQueryParamsSchema,
  ValidateAndCompleteParamsSchema,
  StartSubstepResponseSchema,
  SelectServiceCategoryResponseSchema,
  SelectPriceListItemResponseSchema,
  EnterQuantityResponseSchema,
  ValidateAndCompleteResponseSchema,
  GetStatusResponseSchema,
  GetServiceCategoriesResponseSchema,
  GetItemsForCategoryResponseSchema,
} from './schemas';
