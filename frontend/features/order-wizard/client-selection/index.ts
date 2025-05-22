/**
 * Експорти модуля вибору клієнта
 * Об'єднує та експортує функціональність для вибору/створення клієнта
 */

// UI компоненти
export * from './ui';

// Реекспортуємо хуки для роботи з клієнтами
export * from './hooks';

// Типи та константи з моделі
export * from './model/types';
export * from './model/constants';
export * from './model/client-sources';

// Експортуємо стор з його функціями
export * from './model/store';

// Експортуємо тільки схеми валідації з schemas,
// але не типи (використовуємо типи з model/types)
export {
  // Схеми для джерел та каналів
  clientSourceItemSchema,
  clientSourceSchema,
  communicationChannelSchema,

  // Схеми для даних клієнта
  addressSchema,
  simpleClientSchema,
  clientBaseSchema,

  // Схеми для форм
  clientFormSchema,
  createClientSchema,
  editClientSchema,
  clientSelectionFormSchema,
  clientSelectionSchema,
  clientSearchSchema,
} from './schemas/client.schema';
