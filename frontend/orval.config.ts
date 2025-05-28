/**
 * @fileoverview Оптимізована конфігурація Orval для доменної генерації API
 *
 * Структура генерації відповідає доменам бекенду:
 * backend/src/main/java/com/aksi/domain/
 *   ├── auth/       → shared/api/generated/auth/
 *   ├── branch/     → shared/api/generated/branch/
 *   ├── client/     → shared/api/generated/client/
 *   ├── order/      → shared/api/generated/order/
 *   ├── pricing/    → shared/api/generated/pricing/
 *   └── user/       → shared/api/generated/user/
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

  // 📦 Домен order - замовлення та пов'язані операції
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

// 🏗️ Функція для створення конфігурації домену
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
      mutator: {
        path: MUTATOR_PATH,
        name: MUTATOR_NAME,
        default: true,
      },
      query: {
        useQuery: true,
        useMutation: true,
        useInfinite: false,
      },
    },
  },
  hooks: {
    afterAllFilesWrite: 'node ./scripts/create-api-index.js',
  },
});

const config: Config = {};

// 🏗️ Генеруємо конфігурацію для кожного домену
Object.entries(DOMAIN_TAG_MAPPING).forEach(([domainName, tags]) => {
  // Пропускаємо домени без тегів
  if (tags.length === 0) return;

  const outputPath = `./shared/api/generated/${domainName}`;
  config[`${domainName}-api`] = createDomainConfig(domainName, tags, outputPath);
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
        useInfinite: false,
      },
    },
  },
  hooks: {
    afterAllFilesWrite: 'node ./scripts/create-api-index.js',
  },
};

export default config;
