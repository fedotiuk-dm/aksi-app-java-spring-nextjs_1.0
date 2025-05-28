/**
 * @fileoverview Stage 1 Stores - Stores для етапу "Клієнт та базова інформація"
 * @module domain/wizard/store/stage-1
 * @author AKSI Team
 * @since 1.0.0
 */

// === ВИБІР ТА СТВОРЕННЯ КЛІЄНТА ===
export { useClientSelectionStore, type ClientSelectionStore } from './client-selection.store';

// === БАЗОВА ІНФОРМАЦІЯ ЗАМОВЛЕННЯ ===
export { useOrderBasicInfoStore, type OrderBasicInfoStore } from './order-basic-info.store';
