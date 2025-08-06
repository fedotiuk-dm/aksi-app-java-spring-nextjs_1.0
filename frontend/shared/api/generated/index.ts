// 🌍 ГЛОБАЛЬНИЙ BARREL для всіх DOMAIN API модулів
// Згенеровано: 2025-08-06T21:04:47.840Z
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
// - cart: 🔧 Домен cart
// - customer: 🔧 Домен customer
// - order: 📦 Order Domain - замовлення, розрахунки, завершення замовлень
// - pricing: 🔧 Домен pricing
// - serviceItem: 🔧 Домен serviceItem
// - user: 🔧 Домен user

// 🔧 Домен auth
export * from './auth';

// 🏢 Branch Domain - філії, графік роботи, статистика філій
export * from './branch';

// 🔧 Домен cart
export * from './cart';

// 🔧 Домен customer
export * from './customer';

// 📦 Order Domain - замовлення, розрахунки, завершення замовлень
export * from './order';

// 🔧 Домен pricing
export * from './pricing';

// 🔧 Домен serviceItem
export * from './serviceItem';

// 🔧 Домен user
export * from './user';

// 🔄 Re-export всіх типів для зручності TypeScript
export type * from './auth';
export type * from './branch';
export type * from './cart';
export type * from './customer';
export type * from './order';
export type * from './pricing';
export type * from './serviceItem';
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
