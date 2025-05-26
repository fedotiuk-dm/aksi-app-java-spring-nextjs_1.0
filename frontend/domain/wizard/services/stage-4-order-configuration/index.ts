/**
 * @fileoverview ЕТАП 3: ЗАГАЛЬНІ ПАРАМЕТРИ ЗАМОВЛЕННЯ
 * @module domain/wizard/services/stage-3-order-configuration
 *
 * Налаштування дат, знижок та оплати
 *
 * @generated Автоматично згенеровано 2025-05-26T02:42:54.700Z
 * @generator scripts/generate-stage-indexes.js
 */

// ===== ЕКСПОРТИ З ПІДМОДУЛІВ =====

// export * from './completion-date'; // індекс файл не існує
// export * from './discount-management'; // індекс файл не існує
// export * from './payment-configuration'; // індекс файл не існує

// ===== РЕЕКСПОРТИ ДЛЯ ЗРУЧНОСТІ =====


// ===== КОНФІГУРАЦІЯ ЕТАПУ =====

export const STAGE_CONFIG = {
  name: 'stage-3-order-configuration',
  title: 'ЕТАП 3: ЗАГАЛЬНІ ПАРАМЕТРИ ЗАМОВЛЕННЯ',
  description: 'Налаштування дат, знижок та оплати',
  submodules: [
  "completion-date",
  "discount-management",
  "payment-configuration"
],
  availableModules: ['completion-date', 'discount-management', 'payment-configuration'],
  availableFiles: [],
} as const;
