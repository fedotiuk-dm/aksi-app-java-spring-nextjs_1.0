// Головний хук - єдина точка входу для UI компонентів
export { useClientSearch } from './use-client-search.hook';
export type { UseClientSearchReturn } from './use-client-search.hook';

// Схеми форм (якщо потрібні для валідації в UI)
export { searchFormSchema, phoneFormSchema } from './client-search.schemas';
export type { SearchFormData, PhoneFormData } from './client-search.schemas';

// Zustand стор (якщо потрібен прямий доступ)
export { useClientSearchStore } from './client-search.store';
