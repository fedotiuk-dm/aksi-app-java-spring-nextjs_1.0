// Експорт готових Orval схем для Substep1 Item Basic Info
export {
  substep1InitializeSubstepBody as InitializeSubstepSchema,
  substep1InitializeSubstep200Response as InitializeSubstepResponseSchema,
  substep1SelectServiceCategoryParams as SelectServiceCategoryParamsSchema,
  substep1SelectServiceCategory200Response as SelectServiceCategoryResponseSchema,
  substep1SelectPriceListItemParams as SelectPriceListItemParamsSchema,
  substep1SelectPriceListItem200Response as SelectPriceListItemResponseSchema,
  substep1EnterQuantityParams as EnterQuantityParamsSchema,
  substep1EnterQuantity200Response as EnterQuantityResponseSchema,
  substep1CompleteSubstep200Response as CompleteSubstepResponseSchema,
  substep1GetCurrentState200Response as GetCurrentStateResponseSchema,
} from '@/shared/api/generated/wizard/zod/aksiApi';

import { z } from 'zod';

// UI форми для Item Basic Info
export const serviceCategorySelectionSchema = z.object({
  categoryId: z.string().min(1, 'Оберіть категорію послуги'),
});

export const priceListItemSelectionSchema = z.object({
  itemId: z.string().min(1, 'Оберіть предмет з прайс-листа'),
});

export const quantityInputSchema = z.object({
  quantity: z
    .number()
    .min(1, 'Кількість повинна бути більше 0')
    .max(1000, 'Максимальна кількість 1000'),
  unitOfMeasure: z.enum(['PIECES', 'KILOGRAMS']).optional(),
});

export const itemBasicInfoFormSchema = z.object({
  categoryId: z.string().min(1, 'Оберіть категорію послуги'),
  itemId: z.string().min(1, 'Оберіть предмет з прайс-листа'),
  quantity: z
    .number()
    .min(1, 'Кількість повинна бути більше 0')
    .max(1000, 'Максимальна кількість 1000'),
  unitOfMeasure: z.enum(['PIECES', 'KILOGRAMS']).optional(),
  notes: z.string().max(500, 'Примітки не можуть перевищувати 500 символів').optional(),
});

// Типи для UI форм
export type ServiceCategorySelectionData = z.infer<typeof serviceCategorySelectionSchema>;
export type PriceListItemSelectionData = z.infer<typeof priceListItemSelectionSchema>;
export type QuantityInputData = z.infer<typeof quantityInputSchema>;
export type ItemBasicInfoFormData = z.infer<typeof itemBasicInfoFormSchema>;
