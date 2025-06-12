/**
 * @fileoverview Конфігурація Orval з фільтрацією тільки для Order Wizard контролерів
 *
 * Генерує тільки вибрані контролери:
 * - Stage 1, 2, 3, 4 Controllers
 * - Substep 1, 2, 3, 4, 5 Controllers
 * - OrderWizardMainController
 *
 * Структура:
 * shared/api/generated/wizard/
 *   ├── aksiApi.ts              - React Query хуки для Order Wizard API
 *   ├── aksiApi.schemas.ts      - TypeScript типи
 *   └── zod/
 *       └── aksiApi.ts          - Zod схеми для валідації
 *
 * 🔥 Features:
 * - Тільки Order Wizard домени
 * - React Query хуки з advanced налаштуваннями
 * - Zod схеми з повною валідацією
 * - Типізовані API клієнти
 * - Автоматичне оновлення індексних файлів
 */

import type { Config } from '@orval/core';

// 🔧 Константи конфігурації
const API_BASE_URL = 'http://localhost:8080/api/v3/api-docs';
const MUTATOR_PATH = './lib/api/orval-fetcher.ts';
const MUTATOR_NAME = 'orvalFetcher';

// 🎯 Теги Order Wizard контролерів для фільтрації (оновлено після стандартизації бекенду)
const ORDER_WIZARD_TAGS = [
  'Order Wizard - Stage 1',
  'Order Wizard - Stage 2',
  'Order Wizard - Stage 3',
  'Order Wizard - Stage 4',
  'Order Wizard - Stage 2 Substep 1',
  'Order Wizard - Stage 2 Substep 2',
  'Order Wizard - Stage 2 Substep 3',
  'Order Wizard - Stage 2 Substep 4',
  'Order Wizard - Stage 2 Substep 5',
  'Order Wizard - Main API',
];

const config: Config = {
  // 🌟 Order Wizard API клієнт (React Query + TypeScript типи)
  'wizard-api': {
  input: {
    target: API_BASE_URL,
      // 🔍 Фільтрація тільки по Order Wizard тегах
    filters: {
        tags: ORDER_WIZARD_TAGS,
    },
  },
  output: {
      target: './shared/api/generated/wizard',
    client: 'react-query' as const,
    mode: 'split' as const,
    override: {
      // 🔧 Кастомний mutator з error handling
      mutator: {
        path: MUTATOR_PATH,
        name: MUTATOR_NAME,
        default: true,
      },

        // 🎣 React Query конфігурація (без застарілих options)
      query: {
        useQuery: true,
        useMutation: true,
        useInfinite: true, // Додаємо infinite queries
        signal: true, // Підтримка AbortController
        },
      },
    },
  hooks: {
    afterAllFilesWrite: [
      'node ./scripts/create-api-index.js',
        'echo "✅ Generated Order Wizard API"',
    ],
    },
  },

  // 🔥 Order Wizard Zod схеми
  'wizard-zod': {
  input: {
    target: API_BASE_URL,
      // 🔍 Фільтрація тільки по Order Wizard тегах
    filters: {
        tags: ORDER_WIZARD_TAGS,
    },
  },
  output: {
      target: './shared/api/generated/wizard/zod',
    client: 'zod' as const,
    mode: 'split' as const,
    override: {
      // 🔧 Zod-специфічні налаштування
      zod: {
        generate: {
          body: true,
          param: true,
          query: true,
          header: true,
          response: true,
        },
        strict: {
          param: true,
          query: true,
          header: true,
          body: true,
          response: true,
        },
        generateEachHttpStatus: true,
      },
    },
  },
  hooks: {
      afterAllFilesWrite: [
        'node ./scripts/create-zod-index.js wizard',
        'echo "✅ Generated Order Wizard Zod schemas"',
    ],
    },
  },
};

export default config;
