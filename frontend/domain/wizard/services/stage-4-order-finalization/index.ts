/**
 * @fileoverview ЕТАП 4: ПІДТВЕРДЖЕННЯ ТА ЗАВЕРШЕННЯ
 * @module domain/wizard/services/stage-4-order-finalization
 *
 * Перегляд, підтвердження та генерація квитанції
 *
 * @generated Автоматично згенеровано 2025-05-26T02:42:54.701Z
 * @generator scripts/generate-stage-indexes.js
 */

// ===== ЕКСПОРТИ З ПІДМОДУЛІВ =====

// export * from './legal-agreement'; // індекс файл не існує
// export * from './order-review'; // індекс файл не існує
// export * from './receipt-generation'; // індекс файл не існує

// ===== РЕЕКСПОРТИ ДЛЯ ЗРУЧНОСТІ =====


// ===== КОНФІГУРАЦІЯ ЕТАПУ =====

export const STAGE_CONFIG = {
  name: 'stage-4-order-finalization',
  title: 'ЕТАП 4: ПІДТВЕРДЖЕННЯ ТА ЗАВЕРШЕННЯ',
  description: 'Перегляд, підтвердження та генерація квитанції',
  submodules: [
  "order-review",
  "legal-agreement",
  "receipt-generation"
],
  availableModules: ['legal-agreement', 'order-review', 'receipt-generation'],
  availableFiles: [],
} as const;
