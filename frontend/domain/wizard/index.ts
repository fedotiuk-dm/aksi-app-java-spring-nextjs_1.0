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
 * ВАЖЛИВО: Прості імпорти до конкретних файлів для кращого контролю
 */

// === ТИПИ ТА ЕНУМИ ===
export * from './types';

// === УТИЛІТИ ===
export * from './utils';

// === ZOD СХЕМИ ВАЛІДАЦІЇ ===
export * from './schemas';

// === КОНСТАНТИ ===
export * from './constants';

// === XSTATE V5 МАШИНИ ===
export * from './machines';

// === СЕРВІСИ (BUSINESS LOGIC) ===
export * from './services';

// === HOOKS (DOMAIN LOGIC) ===
export * from './hooks';

// === ZUSTAND STORES ===
export * from './store';
