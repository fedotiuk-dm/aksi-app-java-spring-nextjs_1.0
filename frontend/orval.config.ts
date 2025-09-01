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
 *   │   ├── authApi.ts                - хуки (useLogin, useLogout, useGetSessionInfo тощо)
 *   │   ├── index.ts                  - типи + BARREL: export * from './authApi'
 *   │   └── schemas.zod.ts            - Zod схеми
 *   ├── user/             # User Domain
 *   │   ├── userApi.ts                - хуки (useListUsers, useCreateUser, useUpdateUser тощо)
 *   │   ├── index.ts                  - типи + BARREL: export * from './userApi'
 *   │   └── schemas.zod.ts            - Zod схеми
 *   ├── customer/         # Customer Domain
 *   │   ├── customerApi.ts            - хуки (useListCustomers, useCreateCustomer тощо)
 *   │   ├── index.ts                  - типи + BARREL: export * from './customerApi'
 *   │   └── schemas.zod.ts            - Zod схеми
 *   ├── branch/           # Branch Domain
 *   │   ├── branchApi.ts              - хуки (useListBranches, useGetBranch тощо)
 *   │   ├── index.ts                  - типи + BARREL: export * from './branchApi'
 *   │   └── schemas.zod.ts            - Zod схеми
 *   ├── cart/             # Cart Domain
 *   │   ├── cartApi.ts                - хуки (useGetCart, useAddCartItem, useClearCart тощо)
 *   │   ├── index.ts                  - типи + BARREL: export * from './cartApi'
 *   │   └── schemas.zod.ts            - Zod схеми
 *   ├── order/            # Order Domain
 *   │   ├── orderApi.ts               - хуки (useListOrders, useCreateOrder, useUpdateOrder тощо)
 *   │   ├── index.ts                  - типи + BARREL: export * from './orderApi'
 *   │   └── schemas.zod.ts            - Zod схеми
 *   ├── pricing/          # Pricing Domain
 *   │   ├── pricingApi.ts             - хуки (useCalculatePrice1, useListModifiers тощо)
 *   │   ├── index.ts                  - типи + BARREL: export * from './pricingApi'
 *   │   └── schemas.zod.ts            - Zod схеми
 *   ├── priceList/        # Service Item Domain
 *   │   ├── priceListApi.ts           - хуки (useListServices, useListItems, useGetServiceItemPrice тощо)
 *   │   ├── index.ts                  - типи + BARREL: export * from './priceListApi'
 *   │   └── schemas.zod.ts            - Zod схеми
 *   ├── receipt/          # Receipt Domain
 *   │   ├── receiptApi.ts             - хуки (useGenerateOrderReceipt, useEmailOrderReceipt тощо)
 *   │   ├── index.ts                  - типи + BARREL: export * from './receiptApi'
 *   │   └── schemas.zod.ts            - Zod схеми
 *   └── file/             # File Domain
 *       ├── fileApi.ts                - хуки (useServeFile тощо)
 *       ├── index.ts                  - типи + BARREL: export * from './fileApi'
 *       └── schemas.zod.ts            - Zod схеми
 *   └── game/             # Game Services Domain
 *       ├── gameApi.ts                - хуки (useListGames, useCreateGame, useListBoosters, useCalculatePrice тощо)
 *       ├── index.ts                  - типи + BARREL: export * from './gameApi'
 *       └── schemas.zod.ts            - Zod схеми
 *
 * 🚀 ПЕРЕВАГИ КОМПОЗИЦІЇ:
 * ✅ import { useLogin } from '@/shared/api/generated/auth'
 * ✅ import { useListUsers } from '@/shared/api/generated/user'
 * ✅ import { useCreateCustomer } from '@/shared/api/generated/customer'
 * ✅ import { useListBranches } from '@/shared/api/generated/branch'
 * ✅ import { useGetCart, useAddCartItem } from '@/shared/api/generated/cart'
 * ✅ import { useListOrders, useCreateOrder } from '@/shared/api/generated/order'
 * ✅ import { useCalculatePrice1 as useCalculatePrice } from '@/shared/api/generated/pricing' // Order pricing calculator
 * ✅ import { useListServices } from '@/shared/api/generated/priceList'
 * ✅ import { useGenerateOrderReceipt } from '@/shared/api/generated/receipt'
 * ✅ import { useServeFile } from '@/shared/api/generated/file'
 * ✅ import { useListGames, useListBoosters, useCalculatePrice } from '@/shared/api/generated/game' // Game boosting calculator
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
  auth: ['auth'],

  // 👥 User Domain
  user: ['users'],

  // 👤 Customer Domain
  customer: ['customer'],

  // 🏢 Branch Domain
  branch: ['branches'],

  // 🛒 Cart Domain
  cart: ['cart'],

  // 📋 Order Domain
  order: ['orders'],

  // 💰 Pricing Domain
  pricing: ['pricing'],

  // 🏷️ Service Item Domain
  serviceItem: ['price-list'],

  // 📄 Receipt Domain
  receipt: ['receipts'],

  // 📁 File Domain
  file: ['files'],

  // 🎮 Game Services Domain
  game: [
    'games',
    'difficulty-levels',
    'service-types',
    'price-configurations',
    'boosters',
    'calculator',
  ],
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

  // 👤 CUSTOMER DOMAIN
  ...createDomainConfig('customer', DOMAIN_TAGS.customer),

  // 🏢 BRANCH DOMAIN
  ...createDomainConfig('branch', DOMAIN_TAGS.branch),

  // 🛒 CART DOMAIN
  ...createDomainConfig('cart', DOMAIN_TAGS.cart),

  // 📋 ORDER DOMAIN
  ...createDomainConfig('order', DOMAIN_TAGS.order),

  // 💰 PRICING DOMAIN
  ...createDomainConfig('pricing', DOMAIN_TAGS.pricing),

  // 🏷️ SERVICE ITEM DOMAIN
  ...createDomainConfig('priceList', DOMAIN_TAGS.serviceItem),

  // 📄 RECEIPT DOMAIN
  ...createDomainConfig('receipt', DOMAIN_TAGS.receipt),

  // 📁 FILE DOMAIN
  ...createDomainConfig('file', DOMAIN_TAGS.file),

  // 🎮 GAME SERVICES DOMAIN
  ...createDomainConfig('game', DOMAIN_TAGS.game),
};

export default config;
