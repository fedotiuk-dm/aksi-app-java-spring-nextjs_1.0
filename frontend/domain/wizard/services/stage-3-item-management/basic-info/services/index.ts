/**
 * @fileoverview Експорт всіх сервісів basic-info
 * @module domain/wizard/services/stage-3-item-management/basic-info/services
 */

// === ОСНОВНІ СЕРВІСИ ===
export * from './service-category-manager.service';
export * from './price-list-manager.service';
export * from './basic-info-validator.service';
export * from './basic-info-manager.service';

// === ГОЛОВНИЙ ЕКСПОРТ ===
export { basicInfoManagerService as default } from './basic-info-manager.service';
