/**
 * @fileoverview Сервіс генерації квитанції (Stage 4.4)
 *
 * ✅ Оновлено з orval інтеграцією
 * ✅ Комплексна бізнес-логіка структурування квитанції
 * ✅ Українська локалізація та форматування
 */

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
} from './receipt-generation.service';
