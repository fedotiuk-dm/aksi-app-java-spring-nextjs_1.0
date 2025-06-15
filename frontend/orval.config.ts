/**
 * @fileoverview МОДУЛЬНА конфігурація Orval з підготовкою для BARREL EXPORTS
 *
 * 🎯 Філософія: "Мінімум файлів, максимум логіки + чисті імпорти"
 *
 * ✅ Що генерується:
 * - aksiApi.ts - всі React Query хуки (useQuery, useMutation)
 * - aksiApi.schemas.ts - всі TypeScript типи
 * - schemas.zod.ts - всі Zod схеми для валідації
 * - index.ts - BARREL EXPORT (створюється окремим скриптом)
 *
 * 📁 Результат:
 * shared/api/generated/
 *   ├── auth/
 *   │   ├── aksiApi.ts              - React Query хуки (useLogin, useLogout тощо)
 *   │   ├── aksiApi.schemas.ts      - TypeScript типи
 *   │   ├── schemas.zod.ts          - Zod схеми
 *   │   └── index.ts                - 🔥 BARREL: export * from './aksiApi'
 *   ├── stage1/
 *   │   ├── aksiApi.ts              - React Query хуки (useStage1SearchClients тощо)
 *   │   ├── aksiApi.schemas.ts      - TypeScript типи
 *   │   ├── schemas.zod.ts          - Zod схеми
 *   │   └── index.ts                - 🔥 BARREL: всі експорти в одному місці
 *   └── ...
 *
 * 🚀 ПЕРЕВАГИ BARREL EXPORTS:
 * ✅ Замість: import { useStage1SearchClients } from '@/shared/api/generated/stage1/aksiApi'
 * ✅ Стає:    import { useStage1SearchClients } from '@/shared/api/generated/stage1'
 *
 * ✅ Замість: import { ClientResponse } from '@/shared/api/generated/stage1/aksiApi.schemas'
 * ✅ Стає:    import { ClientResponse } from '@/shared/api/generated/stage1'
 *
 * ✅ Замість: import { clientSearchCriteriaSchema } from '@/shared/api/generated/stage1/schemas.zod'
 * ✅ Стає:    import { clientSearchCriteriaSchema } from '@/shared/api/generated/stage1'
 */

import type { Config } from '@orval/core';

// 🔧 Константи
const API_BASE_URL = 'http://localhost:8080/api/v3/api-docs';
const MUTATOR_PATH = './lib/api/orval-fetcher.ts';
const MUTATOR_NAME = 'orvalFetcher';

// 🎯 Теги для модулів
const TAGS = {
  auth: ['Authentication'],
  orders: ['Orders'],
  stage1: ['Order Wizard - Stage 1'],
  stage2: ['Order Wizard - Stage 2'],
  substep1: ['Order Wizard - Stage 2 Substep 1'],
  substep2: ['Order Wizard - Stage 2 Substep 2'],
  substep3: ['Order Wizard - Stage 2 Substep 3'],
  substep4: ['Order Wizard - Stage 2 Substep 4'],
  substep5: ['Order Wizard - Stage 2 Substep 5'],
  stage3: ['Order Wizard - Stage 3'],
  stage4: ['Order Wizard - Stage 4'],
  main: ['Order Wizard - Main API'],
};

// 🏭 Фабрика для створення модульних конфігурацій
const createModuleConfig = (name: string, tags: string[]) => ({
  // React Query хуки + типи для модуля
  [`${name}-api`]: {
    input: {
      target: API_BASE_URL,
      filters: {
        tags,
      },
    },
    output: {
      target: `./shared/api/generated/${name}`,
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
      },
    },
  },

  // Zod схеми для модуля
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
      },
    },
  },
});

const config: Config = {
  // 🔐 Authentication
  ...createModuleConfig('auth', TAGS.auth),

  // 📦 Orders API (OrderDraft, CRUD operations)
  ...createModuleConfig('orders', TAGS.orders),

  // 🔥 Order Wizard - Stage 1
  ...createModuleConfig('stage1', TAGS.stage1),

  // 🔥 Order Wizard - Stage 2
  ...createModuleConfig('stage2', TAGS.stage2),

  // 🔥 Order Wizard - Substeps
  ...createModuleConfig('substep1', TAGS.substep1),
  ...createModuleConfig('substep2', TAGS.substep2),
  ...createModuleConfig('substep3', TAGS.substep3),
  ...createModuleConfig('substep4', TAGS.substep4),
  ...createModuleConfig('substep5', TAGS.substep5),

  // 🔥 Order Wizard - Stage 3
  ...createModuleConfig('stage3', TAGS.stage3),

  // 🔥 Order Wizard - Stage 4
  ...createModuleConfig('stage4', TAGS.stage4),

  // 🔥 Order Wizard - Main API
  ...createModuleConfig('main', TAGS.main),
};

export default config;
