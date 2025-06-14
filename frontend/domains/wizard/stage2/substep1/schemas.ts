// Схеми для Substep1 - ТІЛЬКИ Orval схеми
// Використовуємо готові Orval схеми БЕЗ кастомних UI форм

import { z } from 'zod';

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

// =================== МІНІМАЛЬНІ UI ФОРМИ ===================
// Тільки для UI компонентів, які не покриті Orval схемами

// Форма пошуку категорій
export const categorySearchFormSchema = z.object({
  searchTerm: z.string().min(2, 'Мінімум 2 символи для пошуку'),
});

export type CategorySearchFormData = z.infer<typeof categorySearchFormSchema>;

// Форма пошуку предметів
export const itemSearchFormSchema = z.object({
  searchTerm: z.string().min(2, 'Мінімум 2 символи для пошуку'),
  categoryId: z.string().min(1, "Категорія обов'язкова"),
});

export type ItemSearchFormData = z.infer<typeof itemSearchFormSchema>;

// Форма введення кількості
export const quantityFormSchema = z.object({
  quantity: z
    .number()
    .min(1, 'Кількість повинна бути більше 0')
    .max(1000, 'Максимальна кількість 1000'),
});

export type QuantityFormData = z.infer<typeof quantityFormSchema>;

// Форма валідації
export const validationFormSchema = z.object({
  confirmed: z.boolean().refine((val) => val === true, "Підтвердження обов'язкове"),
});

export type ValidationFormData = z.infer<typeof validationFormSchema>;
