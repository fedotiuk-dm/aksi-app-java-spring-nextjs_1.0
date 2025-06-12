import { z } from 'zod';

// Експортуємо готові Zod схеми з Orval
export {
  // Client Search schemas
  stage1SearchClientsBody as ClientSearchCriteriaSchema,
  stage1SearchClients200Response as ClientSearchResultsSchema,

  // Phone Search schemas
  stage1SearchClientsByPhoneQueryParams as PhoneSearchParamsSchema,
  stage1SearchClientsByPhone200Response as PhoneSearchResultsSchema,

  // Client Selection schemas
  stage1SelectClientParams as ClientSelectionParamsSchema,

  // Basic types
  stage1GetClientSearchState200Response as ClientSearchStateSchema,
} from '@/shared/api/generated/wizard/zod/aksiApi';

/**
 * Схема для форми загального пошуку
 * (розширює API схему локальними полями для UI)
 */
export const searchFormSchema = z.object({
  searchTerm: z.string().min(2, 'Мінімум 2 символи').max(100, 'Максимум 100 символів'),
  sessionId: z.string().uuid(),
});

/**
 * Схема для форми пошуку за телефоном
 * (розширює API схему локальними полями для UI)
 */
export const phoneFormSchema = z.object({
  phoneNumber: z.string().min(10, 'Некоректний телефон').max(15, 'Занадто довгий телефон'),
  sessionId: z.string().uuid(),
});

// Типи для форм
export type SearchFormData = z.infer<typeof searchFormSchema>;
export type PhoneFormData = z.infer<typeof phoneFormSchema>;
