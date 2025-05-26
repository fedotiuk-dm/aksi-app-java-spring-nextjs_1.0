/**
 * @fileoverview ЕТАП 2: МЕНЕДЖЕР ПРЕДМЕТІВ
 * @module domain/wizard/services/stage-2-item-management
 *
 * Циклічний процес додавання та налаштування предметів
 *
 * @generated Автоматично згенеровано 2025-05-26T02:42:54.698Z
 * @generator scripts/generate-stage-indexes.js
 */

// ===== ЕКСПОРТИ З ПІДМОДУЛІВ =====

// export * from './defects-and-risks'; // індекс файл не існує
// export * from './item-characteristics'; // індекс файл не існує
// export * from './item-wizard'; // індекс файл не існує
// export * from './photo-management'; // індекс файл не існує
// export * from './price-calculation'; // індекс файл не існує

// ===== РЕЕКСПОРТИ ДЛЯ ЗРУЧНОСТІ =====


// ===== КОНФІГУРАЦІЯ ЕТАПУ =====

export const STAGE_CONFIG = {
  name: 'stage-2-item-management',
  title: 'ЕТАП 2: МЕНЕДЖЕР ПРЕДМЕТІВ',
  description: 'Циклічний процес додавання та налаштування предметів',
  submodules: [
  "item-wizard",
  "item-characteristics",
  "defects-and-risks",
  "price-calculation",
  "photo-management"
],
  availableModules: ['defects-and-risks', 'item-characteristics', 'item-wizard', 'photo-management', 'price-calculation'],
  availableFiles: [],
} as const;
