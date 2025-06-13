/**
 * @fileoverview Головне публічне API Wizard домену
 *
 * 🎯 Order Wizard Domain - Публічні операційні хуки
 * Відповідальність:
 * - Експорт операційних хуків для features
 * - Експорт типів для UI компонентів
 * - Приховування внутрішньої структури етапів
 */

// 🎯 Main - Головне управління Order Wizard
export * from './main';

// 🔍 Stage1 - Клієнт та базова інформація замовлення
export * from './stage1';

// 🎭 Stage2 - Менеджер предметів (TODO)
// export * from './stage2';

// 🎨 Stage3 - Загальні параметри (TODO)
// export * from './stage3';

// 🎯 Stage4 - Підтвердження та квитанція (TODO)
// export * from './stage4';
