/**
 * @fileoverview ДОМЕННА конфігурація Orval за принципом "DDD inside, FSD outside"
 *
 * 🎯 Філософія: "Кожен домен - окремий модуль + композиція в UI"
 *
 * ✅ Що генерується для КОЖНОГО домену:
 * - {domain}Api.ts - всі React Query хуки (useQuery, useMutation)
 * - {domain}Api.schemas.ts - всі TypeScript типи
 * - schemas.zod.ts - всі Zod схеми для валідації
 * - index.ts - BARREL EXPORT (публічне API домену)
 *
 * 📁 Результат:
 * shared/api/generated/
 *   ├── client/           # Client Domain
 *   │   ├── clientApi.ts              - хуки (useClients, useCreateClient тощо)
 *   │   ├── clientApi.schemas.ts      - типи (ClientResponse, CreateClientRequest тощо)
 *   │   ├── schemas.zod.ts            - Zod схеми
 *   │   └── index.ts                  - BARREL: export * from './clientApi'
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
 * ✅ import { useCreateClient } from '@/shared/api/generated/client'
 * ✅ import { useBranches } from '@/shared/api/generated/branch'
 * ✅ import { useCreateOrder } from '@/shared/api/generated/order'
 * ✅ import { useServiceCategories } from '@/shared/api/generated/item'
 *
 * 🎯 ORDER WIZARD: UI компоненти використовують композицію доменних API
 */

import type { Config } from '@orval/core';

// 🔧 Константи
const API_BASE_URL = process.env.ORVAL_API_URL || 'http://localhost:8080/api/v3/api-docs';
const MUTATOR_PATH = './lib/api/orval-fetcher.ts';
const MUTATOR_NAME = 'orvalFetcher';

// 🎯 ДОМЕННІ ТЕГИ (синхронізовані з backend OpenAPI)
const DOMAIN_TAGS = {
  // 👤 Client Domain
  client: ['clients', 'client-search', 'client-contacts'],

  // 🏢 Branch Domain
  branch: ['branches', 'working-schedule', 'receipt-numbers', 'branch-statistics'],

  // 📦 Order Domain
  order: ['orders', 'order-items', 'order-calculations', 'order-completion'],

  // 🏷️ Item Domain
  item: ['service-categories', 'price-list', 'price-modifiers', 'item-calculations', 'item-photos'],

  // 📄 Document Domain
  document: ['receipts', 'documents', 'digital-signatures', 'qr-codes', 'pdf-generation'],
};

// 🏭 Фабрика для створення доменних конфігурацій
const createDomainConfig = (name: string, tags: string[]) => ({
  // React Query хуки + типи для домену
  [`${name}-api`]: {
    input: {
      target: API_BASE_URL,
      filters: {
        tags,
      },
    },
    output: {
      target: `./shared/api/generated/${name}/${name}Api.ts`,
      client: 'react-query' as const,
      mode: 'split' as const,
      // 📝 Кастомні назви файлів
      schemas: `${name}Api.schemas.ts`,
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

  // Zod схеми для домену
  [`${name}-zod`]: {
    input: {
      target: API_BASE_URL,
      filters: {
        tags,
      },
    },
    output: {
      target: `./shared/api/generated/${name}/schemas.zod.ts`,
      client: 'zod' as const,
      mode: 'single' as const,
      override: {
        zod: {
          generate: {
            body: true,
            param: true,
            query: true,
            header: true,
            response: true,
          },
          // 🛡️ Zod strict режим для "zero trust" API
          strict: {
            param: true,
            query: true,
            header: true,
            body: true,
            response: true,
          },
          // 🔧 Автоматичне перетворення типів
          coerce: {
            param: true,
            query: true,
            body: true,
            response: true,
          },
          generateEachHttpStatus: true,
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
});

const config: Config = {
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
