/**
 * @fileoverview Головний експорт доменного шару Order Wizard
 *
 * Цей файл експортує всі хуки, типи та утиліти для Order Wizard,
 * організовані за принципом DDD (Domain Driven Design)
 */

// Експорт всіх хуків за етапами
export * from './hooks';

// Експорт схем валідації (коли будуть створені)
export * from './schemas/stage-1-client-and-order.schema';
