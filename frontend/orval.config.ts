/**
 * @fileoverview МОДУЛЬНА конфігурація Orval: Генерація по папках з простими назвами
 *
 * 🎯 Філософія: "Мінімум файлів, максимум логіки"
 *
 * ✅ Що генерується:
 * - api.ts - всі Axios функції модуля
 * - schemas.ts - всі TypeScript типи модуля
 * - schemas.zod.ts - всі Zod схеми модуля
 * - index.ts - автоматичний експорт
 *
 * 📁 Результат:
 * shared/api/generated/
 *   ├── auth/
 *   │   ├── api.ts               - Всі Axios функції auth
 *   │   ├── schemas.ts           - Всі TypeScript типи auth
 *   │   ├── schemas.zod.ts       - Всі Zod схеми auth
 *   │   └── index.ts             - Автоматичний експорт
 *   ├── stage1/
 *   │   ├── api.ts               - Всі Axios функції stage1
 *   │   ├── schemas.ts           - Всі TypeScript типи stage1
 *   │   ├── schemas.zod.ts       - Всі Zod схеми stage1
 *   │   └── index.ts             - Автоматичний експорт
 *   └── ...
 */

import type { Config } from '@orval/core';

// 🔧 Константи
const API_BASE_URL = 'http://localhost:8080/api/v3/api-docs';
const MUTATOR_PATH = './lib/api/orval-fetcher.ts';
const MUTATOR_NAME = 'orvalFetcher';

// 🎯 Теги для модулів
const TAGS = {
  auth: ['Authentication'],
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
  // Axios API клієнт + типи для модуля
  [`${name}-api`]: {
    input: {
      target: API_BASE_URL,
      filters: {
        tags,
      },
    },
    output: {
      target: `./shared/api/generated/${name}`,
      client: 'axios' as const,
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
