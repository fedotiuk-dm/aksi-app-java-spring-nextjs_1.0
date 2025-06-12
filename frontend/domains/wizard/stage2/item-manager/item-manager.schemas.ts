// Експорт готових Orval схем для Stage2 Item Manager
export {
  stage2InitializeItemManagerBody as ItemManagerInitializeSchema,
  stage2InitializeItemManager200Response as ItemManagerInitializeResponseSchema,
  stage2GetCurrentManagerParams as ItemManagerGetCurrentParamsSchema,
  stage2GetCurrentManager200Response as ItemManagerCurrentStateSchema,
  stage2AddItemToOrderBody as AddItemToOrderSchema,
  stage2AddItemToOrder200Response as AddItemToOrderResponseSchema,
  stage2UpdateItemInOrderBody as UpdateItemInOrderSchema,
  stage2UpdateItemInOrder200Response as UpdateItemInOrderResponseSchema,
  stage2DeleteItemFromOrderParams as DeleteItemFromOrderParamsSchema,
  stage2DeleteItemFromOrder200Response as DeleteItemFromOrderResponseSchema,
  stage2StartNewItemWizardBody as StartNewItemWizardSchema,
  stage2StartNewItemWizard200Response as StartNewItemWizardResponseSchema,
  stage2StartEditItemWizardBody as StartEditItemWizardSchema,
  stage2StartEditItemWizard200Response as StartEditItemWizardResponseSchema,
  stage2CloseWizardBody as CloseWizardSchema,
  stage2CloseWizard200Response as CloseWizardResponseSchema,
  stage2SynchronizeManagerBody as SynchronizeManagerSchema,
  stage2SynchronizeManager200Response as SynchronizeManagerResponseSchema,
  stage2CompleteStageBody as CompleteStageSchema,
  stage2CompleteStage200Response as CompleteStageResponseSchema,
  stage2CheckReadinessToProceedParams as CheckReadinessToProceedParamsSchema,
  stage2CheckReadinessToProceed200Response as CheckReadinessToProceedResponseSchema,
  stage2ValidateCurrentStateParams as ValidateCurrentStateParamsSchema,
  stage2ValidateCurrentState200Response as ValidateCurrentStateResponseSchema,
} from '@/shared/api/generated/wizard/zod/aksiApi';

import { z } from 'zod';

// UI форми для Item Manager
export const itemSearchFormSchema = z.object({
  searchTerm: z.string().min(1, 'Введіть назву предмета для пошуку'),
});

export const itemFilterFormSchema = z.object({
  categoryId: z.string().optional(),
  priceRange: z
    .object({
      min: z.number().min(0).optional(),
      max: z.number().min(0).optional(),
    })
    .optional(),
  sortBy: z.enum(['name', 'price', 'category', 'dateAdded']).default('name'),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
});

export const itemManagerSettingsSchema = z.object({
  autoSave: z.boolean().default(true),
  showAdvancedOptions: z.boolean().default(false),
  itemsPerPage: z.number().min(5).max(50).default(10),
  enableQuickActions: z.boolean().default(true),
});

// Типи для UI форм
export type ItemSearchFormData = z.infer<typeof itemSearchFormSchema>;
export type ItemFilterFormData = z.infer<typeof itemFilterFormSchema>;
export type ItemManagerSettingsData = z.infer<typeof itemManagerSettingsSchema>;
