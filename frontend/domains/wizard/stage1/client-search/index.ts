// Публічне API для Stage1 Client Search домену
// Експортуємо тільки головний хук та необхідні типи

// Головний хук
export { useClientSearch } from './use-client-search.hook';
export type { UseClientSearchReturn } from './use-client-search.hook';

// Схеми тільки якщо потрібні в UI компонентах
export {
  quickSearchFormSchema,
  searchFiltersFormSchema,
  clientSelectionFormSchema,
  displaySettingsFormSchema,
} from './schemas';

export type {
  QuickSearchFormData,
  SearchFiltersFormData,
  ClientSelectionFormData,
  DisplaySettingsFormData,
} from './schemas';
