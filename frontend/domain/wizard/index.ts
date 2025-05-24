/**
 * @fileoverview Wizard Domain - доменна логіка для управління Order Wizard
 * @module domain/wizard
 * @author AKSI Team
 * @since 1.0.0
 */

/**
 * Публічне API для wizard домену
 * Експорт всіх компонентів згідно з архітектурою "DDD inside, FSD outside"
 *
 * ВАЖЛИВО: Експортуємо все з підмодулів через їх публічні API (index.ts)
 * щоб мати гарантію що нічого не пропустили
 */

// === ТИПИ ТА ЕНУМИ ===
export * from './types';

// === УТИЛІТИ ===
export * from './utils';

// === АДАПТЕРИ API → DOMAIN ===
export * from './adapters';

// === ZOD СХЕМИ ВАЛІДАЦІЇ ===
export * from './schemas';

// === КОНСТАНТИ ===
export * from './constants';

// === FLOW MANAGEMENT (XSTATE) ===
export * from './flow';
