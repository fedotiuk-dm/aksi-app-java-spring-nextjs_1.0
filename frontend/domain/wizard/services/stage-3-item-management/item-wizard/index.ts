/**
 * @fileoverview Item Wizard - менеджер предметів для Order Wizard
 * @module domain/wizard/services/stage-3-item-management/item-wizard
 */

// Експортуємо типи, інтерфейси та сервіси
export * from './types';
export * from './interfaces';
export * from './services';

// ===== КОНФІГУРАЦІЯ ПІДМОДУЛЯ =====

export const SUBMODULE_CONFIG = {
  name: 'item-wizard',
  title: 'Item Wizard',
  stage: 'stage-3-item-management',
  availableFiles: [],
  availableDirs: ['interfaces', 'services', 'types'],
} as const;
