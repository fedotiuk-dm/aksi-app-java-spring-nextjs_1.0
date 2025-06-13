// Схеми для Stage1 Client Search - ТІЛЬКИ пошук клієнтів
// Використовуємо готові Orval схеми та мінімальні UI форми тільки для відсутніх в API

import { z } from 'zod';

// =================== ORVAL СХЕМИ ===================

// Реекспорт Zod схем для валідації - ТІЛЬКИ пошук клієнтів
export {
  // Client search operations
  stage1SearchClientsParams as SearchClientsParamsSchema,
  stage1SearchClientsBody as SearchClientsBodySchema,
  stage1SearchClients200Response as SearchClientsResponseSchema,
  stage1SearchClientsByPhoneParams as SearchClientsByPhoneParamsSchema,
  stage1SearchClientsByPhoneQueryParams as SearchClientsByPhoneQueryParamsSchema,
  stage1SearchClientsByPhone200Response as SearchClientsByPhoneResponseSchema,

  // Client selection operations (частина пошуку)
  stage1SelectClientParams as SelectClientParamsSchema,
  stage1SelectClientQueryParams as SelectClientQueryParamsSchema,
} from '../../../../shared/api/generated/stage1';

// =================== МІНІМАЛЬНІ UI ФОРМИ (тільки для відсутніх в API) ===================

// Форма швидкого пошуку (UI тільки)
export const quickSearchFormSchema = z.object({
  searchTerm: z.string().min(2, 'Мінімум 2 символи').max(100),
  searchType: z.enum(['name', 'phone', 'email']).default('name'),
});

// Форма фільтрів пошуку (UI тільки)
export const searchFiltersFormSchema = z.object({
  showActiveOnly: z.boolean().default(true),
  sortBy: z.enum(['name', 'phone', 'createdAt']).default('name'),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
});

// Форма підтвердження вибору клієнта (UI тільки)
export const clientSelectionFormSchema = z.object({
  selectedClientId: z.string().uuid('Невірний ID клієнта'),
  confirmSelection: z.boolean().default(false),
});

// Форма налаштувань відображення (UI тільки)
export const displaySettingsFormSchema = z.object({
  showDetails: z.boolean().default(true),
  itemsPerPage: z.number().min(5).max(50).default(10),
});

// =================== ТИПИ ДЛЯ UI ФОРМ ===================
export type QuickSearchFormData = z.infer<typeof quickSearchFormSchema>;
export type SearchFiltersFormData = z.infer<typeof searchFiltersFormSchema>;
export type ClientSelectionFormData = z.infer<typeof clientSelectionFormSchema>;
export type DisplaySettingsFormData = z.infer<typeof displaySettingsFormSchema>;
