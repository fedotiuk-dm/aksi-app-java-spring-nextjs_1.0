// Публічне API для Client Search домену

// =================== ГОЛОВНІ ХУКИ ===================
export { useClientSearch } from './use-client-search.hook';
export type { UseClientSearchReturn } from './use-client-search.hook';

// Розширений хук з debounce та workflow
export { useClientSearchDebounce } from './use-client-search-debounce.hook';
export type { UseClientSearchDebounceReturn } from './use-client-search-debounce.hook';

// =================== СТОР ТА СЕЛЕКТОРИ ===================
export { useClientSearchStore } from './client-search.store';

// =================== ORVAL СХЕМИ (якщо потрібні в UI) ===================
export {
  // Zod схеми
  SearchClientsParamsSchema,
  SearchClientsBodySchema,
  SearchClientsResponseSchema,
  SearchClientsByPhoneParamsSchema,
  SearchClientsByPhoneQueryParamsSchema,
  SearchClientsByPhoneResponseSchema,
  SelectClientParamsSchema,
  SelectClientQueryParamsSchema,

  // UI форми схеми
  quickSearchFormSchema,
  searchFiltersFormSchema,
  clientSelectionFormSchema,
  displaySettingsFormSchema,

  // TypeScript типи для UI форм
  type QuickSearchFormData,
  type SearchFiltersFormData,
  type ClientSelectionFormData,
  type DisplaySettingsFormData,
} from './schemas';
