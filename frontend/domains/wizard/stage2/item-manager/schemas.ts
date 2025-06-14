// Схеми для Stage2 Item Manager - ТІЛЬКИ Orval схеми
// Використовуємо готові Orval схеми БЕЗ кастомних UI форм

import { z } from 'zod';
import { ITEM_MANAGER_LIMITS, TABLE_CONFIG } from './constants';

// =================== ORVAL СХЕМИ ===================

// Реекспорт TypeScript типів
export type {
  ItemManagerDTO,
  OrderItemDTO,
  Stage2GetCurrentState200,
} from '@/shared/api/generated/stage2';

// Реекспорт Zod схем для валідації
export {
  // Params схеми
  stage2InitializeItemManagerParams as InitializeItemManagerParamsSchema,
  stage2UpdateItemInOrderParams as UpdateItemInOrderParamsSchema,
  stage2DeleteItemFromOrderParams as DeleteItemFromOrderParamsSchema,
  stage2StartNewItemWizardParams as StartNewItemWizardParamsSchema,
  stage2StartEditItemWizardParams as StartEditItemWizardParamsSchema,
  stage2CloseWizardParams as CloseWizardParamsSchema,
  stage2SynchronizeManagerParams as SynchronizeManagerParamsSchema,
  stage2AddItemToOrderParams as AddItemToOrderParamsSchema,
  stage2CompleteStageParams as CompleteStageParamsSchema,
  stage2GetCurrentManagerParams as GetCurrentManagerParamsSchema,
  stage2ValidateCurrentStateParams as ValidateCurrentStateParamsSchema,
  stage2GetCurrentStateParams as GetCurrentStateParamsSchema,
  stage2CheckReadinessToProceedParams as CheckReadinessToProceedParamsSchema,

  // Body схеми
  stage2UpdateItemInOrderBody as UpdateItemInOrderBodySchema,

  // Response схеми
  stage2InitializeItemManager200Response as InitializeItemManagerResponseSchema,
  stage2UpdateItemInOrder200Response as UpdateItemInOrderResponseSchema,
  stage2DeleteItemFromOrder200Response as DeleteItemFromOrderResponseSchema,
  stage2StartNewItemWizard200Response as StartNewItemWizardResponseSchema,
  stage2StartEditItemWizard200Response as StartEditItemWizardResponseSchema,
  stage2CloseWizard200Response as CloseWizardResponseSchema,
  stage2SynchronizeManager200Response as SynchronizeManagerResponseSchema,
  stage2AddItemToOrder200Response as AddItemToOrderResponseSchema,
  stage2CompleteStage200Response as CompleteStageResponseSchema,
  stage2GetCurrentManager200Response as GetCurrentManagerResponseSchema,
  stage2ValidateCurrentState200Response as ValidateCurrentStateResponseSchema,
  stage2GetCurrentState200Response as GetCurrentStateResponseSchema,
  stage2CheckReadinessToProceed200Response as CheckReadinessToProceedResponseSchema,
} from '@/shared/api/generated/stage2';

// =================== МІНІМАЛЬНІ UI ФОРМИ ===================
// Тільки для UI компонентів, які не покриті Orval схемами

// Форма пошуку предметів в таблиці
export const itemSearchFormSchema = z.object({
  searchTerm: z
    .string()
    .min(
      ITEM_MANAGER_LIMITS.MIN_SEARCH_LENGTH,
      `Мінімум ${ITEM_MANAGER_LIMITS.MIN_SEARCH_LENGTH} символи для пошуку`
    )
    .max(
      ITEM_MANAGER_LIMITS.MAX_SEARCH_LENGTH,
      `Максимум ${ITEM_MANAGER_LIMITS.MAX_SEARCH_LENGTH} символів`
    )
    .optional(),
});

export type ItemSearchFormData = z.infer<typeof itemSearchFormSchema>;

// Форма налаштувань відображення таблиці
export const tableDisplayFormSchema = z.object({
  itemsPerPage: z
    .number()
    .min(
      TABLE_CONFIG.PAGE_SIZE_OPTIONS[0],
      `Мінімум ${TABLE_CONFIG.PAGE_SIZE_OPTIONS[0]} елементів`
    )
    .max(
      TABLE_CONFIG.PAGE_SIZE_OPTIONS[TABLE_CONFIG.PAGE_SIZE_OPTIONS.length - 1],
      `Максимум ${TABLE_CONFIG.PAGE_SIZE_OPTIONS[TABLE_CONFIG.PAGE_SIZE_OPTIONS.length - 1]} елементів`
    ),
  sortBy: z.enum(TABLE_CONFIG.SORT_OPTIONS as unknown as [string, ...string[]]),
  sortOrder: z.enum(['asc', 'desc']),
});

export type TableDisplayFormData = z.infer<typeof tableDisplayFormSchema>;

// Форма підтвердження видалення
export const deleteConfirmationFormSchema = z.object({
  confirmed: z.boolean().refine((val) => val === true, "Підтвердження обов'язкове"),
  itemId: z.string().min(1, "ID предмета обов'язковий"),
});

export type DeleteConfirmationFormData = z.infer<typeof deleteConfirmationFormSchema>;

// Форма переходу до наступного етапу
export const proceedToNextStageFormSchema = z.object({
  confirmed: z.boolean().refine((val) => val === true, "Підтвердження обов'язкове"),
  itemsCount: z
    .number()
    .min(
      ITEM_MANAGER_LIMITS.MIN_ITEMS_COUNT,
      `Повинно бути мінімум ${ITEM_MANAGER_LIMITS.MIN_ITEMS_COUNT} предмет`
    )
    .max(
      ITEM_MANAGER_LIMITS.MAX_ITEMS_COUNT,
      `Максимум ${ITEM_MANAGER_LIMITS.MAX_ITEMS_COUNT} предметів`
    ),
});

export type ProceedToNextStageFormData = z.infer<typeof proceedToNextStageFormSchema>;
