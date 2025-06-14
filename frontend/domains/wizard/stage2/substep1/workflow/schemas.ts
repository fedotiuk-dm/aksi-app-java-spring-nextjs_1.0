// Substep1 Workflow Schemas - ТІЛЬКИ Orval схеми + мінімальні UI форми
// Використовуємо готові схеми з @api/substep1

import { z } from 'zod';

// =================== ORVAL СХЕМИ ===================
// Реекспорт готових схем з читабельними назвами
export type {
  Substep1SelectServiceCategoryParams as SelectServiceCategoryParamsSchema,
  Substep1SelectPriceListItemParams as SelectPriceListItemParamsSchema,
  Substep1EnterQuantityParams as EnterQuantityParamsSchema,
} from '@api/substep1';

// Response схеми (основні DTO)
export type {
  ItemBasicInfoDTO as ItemBasicInfoSchema,
  ServiceCategoryDTO as ServiceCategorySchema,
  PriceListItemDTO as PriceListItemSchema,
  SubstepResultDTO as SubstepResultSchema,
  ErrorResponse as ErrorResponseSchema,
} from '@api/substep1';

// =================== ТИПИ ===================
// Реекспорт типів з читабельними назвами
export type {
  Substep1SelectServiceCategoryParams as SelectServiceCategoryParams,
  Substep1SelectPriceListItemParams as SelectPriceListItemParams,
  Substep1EnterQuantityParams as EnterQuantityParams,
} from '@api/substep1';

// Response типи
export type {
  ItemBasicInfoDTO as ItemBasicInfoResponse,
  ServiceCategoryDTO as ServiceCategoryResponse,
  PriceListItemDTO as PriceListItemResponse,
  SubstepResultDTO as SubstepResultResponse,
  ErrorResponse as ErrorResponse,
} from '@api/substep1';

// =================== МІНІМАЛЬНІ UI ФОРМИ ===================
// Тільки для workflow навігації та координації

// Форма ініціалізації workflow
export const workflowInitializationFormSchema = z.object({
  sessionId: z.string().min(1, "Session ID обов'язковий"),
  orderId: z.string().min(1, "Order ID обов'язковий"),
});

export type WorkflowInitializationFormData = z.infer<typeof workflowInitializationFormSchema>;

// Форма навігації між кроками
export const workflowNavigationFormSchema = z.object({
  targetStep: z.string().min(1, "Цільовий крок обов'язковий"),
  skipValidation: z.boolean(),
});

export type WorkflowNavigationFormData = z.infer<typeof workflowNavigationFormSchema>;

// Форма завершення workflow
export const workflowCompletionFormSchema = z.object({
  sessionId: z.string().min(1, "Session ID обов'язковий"),
  confirmCompletion: z
    .boolean()
    .refine((val) => val === true, "Підтвердження завершення обов'язкове"),
});

export type WorkflowCompletionFormData = z.infer<typeof workflowCompletionFormSchema>;
