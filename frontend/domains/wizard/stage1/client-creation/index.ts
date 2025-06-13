// Публічне API для Stage1 Client Creation домену
// Експортуємо тільки головний хук та необхідні типи

// Головний хук
export { useClientCreation } from './use-client-creation.hook';
export type { UseClientCreationReturn } from './use-client-creation.hook';

// Схеми тільки якщо потрібні в UI компонентах
export {
  clientCreationFormSchema,
  validationFormSchema,
  creationSettingsFormSchema,
} from './schemas';

export type {
  ClientCreationFormData,
  ValidationFormData,
  CreationSettingsFormData,
} from './schemas';

// Селектори для зручності
export { useIsFormValid, useCanCreateClient, useFormData } from './client-creation.store';
