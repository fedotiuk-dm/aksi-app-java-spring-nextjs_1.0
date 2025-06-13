// Схеми для Stage1 Client Creation - ТІЛЬКИ створення клієнтів
// Використовуємо готові Orval схеми та мінімальні UI форми тільки для відсутніх в API

import { z } from 'zod';

// =================== ORVAL СХЕМИ ===================

// Реекспорт Zod схем для валідації - ТІЛЬКИ створення клієнтів
export {
  // Client creation operations
  stage1CreateClientParams as CreateClientParamsSchema,
  stage1CreateClient200Response as CreateClientResponseSchema,
  stage1InitializeNewClient200Response as InitializeNewClientResponseSchema,
  stage1CompleteClientCreationParams as CompleteClientCreationParamsSchema,

  // Client form operations (для створення)
  stage1GetClientFormDataParams as GetClientFormDataParamsSchema,
  stage1GetClientFormData200Response as GetClientFormDataResponseSchema,
  stage1UpdateClientDataParams as UpdateClientDataParamsSchema,
  stage1UpdateClientDataBody as UpdateClientDataBodySchema,
  stage1ValidateClientFormParams as ValidateClientFormParamsSchema,
  stage1ValidateClientForm200Response as ValidateClientFormResponseSchema,
} from '../../../../shared/api/generated/stage1';

// =================== МІНІМАЛЬНІ UI ФОРМИ (тільки для відсутніх в API) ===================

// Форма створення клієнта (UI тільки)
export const clientCreationFormSchema = z.object({
  firstName: z.string().min(2, 'Мінімум 2 символи').max(50),
  lastName: z.string().min(2, 'Мінімум 2 символи').max(50),
  phone: z.string().min(10, 'Мінімум 10 символів').max(15),
  email: z.string().email('Невірний email').optional().or(z.literal('')),
  address: z.string().max(200).optional(),
});

// Форма валідації (UI тільки)
export const validationFormSchema = z.object({
  validateOnChange: z.boolean().default(true),
  showValidationErrors: z.boolean().default(true),
});

// Форма налаштувань створення (UI тільки)
export const creationSettingsFormSchema = z.object({
  autoSave: z.boolean().default(true),
  confirmBeforeCreate: z.boolean().default(false),
});

// =================== ТИПИ ДЛЯ UI ФОРМ ===================
export type ClientCreationFormData = z.infer<typeof clientCreationFormSchema>;
export type ValidationFormData = z.infer<typeof validationFormSchema>;
export type CreationSettingsFormData = z.infer<typeof creationSettingsFormSchema>;
