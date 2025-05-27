/**
 * @fileoverview Експорт всіх сервісів характеристик предметів
 * @module domain/wizard/services/stage-3-item-management/item-characteristics/services
 */

// === ОСНОВНІ СЕРВІСИ ===
export * from './characteristics-loader.service';
export * from './characteristics-validator.service';
export * from './characteristics-operations.service';
export * from './characteristics-manager.service';

// === ГОЛОВНИЙ ЕКСПОРТ ===
export { characteristicsManagerService as default } from './characteristics-manager.service';
