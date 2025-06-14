// 📋 SUBSTEP2 WORKFLOW: Схеми для координації характеристик предмета
// Реекспорт Orval схем + мінімальні UI форми

import { z } from 'zod';

// =================== ORVAL СХЕМИ ===================
export type {
  OrderItemDTO,
  AdditionalInfoDTO,
  SubstepResultDTO,
  ErrorResponse,
} from '@api/substep2';

// =================== МІНІМАЛЬНІ UI ФОРМИ ===================

// Форма ініціалізації workflow
export const initializationFormSchema = z.object({
  sessionId: z.string().min(1, "Session ID обов'язковий"),
  orderId: z.string().optional(),
  itemId: z.string().optional(),
});

export type InitializationFormData = z.infer<typeof initializationFormSchema>;

// Форма навігації
export const navigationFormSchema = z.object({
  skipValidation: z.boolean().default(false),
});

export type NavigationFormData = z.infer<typeof navigationFormSchema>;

// Форма завершення
export const completionFormSchema = z.object({
  saveProgress: z.boolean().default(true),
  proceedToNext: z.boolean().default(true),
});

export type CompletionFormData = z.infer<typeof completionFormSchema>;
