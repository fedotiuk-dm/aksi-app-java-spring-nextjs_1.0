// Substep3 Workflow Schemas - ТІЛЬКИ Orval схеми + мінімальні UI форми
// Використовуємо готові схеми з @api/substep3

import { z } from 'zod';

// =================== ORVAL СХЕМИ ===================
// Реекспорт готових схем з читабельними назвами
export type {
  Substep3ProcessStainSelectionParams as ProcessStainSelectionParamsSchema,
  Substep3ProcessDefectSelectionParams as ProcessDefectSelectionParamsSchema,
  Substep3ProcessDefectNotesParams as ProcessDefectNotesParamsSchema,
  Substep3GoBackParams as GoBackParamsSchema,
} from '@api/substep3';

// Response схеми (основні DTO)
export type {
  StainsDefectsDTO as StainsDefectsSchema,
  StainsDefectsContext as StainsDefectsContextSchema,
  StainTypeDTO as StainTypeSchema,
  DefectTypeDTO as DefectTypeSchema,
  OrderItemAddRequest as OrderItemAddRequestSchema,
  SubstepResultDTO as SubstepResultSchema,
  ErrorResponse as ErrorResponseSchema,
} from '@api/substep3';

// =================== ТИПИ ===================
// Реекспорт типів з читабельними назвами
export type {
  Substep3ProcessStainSelectionParams as ProcessStainSelectionParams,
  Substep3ProcessDefectSelectionParams as ProcessDefectSelectionParams,
  Substep3ProcessDefectNotesParams as ProcessDefectNotesParams,
  Substep3GoBackParams as GoBackParams,
} from '@api/substep3';

// Response типи
export type {
  StainsDefectsDTO as StainsDefectsResponse,
  StainsDefectsContext as StainsDefectsContextResponse,
  StainTypeDTO as StainTypeResponse,
  DefectTypeDTO as DefectTypeResponse,
  OrderItemAddRequest as OrderItemAddRequestResponse,
  SubstepResultDTO as SubstepResultResponse,
  ErrorResponse as ErrorResponse,
} from '@api/substep3';

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
