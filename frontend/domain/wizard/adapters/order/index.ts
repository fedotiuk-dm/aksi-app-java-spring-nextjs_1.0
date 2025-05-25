/**
 * @fileoverview Експорт всіх функцій для роботи з замовленнями
 * @module domain/wizard/adapters/order
 */

// Експорт мапперів
export {
  mapOrderDTOToDomain,
  mapOrderDetailedToDomain,
  mapOrderSummaryDTOToDomain,
  mapDomainToCreateRequest,
  mapOrderArrayToDomain,
} from './order.mapper';

// Експорт основних API функцій
export {
  getAllOrders,
  getOrderById,
  createOrder,
  saveOrderDraft,
  getDraftOrders,
  convertDraftToOrder,
  getActiveOrders,
  updateOrderStatus,
  completeOrder,
  cancelOrder,
} from './order.api';

// Експорт платіжних типів та функцій
export type { PaymentCalculationData, PaymentCalculationResult } from './order-payment.mapper';
export { applyOrderPayment, calculateOrderPayment } from './order-payment.api';

// Експорт типів та функцій для знижок
export type { DiscountData, DiscountResult } from './order-discount.mapper';
export { applyOrderDiscount, getOrderDiscount, removeOrderDiscount } from './order-discount.api';

// Експорт типів та функцій для квитанцій
export type {
  ReceiptGenerationData,
  ReceiptGenerationResult,
  EmailReceiptData,
  EmailReceiptResult,
  ReceiptData,
} from './order-receipt.mapper';
export {
  generateOrderPdfReceipt,
  sendOrderReceiptByEmail,
  getOrderReceiptData,
} from './order-receipt.api';
