/**
 * @fileoverview Stage 4 Stores - Stores для етапу "Підтвердження та завершення"
 * @module domain/wizard/store/stage-4
 * @author AKSI Team
 * @since 1.0.0
 */

// === ПЕРЕГЛЯД ЗАМОВЛЕННЯ ===
export { useOrderReviewStore, type OrderReviewStore } from './order-review.store';

// === ГЕНЕРАЦІЯ КВИТАНЦІЙ ===
export {
  useReceiptGeneratorStore,
  type ReceiptGeneratorStore,
  ReceiptTemplate,
} from './receipt-generator.store';

// === ЮРИДИЧНІ АСПЕКТИ ===
export {
  useLegalAspectsStore,
  type LegalAspectsStore,
  LegalDocumentType,
} from './legal-aspects.store';
