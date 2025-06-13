/**
 * @fileoverview Головний індексний файл для UI компонентів Order Wizard
 *
 * Експортує всі UI компоненти Order Wizard за принципом "DDD inside, FSD outside"
 * UI компоненти є "тонкими" - вся бізнес-логіка в доменному шарі
 */

// 🎯 Головний контейнер Order Wizard
export { OrderWizardContainer } from './OrderWizardContainer';

// 🔍 Stage 1: Клієнт та базова інформація замовлення
// ✅ НОВІ СПРОЩЕНІ КОМПОНЕНТИ (РЕКОМЕНДОВАНІ)
export { Stage1Container } from './stage1/Stage1Container';

// 🛍️ Stage 2: Менеджер предметів (буде додано пізніше)
// export {
//   Stage2ItemManager,
//   ItemWizard,
//   ItemBasicInfo,
//   ItemCharacteristics,
//   StainsDefects,
//   PriceCalculation,
//   PhotoDocumentation,
// } from './stage2';

// 💰 Stage 3: Загальні параметри замовлення (буде додано пізніше)
// export {
//   Stage3OrderParams,
//   ExecutionParams,
//   DiscountConfig,
//   PaymentConfig,
//   AdditionalInfo,
// } from './stage3';

// 📋 Stage 4: Підтвердження та завершення (буде додано пізніше)
// export {
//   Stage4Completion,
//   OrderConfirmation,
//   LegalAcceptance,
//   ReceiptGeneration,
//   OrderFinalization,
// } from './stage4';
