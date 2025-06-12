/**
 * @fileoverview Публічне API домену "Створення клієнта"
 *
 * Експортує тільки необхідні елементи для використання в UI
 * Приховує внутрішню реалізацію домену
 */

// Головний композиційний хук (основний експорт)
export { useClientCreation } from './use-client-creation.hook';
export type { UseClientCreationReturn } from './use-client-creation.hook';

// Розділені хуки (для продвинутого використання)
export { useClientCreationAPI } from './use-client-creation-api.hook';
export type { UseClientCreationAPIReturn } from './use-client-creation-api.hook';

export { useClientCreationBusiness } from './use-client-creation-business.hook';
export type { UseClientCreationBusinessReturn } from './use-client-creation-business.hook';

export { useClientCreationForms } from './use-client-creation-forms.hook';
export type { UseClientCreationFormsReturn } from './use-client-creation-forms.hook';

export { useClientCreationNavigation } from './use-client-creation-navigation.hook';
export type { UseClientCreationNavigationReturn } from './use-client-creation-navigation.hook';

// Схеми (для валідації в UI)
export { clientCreationUIFormSchema } from './client-creation.schemas';

export type { ClientCreationUIFormData } from './client-creation.schemas';

// Стор (рідко потрібен напряму, але може бути корисний)
export { useClientCreationStore } from './client-creation.store';
