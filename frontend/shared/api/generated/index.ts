// 🌍 ГЛОБАЛЬНИЙ BARREL для всіх DOMAIN API модулів
// Згенеровано: 2025-08-01T21:02:16.088Z
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
// - customer: 🔧 Домен customer
// - serviceItem: 🔧 Домен serviceItem
// - user: 🔧 Домен user

// 🔧 Домен auth
export * from './auth';

// 🔧 Домен customer
export * from './customer';

// 🔧 Домен serviceItem
export * from './serviceItem';

// 🔧 Домен user
export * from './user';

// 🔄 Re-export всіх типів для зручності TypeScript
export type * from './auth';
export type * from './customer';
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
