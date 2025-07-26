/**
 * @fileoverview ДОМЕННА конфігурація Orval за принципом "DDD inside, FSD outside"
 *
 * 🎯 Філософія: "Кожен домен - окремий модуль + композиція в UI"
 *
 * ✅ Що генерується для КОЖНОГО домену:
 * - {domain}Api.ts - всі React Query хуки (useQuery, useMutation)
 * - index.ts - TypeScript типи + BARREL EXPORT
 * - schemas.zod.ts - всі Zod схеми для валідації
 *
 * 📁 Результат:
 * shared/api/generated/
 *   ├── auth/             # Auth Domain
 *   │   ├── authApi.ts                - хуки (useLogin, useRefreshToken тощо)
 *   │   ├── index.ts                  - типи + BARREL: export * from './authApi'
 *   │   └── schemas.zod.ts            - Zod схеми
 *   ├── user/             # User Domain
 *   │   ├── userApi.ts                - хуки (useUsers, useCreateUser тощо)
 *   │   ├── index.ts                  - типи + BARREL: export * from './userApi'
 *   │   └── schemas.zod.ts            - Zod схеми
 *   ├── client/           # Client Domain
 *   │   ├── clientApi.ts              - хуки (useClients, useCreateClient тощо)
 *   │   └── ...
 *   ├── branch/           # Branch Domain
 *   │   ├── branchApi.ts              - хуки (useBranches, useCreateBranch тощо)
 *   │   └── ...
 *   ├── order/            # Order Domain
 *   │   ├── orderApi.ts               - хуки (useOrders, useCreateOrder тощо)
 *   │   └── ...
 *   ├── item/             # Item Domain
 *   │   ├── itemApi.ts                - хуки (useServiceCategories, usePriceList тощо)
 *   │   └── ...
 *   └── document/         # Document Domain
 *       ├── documentApi.ts            - хуки (useReceipts, useDocuments тощо)
 *       └── ...
 *
 * 🚀 ПЕРЕВАГИ КОМПОЗИЦІЇ:
 * ✅ import { useLogin } from '@/shared/api/generated/auth'
 * ✅ import { useUsers } from '@/shared/api/generated/user'
 * ✅ import { useCreateClient } from '@/shared/api/generated/client'
 * ✅ import { useBranches } from '@/shared/api/generated/branch'
 * ✅ import { useCreateOrder } from '@/shared/api/generated/order'
 * ✅ import { useServiceCategories } from '@/shared/api/generated/item'
 *
 * 🎯 ORDER WIZARD: UI компоненти використовують композицію доменних API
 */

import type { Config } from '@orval/core';

// 🔧 Константи
const API_BASE_URL = process.env.ORVAL_API_URL || 'http://localhost:8080/v3/api-docs';
const MUTATOR_PATH = './lib/api/orval-fetcher.ts';
const MUTATOR_NAME = 'orvalFetcher';

// 🎯 ДОМЕННІ ТЕГИ (синхронізовані з backend OpenAPI)
const DOMAIN_TAGS = {
  // 🔐 Auth Domain
  auth: ['auth-controller'],

  // 👥 User Domain
  user: ['users'],

  // 👤 Client Domain
  client: ['clients'],

  // 🏢 Branch Domain
  branch: ['branches'],

  // 📦 Order Domain
  order: ['orders'],

  // 🏷️ Item Domain
  item: ['items', 'service-categories', 'price-list'],

  // 📄 Document Domain
  document: ['documents', 'receipts'],
};

// 🏭 Фабрика для створення доменних конфігурацій
const createDomainConfig = (name: string, tags: string[]) => ({
  // React Query хуки
  [`${name}-hooks`]: {
    input: {
      target: API_BASE_URL,
      filters: {
        mode: 'include' as const,
        tags,
      },
    },
    output: {
      target: `shared/api/generated/${name}`,
      client: 'react-query' as const,
      mode: 'split' as const,
      override: {
        mutator: {
          path: MUTATOR_PATH,
          name: MUTATOR_NAME,
          default: true,
        },
        requestOptions: true,
        query: {
          useQuery: true,
          useInfiniteQuery: true,
          useMutation: true,
          version: 5 as const,
        },
        // 🔐 Basic Auth для доступу до OpenAPI
        requestConfig: {
          auth: {
            username: 'admin',
            password: 'admin123',
          },
        },
      },
    },
  },
  // Zod схеми
  [`${name}-zod`]: {
    input: {
      target: API_BASE_URL,
      filters: {
        mode: 'include' as const,
        tags,
      },
    },
    output: {
      target: `shared/api/generated/${name}/schemas.zod.ts`,
      client: 'zod' as const,
      mode: 'single' as const,
      override: {
        // 🔐 Basic Auth для доступу до OpenAPI
        requestConfig: {
          auth: {
            username: 'admin',
            password: 'admin123',
          },
        },
      },
    },
  },
});

const config: Config = {
  // 🔐 AUTH DOMAIN
  ...createDomainConfig('auth', DOMAIN_TAGS.auth),

  // 👥 USER DOMAIN
  ...createDomainConfig('user', DOMAIN_TAGS.user),

  // 👤 CLIENT DOMAIN
  ...createDomainConfig('client', DOMAIN_TAGS.client),

  // 🏢 BRANCH DOMAIN
  ...createDomainConfig('branch', DOMAIN_TAGS.branch),

  // 📦 ORDER DOMAIN
  ...createDomainConfig('order', DOMAIN_TAGS.order),

  // 🏷️ ITEM DOMAIN
  ...createDomainConfig('item', DOMAIN_TAGS.item),

  // 📄 DOCUMENT DOMAIN
  ...createDomainConfig('document', DOMAIN_TAGS.document),
};

export default config;
