// 📋 ПІДЕТАП 2.1: Публічне API для основної інформації про предмет
// Композиційний підхід з експортом головного хука та допоміжних типів

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

// =================== СХЕМИ ТА ТИПИ ===================
export {
  // Orval Zod схеми з унікальними назвами
  Substep1SelectServiceCategoryParamsSchema,
  Substep1SelectServiceCategoryQueryParamsSchema,
  Substep1SelectPriceListItemParamsSchema,
  Substep1SelectPriceListItemQueryParamsSchema,
  Substep1EnterQuantityParamsSchema,
  Substep1EnterQuantityQueryParamsSchema,
  Substep1ValidateAndCompleteParamsSchema,
  Substep1StartSubstepResponseSchema,
  Substep1SelectServiceCategoryResponseSchema,
  Substep1SelectPriceListItemResponseSchema,
  Substep1EnterQuantityResponseSchema,
  Substep1ValidateAndCompleteResponseSchema,
  Substep1GetStatusResponseSchema,
  Substep1GetServiceCategoriesResponseSchema,
  Substep1GetItemsForCategoryResponseSchema,

  // UI форми з унікальними назвами
  substep1CategorySearchFormSchema,
  substep1ItemSearchFormSchema,
  substep1QuantityFormSchema,
  substep1ValidationFormSchema,
} from './schemas';

export type {
  // Orval TypeScript типи з унікальними назвами
  Substep1ItemBasicInfoDTO,
  Substep1ServiceCategoryDTO,
  Substep1PriceListItemDTO,
  Substep1SubstepResultDTO,

  // UI форми типи з унікальними назвами
  Substep1CategorySearchFormData,
  Substep1ItemSearchFormData,
  Substep1QuantityFormData,
  Substep1ValidationFormData,
} from './schemas';
