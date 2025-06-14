// Публічне API для Substep1 домену
// Експортуємо тільки головний хук, константи та необхідні схеми

// =================== ГОЛОВНИЙ ХУК ===================
export { useSubstep1ItemBasicInfo } from './use-substep1-item-basic-info.hook';
export type { UseSubstep1ItemBasicInfoReturn } from './use-substep1-item-basic-info.hook';

// =================== КОНСТАНТИ ===================
export {
  SUBSTEP1_UI_STEPS,
  SUBSTEP1_STEP_ORDER,
  SUBSTEP1_VALIDATION_RULES,
  SUBSTEP1_LIMITS,
  calculateSubstep1Progress,
  getNextSubstep1Step,
  getPreviousSubstep1Step,
  type Substep1UIStep,
  type UnitOfMeasure,
  type Substep1ApiState,
  type Substep1ApiEvent,
} from './constants';

// =================== СТОР (якщо потрібен прямий доступ) ===================
export { useItemBasicInfoStore, useItemBasicInfoSelectors } from './store';
export type { ItemBasicInfoStore } from './store';

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

  // UI форми
  categorySearchFormSchema,
  itemSearchFormSchema,
  quantityFormSchema,
  validationFormSchema,
  type CategorySearchFormData,
  type ItemSearchFormData,
  type QuantityFormData,
  type ValidationFormData,
} from './schemas';
