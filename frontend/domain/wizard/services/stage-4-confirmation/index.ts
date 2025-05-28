/**
 * @fileoverview Централізований експорт сервісів Stage-4: Підтвердження та завершення
 * @module domain/wizard/services/stage-4-confirmation
 */

// ===============================================
// СЕРВІСИ STAGE-4: ПІДТВЕРДЖЕННЯ ТА ЗАВЕРШЕННЯ
// ===============================================
// ✅ На основі: OrderWizard instruction_structure logic.md
// ✅ Етап 4: Підтвердження та завершення з формуванням квитанції (5 підетапів)

// 4.1: Перегляд замовлення з детальним розрахунком
export * from './order-review';

// 4.2: Юридичні аспекти
export * from './legal-aspects';

// 4.3: Валідація замовлення
export * from './order-validation';

// 4.4: Генерація квитанції
export * from './receipt-generation';

// 4.5: Завершення процесу
export * from './completion';
