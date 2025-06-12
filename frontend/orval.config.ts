/**
 * @fileoverview СПРОЩЕНА конфігурація Orval: Дозволяємо Orval робити свою роботу
 *
 * 🎯 Філософія: "Orval знає як створювати файли - не заважаємо йому"
 *
 * ✅ Що генерується АВТОМАТИЧНО:
 * - Тонкі Axios клієнти (БЕЗ React Query)
 * - Індекси для експорту
 * - Zod схеми для валідації
 * - TypeScript типи
 *
 * 📁 Результат (автоматично):
 * shared/api/generated/wizard/
 *   ├── aksiApi.ts           - Тонкі Axios функції
 *   ├── aksiApi.schemas.ts   - TypeScript типи
 *   ├── index.ts             - Автоматичний індекс
 *   └── zod/
 *       ├── aksiApi.ts       - Zod схеми
 *       └── index.ts         - Автоматичний індекс
 */

import type { Config } from '@orval/core';

// 🔧 Константи
const API_BASE_URL = 'http://localhost:8080/api/v3/api-docs';
const MUTATOR_PATH = './lib/api/orval-fetcher.ts';
const MUTATOR_NAME = 'orvalFetcher';

// 🎯 Теги для фільтрації
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

const AUTH_TAGS = ['Authentication'];

const config: Config = {
  // 🔐 Authentication API - Тонкі Axios клієнти
  'auth-api': {
    input: {
      target: API_BASE_URL,
      filters: {
        tags: AUTH_TAGS,
      },
    },
    output: {
      target: './shared/api/generated/auth',
      client: 'axios', // 🎯 Тільки axios - БЕЗ react-query
      mode: 'split', // Orval САМ створить індекси
      override: {
        mutator: {
          path: MUTATOR_PATH,
          name: MUTATOR_NAME,
          default: true,
        },
      },
    },
  },

  // 🔐 Authentication Zod схеми
  'auth-zod': {
    input: {
      target: API_BASE_URL,
      filters: {
        tags: AUTH_TAGS,
      },
    },
    output: {
      target: './shared/api/generated/auth/zod',
      client: 'zod',
      mode: 'split', // Orval САМ створить індекси
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

  // 🔥 Order Wizard - Тонкі Axios клієнти
  'wizard-api': {
    input: {
      target: API_BASE_URL,
      filters: {
        tags: ORDER_WIZARD_TAGS,
      },
    },
    output: {
      target: './shared/api/generated/wizard',
      client: 'axios', // 🎯 Тільки axios - БЕЗ react-query
      mode: 'split', // Orval САМ створить індекси
      override: {
        mutator: {
          path: MUTATOR_PATH,
          name: MUTATOR_NAME,
          default: true,
        },
      },
    },
  },

  // 🔥 Zod схеми
  'wizard-zod': {
    input: {
      target: API_BASE_URL,
      filters: {
        tags: ORDER_WIZARD_TAGS,
      },
    },
    output: {
      target: './shared/api/generated/wizard/zod',
      client: 'zod',
      mode: 'split', // Orval САМ створить індекси
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
            param: true, // Строга валідація параметрів
            query: true, // Строга валідація query
            header: true, // Строга валідація заголовків
            body: true, // Строга валідація body
            response: true, // Строга валідація відповіді
          },
          // 🔧 Автоматичне перетворення типів (базова підтримка)
          coerce: {
            param: true, // Перетворює параметри
            query: true, // Перетворює query
            body: true, // Перетворює body поля
            response: true, // Перетворює response поля
          },
          generateEachHttpStatus: true,
        },
      },
    },
  },
};

export default config;
