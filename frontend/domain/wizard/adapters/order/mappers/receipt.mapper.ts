/**
 * @fileoverview Маппер для операцій з квитанціями замовлень
 * @module domain/wizard/adapters/order/mappers
 */

import { ReceiptDTO } from '@/lib/api';

import { WizardExpediteType, WizardPaymentMethod } from '../types';

import type {
  WizardReceiptGenerationData,
  WizardReceiptGenerationResult,
  WizardEmailReceiptData,
  WizardEmailReceiptResult,
  WizardReceiptData,
} from '../types';
import type {
  ReceiptGenerationRequest,
  EmailReceiptRequest,
  PdfReceiptResponse,
  EmailReceiptResponse,
} from '@/lib/api';

// Використовуємо згенеровані API типи замість локальних інтерфейсів

/**
 * Перетворює доменні дані генерації квитанції у API формат
 */
export function mapReceiptGenerationDataToApi(
  domainData: WizardReceiptGenerationData
): ReceiptGenerationRequest {
  return {
    orderId: domainData.orderId,
    format: domainData.format || 'PDF',
    includeSignature: domainData.includeSignature ?? false,
  };
}

/**
 * Перетворює API результат генерації квитанції у доменний тип
 */
export function mapReceiptGenerationResultFromApi(
  apiResult: PdfReceiptResponse
): WizardReceiptGenerationResult {
  return {
    success: true, // API повертає результат тільки при успіху
    receiptUrl: apiResult.pdfUrl,
    receiptData: apiResult.pdfData,
    error: undefined,
  };
}

/**
 * Перетворює доменні дані email квитанції у API формат
 */
export function mapEmailReceiptDataToApi(domainData: WizardEmailReceiptData): EmailReceiptRequest {
  return {
    orderId: domainData.orderId,
    recipientEmail: domainData.email,
    subject: domainData.subject || 'Квитанція замовлення',
    message: domainData.message || 'Ваша квитанція у вкладенні',
  };
}

/**
 * Перетворює API результат email квитанції у доменний тип
 */
export function mapEmailReceiptResultFromApi(
  apiResult: EmailReceiptResponse
): WizardEmailReceiptResult {
  return {
    sent: apiResult.status === 'SENT',
    messageId: apiResult.messageId,
    error: apiResult.status === 'FAILED' ? 'Не вдалося відправити email' : undefined,
  };
}

/**
 * Маппінг типів терміновості з API в доменні типи
 */
function mapExpediteTypeFromApi(apiType: ReceiptDTO.expediteType | undefined): WizardExpediteType {
  switch (apiType) {
    case ReceiptDTO.expediteType.STANDARD:
      return WizardExpediteType.STANDARD;
    case ReceiptDTO.expediteType.EXPRESS_48H:
      return WizardExpediteType.EXPRESS_48H;
    case ReceiptDTO.expediteType.EXPRESS_24H:
      return WizardExpediteType.EXPRESS_24H;
    default:
      return WizardExpediteType.STANDARD;
  }
}

/**
 * Маппінг способів оплати з API в доменні типи
 */
function mapPaymentMethodFromApi(
  apiMethod: ReceiptDTO.paymentMethod | undefined
): WizardPaymentMethod | undefined {
  switch (apiMethod) {
    case ReceiptDTO.paymentMethod.TERMINAL:
      return WizardPaymentMethod.TERMINAL;
    case ReceiptDTO.paymentMethod.CASH:
      return WizardPaymentMethod.CASH;
    case ReceiptDTO.paymentMethod.BANK_TRANSFER:
      return WizardPaymentMethod.ACCOUNT;
    default:
      return undefined;
  }
}

/**
 * Перетворює ReceiptDTO у WizardReceiptData
 */
export function mapReceiptDTOToDomain(apiReceipt: ReceiptDTO): WizardReceiptData {
  return {
    orderId: apiReceipt.orderId || '',
    receiptNumber: apiReceipt.receiptNumber || '',
    tagNumber: apiReceipt.tagNumber,
    createdDate: apiReceipt.createdDate || new Date().toISOString(),
    expectedCompletionDate: apiReceipt.expectedCompletionDate,
    expediteType: mapExpediteTypeFromApi(apiReceipt.expediteType),
    branchInfo: apiReceipt.branchInfo
      ? {
          id: '', // Не доступно в ReceiptBranchInfoDTO
          name: apiReceipt.branchInfo.branchName || '',
          code: '', // Не доступно в ReceiptBranchInfoDTO
          address: apiReceipt.branchInfo.address || '',
        }
      : undefined,
    clientInfo: apiReceipt.clientInfo
      ? {
          id: '', // Не доступно в ReceiptClientInfoDTO
          fullName:
            `${apiReceipt.clientInfo.firstName || ''} ${apiReceipt.clientInfo.lastName || ''}`.trim(),
          phone: apiReceipt.clientInfo.phone || '',
          email: apiReceipt.clientInfo.email,
        }
      : undefined,
    items: (apiReceipt.items || []).map((item) => ({
      id: item.id,
      categoryName: item.serviceCategory || '',
      itemName: item.name || '',
      quantity: item.quantity || 1,
      unit: item.unitOfMeasure || 'шт',
      basePrice: item.basePrice || 0,
      finalPrice: item.finalPrice || 0,
      material: item.material,
      color: item.color,
      notes: item.notes,
    })),
    financialInfo: {
      totalAmount: apiReceipt.financialInfo?.totalAmount || 0,
      discountAmount: apiReceipt.financialInfo?.discountAmount,
      expediteSurcharge: apiReceipt.financialInfo?.expediteSurcharge,
      finalAmount: apiReceipt.financialInfo?.finalAmount || 0,
      prepaymentAmount: apiReceipt.financialInfo?.prepaymentAmount,
      balanceAmount: apiReceipt.financialInfo?.balanceAmount || 0,
    },
    legalTerms: apiReceipt.legalTerms,
    customerSignatureData: apiReceipt.customerSignatureData,
    termsAccepted: apiReceipt.termsAccepted || false,
    additionalNotes: apiReceipt.additionalNotes,
    paymentMethod: mapPaymentMethodFromApi(apiReceipt.paymentMethod),
  };
}
