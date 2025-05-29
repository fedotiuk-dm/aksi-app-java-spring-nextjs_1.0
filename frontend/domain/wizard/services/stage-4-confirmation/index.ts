/**
 * @fileoverview Централізований експорт сервісів Stage-4: Підтвердження та завершення
 * @module domain/wizard/services/stage-4-confirmation
 */

// ===============================================
// СЕРВІСИ STAGE-4: ПІДТВЕРДЖЕННЯ ТА ЗАВЕРШЕННЯ
// ===============================================
// ✅ На основі: OrderWizard instruction_structure logic.md
// ✅ Етап 4: Підтвердження та завершення з формуванням квитанції (5 підетапів)

// 4.1: Перегляд замовлення з детальним розрахунком (оновлений з orval інтеграцією)
export {
  OrderReviewService,
  type OrderDetailedSummary,
  type OrderDetailedParams,
  type ReviewOptions,
  type DetailedOrderInfo,
  type DetailedClientInfo,
  type DetailedBranchInfo,
  type PriceModifier,
  type DetailedOrderItem,
  type DetailedPaymentSummary,
  type StructuredOrderReview,
  type ReviewValidationResult,
} from './order-review';

// 4.2: Юридичні аспекти (оновлений з orval інтеграцією)
export {
  LegalAspectsService,
  type SignatureCreateData,
  type SignatureData,
  type SignatureInfo,
  type OrderSignatures,
  type TypedSignature,
  type SignatureType,
  type LegalValidationData,
  type SignatureValidationData,
  type LegalValidationResult,
  type SignatureValidationResult,
  type LegalDocument,
  type TermsOfService,
} from './legal-aspects';

// 4.3: Валідація замовлення (оновлений з orval інтеграцією)
export {
  OrderValidationService,
  type CompleteOrderParams,
  type CompletedOrderData,
  type OrderStatusParams,
  type OrderStatus,
  type OrderReadinessData,
  type ValidationResult,
  type ConsistencyCheckResult,
  type StatusTransitionResult,
} from './order-validation';

// 4.4: Генерація квитанції (оновлений з orval інтеграцією)
export {
  ReceiptGenerationService,
  // Orval типи (прямо з API)
  type PdfGenerationData,
  type PdfGenerationResult,
  type EmailReceiptData,
  type EmailReceiptResult,
  type ReceiptDataParams,
  type ReceiptData,
  type DownloadParams,
  // Розширені типи для бізнес-логіки
  type StructuredReceiptData,
  type ReceiptHeaderData,
  type ReceiptOrderInfo,
  type ReceiptClientInfo,
  type ReceiptItemData,
  type ReceiptPriceModifier,
  type ReceiptDefectsSection,
  type ReceiptFinancialInfo,
  type ReceiptLegalInfo,
  type ReceiptSignatures,
  type ReceiptFooter,
  type ReceiptValidationResult,
  type EmailContentData,
  type QrCodeData,
} from './receipt-generation';

// 4.5: Завершення процесу (оновлений з orval інтеграцією)
export {
  CompletionService,
  type OrderCompletionData,
  type ReceiptGenerationData,
  type ReceiptDataInfo,
  type CompletionValidationData,
  type ReceiptPreparationData,
  type CompletionValidationResult,
  type OrderReadinessCheck,
  type CompletionSummary,
} from './completion';
