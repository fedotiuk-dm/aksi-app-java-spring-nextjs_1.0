// 🌍 ГЛОБАЛЬНИЙ BARREL для всіх DOMAIN API модулів
// Згенеровано: 2025-07-25T20:06:45.269Z
// Не редагуйте вручну - файл буде перезаписаний при наступній генерації
//
// 💡 Цей файл дозволяє імпортувати з будь-якого домену API:
// import { useClients, useBranches, useCreateOrder, ClientResponse } from '@/shared/api/generated';
//
// 🏗️ Архітектура: "DDD inside, FSD outside"
// Кожен домен має власний набір API хуків, типів та Zod схем
//
// 🎯 Доступні домени:
// - auth: 🔧 Домен auth
// - branch: 🏢 Branch Domain - філії, графік роботи, статистика філій
// - client: 👤 Client Domain - управління клієнтами, пошук, контакти
// - document: 📄 Document Domain - квитанції, документи, цифрові підписи
// - item: 🏷️ Item Domain - категорії послуг, прайс-лист, розрахунки вартості
// - order: 📦 Order Domain - замовлення, розрахунки, завершення замовлень
// - user: 🔧 Домен user

// 🔧 Домен auth
export * from './auth';

// 🏢 Branch Domain - філії, графік роботи, статистика філій
export * from './branch';

// 👤 Client Domain - управління клієнтами, пошук, контакти
export * from './client';

// 📄 Document Domain - квитанції, документи, цифрові підписи
export * from './document';

// 🏷️ Item Domain - категорії послуг, прайс-лист, розрахунки вартості
export * from './item';

// 📦 Order Domain - замовлення, розрахунки, завершення замовлень
export * from './order';

// 🔧 Домен user
export * from './user';

// 🔄 Re-export всіх типів для зручності TypeScript
export type * from './auth';
export type * from './branch';
export type * from './client';
export type * from './document';
export type * from './item';
export type * from './order';
export type * from './user';

// 📚 ПРИКЛАДИ ВИКОРИСТАННЯ:
//
// 👤 Client Domain:
//   import { useClients, useCreateClient, ClientResponse } from '@/shared/api/generated';
//
// 🏢 Branch Domain:
//   import { useBranches, BranchResponse } from '@/shared/api/generated';
//
// 📦 Order Domain:
//   import { useOrders, useCreateOrder, OrderResponse } from '@/shared/api/generated';
//
// 🏷️ Item Domain:
//   import { useServiceCategories, usePriceList, ItemResponse } from '@/shared/api/generated';
//
// 📄 Document Domain:
//   import { useReceipts, useDocuments, DocumentResponse } from '@/shared/api/generated';
