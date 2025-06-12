/**
 * @fileoverview Головне публічне API Wizard домену
 *
 * 🎯 Order Wizard Domain - Публічні операційні хуки
 * Відповідальність:
 * - Експорт операційних хуків для features
 * - Експорт типів для UI компонентів
 * - Приховування внутрішньої структури етапів
 */

// 🎪 Stage1 - Клієнт та базова інформація
export * from './stage1';

// 🎭 Stage2 - Менеджер предметів
// TODO: Implement when ready
// export { useStage2Operations } from './stage2';

// 🎨 Stage3 - Загальні параметри
// TODO: Implement when ready
// export { useStage3Operations } from './stage3';

// 🎯 Stage4 - Підтвердження та квитанція
// TODO: Implement when ready
// export { useStage4Operations } from './stage4';

// 🔧 Shared - Спільна функціональність (READY!)
export { useWizardManagement } from './shared';
export type { UseWizardManagementReturn } from './shared';

// ❌ НЕ ЕКСПОРТУЄМО:
// - Окремі етапи (internal structure)
// - Workflow хуки (internal coordination)
// - Stores та API (internal implementation)
