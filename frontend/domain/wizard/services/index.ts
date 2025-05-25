/**
 * @fileoverview Головний файл експорту сервісів домену wizard
 * @module domain/wizard/services
 * @author AKSI Team
 * @since 1.0.0
 *
 * Сервіси організовані за SOLID принципами:
 * - Single Responsibility: кожен сервіс має одну відповідальність
 * - Open/Closed: легко розширювати без модифікації існуючого коду
 * - Liskov Substitution: правильне використання інтерфейсів
 * - Interface Segregation: малі, специфічні інтерфейси
 * - Dependency Inversion: залежність від абстракцій
 */

// === БАЗОВІ ІНТЕРФЕЙСИ ===
export * from './interfaces';

// === КЛІЄНТСЬКІ СЕРВІСИ ===
export * from './client';

// === СЕРВІСИ ЦІНОУТВОРЕННЯ ===
export * from './pricing';

// === СЕРВІСИ ЗАМОВЛЕНЬ ===
export * from './order';

// === СЕРВІСИ ФІЛІЙ ===
export * from './branch';

// === СЕРВІСИ ПРЕДМЕТІВ ===
export * from './item';

/**
 * Колекція всіх сервісів для зручного доступу
 */
export const wizardServices = {
  // Клієнти
  clientSearch: () => import('./client').then((m) => m.clientSearchService),
  clientCreation: () => import('./client').then((m) => m.clientCreationService),

  // Ціни
  priceCalculation: () => import('./pricing').then((m) => m.priceCalculationService),
  priceList: () => import('./pricing').then((m) => m.priceListService),
  priceModifier: () => import('./pricing').then((m) => m.priceModifierService),
  priceDiscount: () => import('./pricing').then((m) => m.priceDiscountService),

  // Замовлення
  orderCreation: () => import('./order').then((m) => m.orderCreationService),
  orderSearch: () => import('./order').then((m) => m.orderSearchService),
  orderManagement: () => import('./order').then((m) => m.orderManagementService),
  orderStats: () => import('./order').then((m) => m.orderStatsService),

  // Предмети
  itemCreation: () => import('./item').then((m) => m.itemCreationService),
  itemManagement: () => import('./item').then((m) => m.itemManagementService),
  itemPhoto: () => import('./item').then((m) => m.itemPhotoService),
} as const;
