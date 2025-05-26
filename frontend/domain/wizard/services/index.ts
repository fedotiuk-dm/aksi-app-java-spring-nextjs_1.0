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

