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
 *   └── serviceItem/      # Service Item Domain
 *       ├── serviceItemApi.ts         - хуки (useListServices, useListItems, useGetServiceItemPrice тощо)
 *       ├── index.ts                  - типи + BARREL: export * from './serviceItemApi'
 *       └── schemas.zod.ts            - Zod схеми
 *
 * 🚀 ПЕРЕВАГИ КОМПОЗИЦІЇ:
 * ✅ import { useLogin } from '@/shared/api/generated/auth'
 * ✅ import { useListUsers } from '@/shared/api/generated/user'
 * ✅ import { useCreateCustomer } from '@/shared/api/generated/customer'
 * ✅ import { useListServices } from '@/shared/api/generated/serviceItem'
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
  customer: ['customers'],

  // 🏷️ Service Item Domain
  serviceItem: ['services', 'items', 'service-items'],
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

  // 🏷️ SERVICE ITEM DOMAIN
  ...createDomainConfig('serviceItem', DOMAIN_TAGS.serviceItem),
};

export default config;
