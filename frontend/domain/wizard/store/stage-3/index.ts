/**
 * @fileoverview Stage 3 Stores - Stores для етапу "Загальні параметри замовлення"
 * @module domain/wizard/store/stage-3
 * @author AKSI Team
 * @since 1.0.0
 */

// === ПАРАМЕТРИ ВИКОНАННЯ ===
export {
  useExecutionParametersStore,
  type ExecutionParametersStore,
} from './execution-params.store';

// === ЗНИЖКИ ===
export { useDiscountsStore, type DiscountsStore } from './discounts.store';

// === ОПЛАТА ===
export { usePaymentStore, type PaymentStore, PaymentMethod } from './payment.store';

// === ДОДАТКОВА ІНФОРМАЦІЯ ===
export {
  useAdditionalInfoStore,
  type AdditionalInfoStore,
  AdditionalServiceType,
} from './additional-info.store';
