/**
 * @fileoverview Публічне API для client selection хуків
 * @module domain/wizard/hooks/steps/client-selection
 *
 * Експорт хуків для етапу 1 Order Wizard:
 * - Пошук клієнтів з пагінацією
 * - Створення нових клієнтів з валідацією
 * - Вибір клієнта для замовлення
 */

// === ХУКИ ЕТАПУ 1: ВИБІР КЛІЄНТА ===
export { useClientSearch } from './use-client-search.hook';
export { useClientForm } from './use-client-form.hook';
export { useClientSelection } from './use-client-selection.hook';
