/**
 * @fileoverview Головний файл експорту хуків wizard домену
 * @module domain/wizard/hooks
 */

// === НАВІГАЦІЯ ===
export * from './navigation';

// === ЕТАП 1: Клієнт та замовлення ===
export * from './stage-1-client-and-order';

// === ЕТАП 2: Управління предметами ===
export * from './stage-2-item-management';

// === ЕТАП 3: Параметри замовлення ===
export * from './stage-3-order-params';

// === ЕТАП 4: Підтвердження та завершення ===
export * from './stage-4-confirmation';

// === СПІЛЬНІ ХУКИ ===
export * from './shared';

// === ГОЛОВНИЙ КОМПОЗИЦІЙНИЙ ХУК ===
export { useWizardComposition } from './use-wizard-composition.hook';
