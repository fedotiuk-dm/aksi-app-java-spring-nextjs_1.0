// Схеми для Stage1 Basic Order Info - ТІЛЬКИ базова інформація замовлення
// Використовуємо готові Orval схеми та мінімальні UI форми тільки для відсутніх в API

import { z } from 'zod';

// =================== ORVAL СХЕМИ ===================

// Реекспорт Zod схем для валідації - ТІЛЬКИ базова інформація замовлення
export {
  // Basic order data operations
  stage1GetBasicOrderDataParams as GetBasicOrderDataParamsSchema,
  stage1GetBasicOrderData200Response as GetBasicOrderDataResponseSchema,
  stage1UpdateBasicOrderParams as UpdateBasicOrderParamsSchema,
  stage1UpdateBasicOrderBody as UpdateBasicOrderBodySchema,

  // Basic order workflow operations
  stage1StartBasicOrderWorkflow200Response as StartBasicOrderWorkflowResponseSchema,
  stage1ValidateBasicOrderParams as ValidateBasicOrderParamsSchema,
  stage1ValidateBasicOrder200Response as ValidateBasicOrderResponseSchema,

  // Basic order state management
  stage1GetBasicOrderStateParams as GetBasicOrderStateParamsSchema,
  stage1GetBasicOrderState200Response as GetBasicOrderStateResponseSchema,

  // Basic order lifecycle operations
  stage1InitializeBasicOrder200Response as InitializeBasicOrderResponseSchema,
  stage1CompleteBasicOrderParams as CompleteBasicOrderParamsSchema,
  stage1ResetBasicOrderParams as ResetBasicOrderParamsSchema,
  stage1CancelBasicOrderParams as CancelBasicOrderParamsSchema,
  stage1ClearBasicOrderErrorsParams as ClearBasicOrderErrorsParamsSchema,
} from '../../../../shared/api/generated/stage1';

// =================== МІНІМАЛЬНІ UI ФОРМИ (тільки для відсутніх в API) ===================

// Форма вибору філії (UI тільки)
export const branchSelectionFormSchema = z.object({
  selectedBranchId: z.string().min(1, 'Оберіть філію'),
  confirmSelection: z.boolean().default(false),
});

// Форма унікальної мітки (UI тільки)
export const uniqueTagFormSchema = z.object({
  uniqueTag: z.string().min(3, 'Мінімум 3 символи').max(50),
  isScanned: z.boolean().default(false),
});

// Форма налаштувань замовлення (UI тільки)
export const orderSettingsFormSchema = z.object({
  autoGenerateReceiptNumber: z.boolean().default(true),
  validateOnChange: z.boolean().default(true),
  showAdvancedOptions: z.boolean().default(false),
});

// =================== ТИПИ ДЛЯ UI ФОРМ ===================
export type BranchSelectionFormData = z.infer<typeof branchSelectionFormSchema>;
export type UniqueTagFormData = z.infer<typeof uniqueTagFormSchema>;
export type OrderSettingsFormData = z.infer<typeof orderSettingsFormSchema>;
