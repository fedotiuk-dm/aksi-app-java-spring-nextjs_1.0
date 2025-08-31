// 🌍 ГЛОБАЛЬНИЙ BARREL для всіх DOMAIN API модулів
// Згенеровано: 2025-08-31T21:33:22.680Z
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
// - file: 🔧 Домен file
// - game: 🔧 Домен game
// - order: 📦 Order Domain - замовлення, розрахунки, завершення замовлень
// - priceList: 🔧 Домен priceList
// - pricing: 🔧 Домен pricing
// - receipt: 🔧 Домен receipt
// - user: 🔧 Домен user

// 🔧 Домен auth
export * from './auth';

// 🏢 Branch Domain - філії, графік роботи, статистика філій
export * from './branch';

// 🔧 Домен cart
export * from './cart';

// 🔧 Домен customer
export * from './customer';

// 🔧 Домен file
export * from './file';

// 🔧 Домен game
export * from './game';

// 📦 Order Domain - замовлення, розрахунки, завершення замовлень
export * from './order';

// 🔧 Домен priceList
export * from './priceList';

// 🔧 Домен pricing
export * from './pricing';

// 🔧 Домен receipt
export * from './receipt';

// 🔧 Домен user
export * from './user';

// 🔄 Re-export всіх типів для зручності TypeScript
export type * from './auth';
export type * from './branch';
export type * from './cart';
export type * from './customer';
export type * from './file';
export type * from './game';
export type * from './order';
export type * from './priceList';
export type * from './pricing';
export type * from './receipt';
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
