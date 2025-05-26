/**
 * @fileoverview Головний експорт доменних сервісів Order Wizard
 * @module domain/wizard/services
 *
 * Архітектура "DDD inside, FSD outside" - всі сервіси організовані за етапами Order Wizard
 *
 * ЕТАПИ ORDER WIZARD:
 * 1. Клієнт та базова інформація замовлення
 * 2. Менеджер предметів (циклічний процес)
 * 3. Загальні параметри замовлення
 * 4. Підтвердження та завершення
 *
 * @generated Автоматично згенеровано 2025-05-26T02:40:31.019Z
 * @generator scripts/generate-services-index.js
 */

// ===== ОСНОВНІ ЕКСПОРТИ ПО ЕТАПАХ =====

// ЕТАП 1: КЛІЄНТ ТА БАЗОВА ІНФОРМАЦІЯ ЗАМОВЛЕННЯ
export * from './stage-1-client-and-order-info';

// ЕТАП 2: МЕНЕДЖЕР ПРЕДМЕТІВ
//export * from './stage-2-item-management';

// ЕТАП 3: ЗАГАЛЬНІ ПАРАМЕТРИ ЗАМОВЛЕННЯ
//export * from './stage-3-order-configuration';

// ЕТАП 4: ПІДТВЕРДЖЕННЯ ТА ЗАВЕРШЕННЯ
//export * from './stage-4-order-finalization';

// СПІЛЬНІ СЕРВІСИ
export * from './shared';


