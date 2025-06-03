/**
 * @fileoverview Розширена конфігурація Orval для доменної генерації API + Zod схеми
 *
 * Структура генерації відповідає доменам бекенду:
 * backend/src/main/java/com/aksi/domain/
 *   ├── auth/       → shared/api/generated/auth/ (API + Zod)
 *   ├── branch/     → shared/api/generated/branch/ (API + Zod)
 *   ├── client/     → shared/api/generated/client/ (API + Zod)
 *   ├── order/      → shared/api/generated/order/ (API + Zod)
 *   ├── pricing/    → shared/api/generated/pricing/ (API + Zod)
 *   └── user/       → shared/api/generated/user/ (API + Zod)
 *
 * 🔥 Advanced features:
 * - tags-split: Розбивка API по доменах
 * - zod: Схеми валідації з автогенерацією
 * - mutator: Глобальний fetch з error handling та interceptors
 * - queryOptions: Кеш, retry, staleTime, gcTime, тощо
 * - CI автогенерація: Скрипти для автоматичного оновлення
 */

import type { Config } from '@orval/core';

// 🔧 Константи конфігурації
const API_BASE_URL = 'http://localhost:8080/api/v3/api-docs';
const MUTATOR_PATH = './lib/api/orval-fetcher.ts';
const MUTATOR_NAME = 'orvalFetcher';

// 🎯 Маппінг тегів OpenAPI на домени бекенду
const DOMAIN_TAG_MAPPING = {
  // 🔐 Домен auth - автентифікація та авторизація
  auth: ['Authentication'],

  // 🏢 Домен branch - пункти прийому замовлень
  branch: ['Branch Locations API'],

  // 👤 Домен client - клієнти та їх підписи
  client: ['Clients', 'Client - Signatures'],

  // 📦 Домен order - замовлення та пов'язані операції (без OrderWizard)
  order: [
    'Orders',
    'Order Completion',
    'OrderFinalization',
    'Order Summary',
    'Order Discounts',
    'Additional Requirements for Order',
    'Order Item Photos',
    'Payment for Order',
  ],

  // 🧙‍♂️ Домен order-wizard - майстер створення замовлень (окремо винесено)
  'order-wizard': ['Order Wizard'],

  // 💰 Домен pricing - ціноутворення та прайс-листи
  pricing: [
    'Price Calculator',
    'Price List',
    'Service Category',
    'Unit Of Measure',
    'Price Modifiers',
    'Pricing - Modifier Recommendations',
    'Item Characteristics',
    'Pricing - Stain Types',
    'Pricing - Defect Types',
  ],

  // 👥 Домен user - користувачі системи (якщо є окремі API)
  user: [],

  // 🧾 Додаткові сервіси
  receipt: ['Receipt'],

  // 🧪 Тестові endpoints
  test: ['Test'],
};

// 🏗️ Функція для створення конфігурації домену (React Query + API)
const createDomainConfig = (domainName: string, tags: string[], outputPath: string) => ({
  input: {
    target: API_BASE_URL,
    filters: {
      tags,
    },
  },
  output: {
    target: outputPath,
    client: 'react-query' as const,
    mode: 'split' as const,
    override: {
      // 🔧 Кастомний mutator з error handling
      mutator: {
        path: MUTATOR_PATH,
        name: MUTATOR_NAME,
        default: true,
      },

      // 🎣 React Query конфігурація з advanced options
      query: {
        useQuery: true,
        useMutation: true,
        useInfinite: true, // Додаємо infinite queries
        signal: true, // Підтримка AbortController
      },

      // ⚙️ Конфігурація Query Options (нова назва)
      queryOptions: {
        staleTime: 5 * 60 * 1000, // 5 хвилин
        gcTime: 10 * 60 * 1000, // 10 хвилин
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
      },

      // 🔧 Конфігурація Mutation Options
      mutationOptions: {
        onError: (error: Error) => {
          console.error('Mutation error:', error);
        },
      },
    },
  },

  // 🪝 Post-generation hooks
  hooks: {
    afterAllFilesWrite: [
      'node ./scripts/create-api-index.js',
      `echo "✅ Generated ${domainName} API"`,
    ],
  },
});

// 🔥 Функція для створення конфігурації Zod схем
const createZodConfig = (domainName: string, tags: string[], outputPath: string) => ({
  input: {
    target: API_BASE_URL,
    filters: {
      tags,
    },
  },
  output: {
    target: `${outputPath}/zod`,
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
        // Генеруємо схеми для кожного HTTP статусу
        generateEachHttpStatus: true,
      },
    },
  },

  // 🪝 Post-generation hooks для Zod
  hooks: {
    afterAllFilesWrite: [
      `node ./scripts/create-zod-index.js ${domainName}`,
      `echo "✅ Generated ${domainName} Zod schemas"`,
    ],
  },
});

const config: Config = {};

// 🏗️ Генеруємо конфігурацію для кожного домену
Object.entries(DOMAIN_TAG_MAPPING).forEach(([domainName, tags]) => {
  // Пропускаємо домени без тегів
  if (tags.length === 0) return;

  const outputPath = `./shared/api/generated/${domainName}`;

  // 1️⃣ React Query API клієнт з advanced features
  config[`${domainName}-api`] = createDomainConfig(domainName, tags, outputPath);

  // 2️⃣ Zod схеми з розширеними можливостями
  config[`${domainName}-zod`] = createZodConfig(domainName, tags, outputPath);
});

// 🌟 Додаткова конфігурація для повного API (без фільтрації)
config['full-api'] = {
  input: {
    target: API_BASE_URL,
  },
  output: {
    target: './shared/api/generated/full',
    client: 'react-query' as const,
    mode: 'split' as const,
    override: {
      mutator: {
        path: MUTATOR_PATH,
        name: MUTATOR_NAME,
        default: true,
      },
      query: {
        useQuery: true,
        useMutation: true,
        useInfinite: true,
        signal: true,
        options: {
          staleTime: 5 * 60 * 1000,
          gcTime: 10 * 60 * 1000,
          refetchOnWindowFocus: false,
          refetchOnReconnect: true,
        },
      },
    },
  },
  hooks: {
    afterAllFilesWrite: ['node ./scripts/create-api-index.js', 'echo "✅ Generated full API"'],
  },
};

// 🔥 Повні Zod схеми
config['full-zod'] = {
  input: {
    target: API_BASE_URL,
  },
  output: {
    target: './shared/api/generated/full/zod',
    client: 'zod' as const,
    mode: 'split' as const,
    override: {
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
      'node ./scripts/create-zod-index.js full',
      'echo "✅ Generated full Zod schemas"',
    ],
  },
};

export default config;
