// ЕТАП 1: Схеми для головного управління Order Wizard
// Використовуємо готові Orval схеми з перейменуванням для зрозумілості

// Експорт готових Zod схем з Orval для Order Wizard операцій
export {
  // Запуск Order Wizard
  orderWizardStart200Response as WizardStartResponseSchema,

  // Завершення етапів (використовуємо Params замість Body)
  orderWizardCompleteStage1Params as CompleteStage1RequestSchema,
  orderWizardCompleteStage1200Response as CompleteStage1ResponseSchema,
  orderWizardCompleteStage2Params as CompleteStage2RequestSchema,
  orderWizardCompleteStage2200Response as CompleteStage2ResponseSchema,
  orderWizardCompleteStage3Params as CompleteStage3RequestSchema,
  orderWizardCompleteStage3200Response as CompleteStage3ResponseSchema,

  // Завершення замовлення
  orderWizardCompleteOrderParams as CompleteOrderRequestSchema,
  orderWizardCompleteOrder200Response as CompleteOrderResponseSchema,

  // Скасування
  orderWizardCancelOrderParams as CancelOrderRequestSchema,
  orderWizardCancelOrder200Response as CancelOrderResponseSchema,
} from '@/shared/api/generated/wizard/zod/aksiApi';

// Локальні UI схеми (якщо потрібно)
import { z } from 'zod';

// Схема для стану етапів
export const stageStateSchema = z.object({
  stage: z.number().min(1).max(4),
  isCompleted: z.boolean(),
  canProceed: z.boolean(),
});

// Схема для навігації візарда
export const wizardNavigationSchema = z.object({
  currentStage: z.number().min(1).max(4),
  availableStages: z.array(z.number()),
  completedStages: z.array(z.number()),
});

// TypeScript типи
export type StageState = z.infer<typeof stageStateSchema>;
export type WizardNavigation = z.infer<typeof wizardNavigationSchema>;
