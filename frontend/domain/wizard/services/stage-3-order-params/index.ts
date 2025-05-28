/**
 * @fileoverview Централізований експорт сервісів Stage-3: Загальні параметри замовлення
 * @module domain/wizard/services/stage-3-order-params
 */

// ===============================================
// СЕРВІСИ STAGE-3: ЗАГАЛЬНІ ПАРАМЕТРИ ЗАМОВЛЕННЯ
// ===============================================
// ✅ На основі: OrderWizard instruction_structure logic.md
// ✅ Етап 3: Загальні параметри замовлення (4 підетапи)

// 3.1: Параметри виконання
export * from './execution-params';

// 3.2: Глобальні знижки
export * from './global-discounts';

// 3.3: Обробка платежів
export * from './payment-processing';

// 3.4: Додаткова інформація
export * from './additional-info';
