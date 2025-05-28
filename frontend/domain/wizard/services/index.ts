/**
 * @fileoverview Головний індекс сервісів Order Wizard
 * @module domain/wizard/services
 *
 * Всі сервіси дотримуються принципу МІНІМАЛІЗМУ:
 * - Розмір < 100 рядків
 * - Тільки композиція адаптерів + валідація Zod
 * - БЕЗ дублювання функціональності
 */

// ===== STAGE 1: CLIENT AND ORDER =====
export * from './stage-1-client-and-order/index';

// // ===== STAGE 2: ITEM MANAGEMENT (всі мінімалістські) =====
// export * from './stage-2-item-management/index';

// // ===== STAGE 3: ORDER PARAMS (всі з адаптерів) =====
// export * from './stage-3-order-params/index';

// // ===== STAGE 4: CONFIRMATION (всі з адаптерів) =====
// export * from './stage-4-confirmation/index';
