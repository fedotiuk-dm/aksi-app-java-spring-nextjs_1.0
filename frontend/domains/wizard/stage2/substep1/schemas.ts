// Схеми для Substep1 - ТІЛЬКИ Orval схеми
// Використовуємо готові Orval схеми БЕЗ кастомних UI форм

import { z } from 'zod';

// =================== ORVAL СХЕМИ ===================

// Реекспорт TypeScript типів з унікальними назвами
export type {
  ItemBasicInfoDTO as Substep1ItemBasicInfoDTO,
  ServiceCategoryDTO as Substep1ServiceCategoryDTO,
  PriceListItemDTO as Substep1PriceListItemDTO,
  SubstepResultDTO as Substep1SubstepResultDTO,
} from '@api/substep1';

// Реекспорт Zod схем для валідації
export {
  // Params схеми
  substep1SelectServiceCategoryParams as Substep1SelectServiceCategoryParamsSchema,
  substep1SelectServiceCategoryQueryParams as Substep1SelectServiceCategoryQueryParamsSchema,
  substep1SelectPriceListItemParams as Substep1SelectPriceListItemParamsSchema,
  substep1SelectPriceListItemQueryParams as Substep1SelectPriceListItemQueryParamsSchema,
  substep1EnterQuantityParams as Substep1EnterQuantityParamsSchema,
  substep1EnterQuantityQueryParams as Substep1EnterQuantityQueryParamsSchema,
  substep1ValidateAndCompleteParams as Substep1ValidateAndCompleteParamsSchema,
  substep1ResetParams as Substep1ResetParamsSchema,
  substep1FinalizeSessionParams as Substep1FinalizeSessionParamsSchema,
  substep1GetStatusParams as Substep1GetStatusParamsSchema,
  substep1GetItemsForCategoryParams as Substep1GetItemsForCategoryParamsSchema,

  // Response схеми
  substep1StartSubstep200Response as Substep1StartSubstepResponseSchema,
  substep1SelectServiceCategory200Response as Substep1SelectServiceCategoryResponseSchema,
  substep1SelectPriceListItem200Response as Substep1SelectPriceListItemResponseSchema,
  substep1EnterQuantity200Response as Substep1EnterQuantityResponseSchema,
  substep1ValidateAndComplete200Response as Substep1ValidateAndCompleteResponseSchema,
  substep1Reset200Response as Substep1ResetResponseSchema,
  substep1GetStatus200Response as Substep1GetStatusResponseSchema,
  substep1GetServiceCategories200Response as Substep1GetServiceCategoriesResponseSchema,
  substep1GetItemsForCategory200Response as Substep1GetItemsForCategoryResponseSchema,
} from '@api/substep1';

// =================== МІНІМАЛЬНІ UI ФОРМИ ===================
// Тільки для UI компонентів, які не покриті Orval схемами

// Форма пошуку категорій
export const substep1CategorySearchFormSchema = z.object({
  searchTerm: z.string().min(2, 'Мінімум 2 символи для пошуку'),
});

export type Substep1CategorySearchFormData = z.infer<typeof substep1CategorySearchFormSchema>;

// Форма пошуку предметів
export const substep1ItemSearchFormSchema = z.object({
  searchTerm: z.string().min(2, 'Мінімум 2 символи для пошуку'),
  categoryId: z.string().min(1, "Категорія обов'язкова"),
});

export type Substep1ItemSearchFormData = z.infer<typeof substep1ItemSearchFormSchema>;

// Форма введення кількості
export const substep1QuantityFormSchema = z.object({
  quantity: z
    .number()
    .min(1, 'Кількість повинна бути більше 0')
    .max(1000, 'Максимальна кількість 1000'),
});

export type Substep1QuantityFormData = z.infer<typeof substep1QuantityFormSchema>;

// Форма валідації
export const substep1ValidationFormSchema = z.object({
  confirmed: z.boolean().refine((val) => val === true, "Підтвердження обов'язкове"),
});

export type Substep1ValidationFormData = z.infer<typeof substep1ValidationFormSchema>;
