/**
 * @fileoverview Маппер для операцій з квитанціями замовлень
 * @module domain/wizard/adapters/order
 *
 * ОНОВЛЕННЯ: Бекенд тепер повертає типізовані відповіді (PdfReceiptResponse, EmailReceiptResponse).
 * Після перегенерації OpenAPI клієнта, ці типи будуть автоматично згенеровані.
 * Поки що використовуємо власні типи для сумісності.
 */

import type { ReceiptGenerationRequest, EmailReceiptRequest, ReceiptDTO } from '@/lib/api';

/**
 * Доменні типи для операцій з квитанціями
 */
export interface ReceiptGenerationData {
  orderId: string;
  format?: string;
  includeSignature?: boolean;
}

export interface ReceiptGenerationResult {
  orderId: string;
  pdfUrl?: string;
  pdfData?: string;
  generatedAt: string;
  format: string;
  includeSignature: boolean;
  fileSize?: number;
  fileName?: string;
}

export interface EmailReceiptData {
  orderId: string;
  recipientEmail: string;
  subject?: string;
  message?: string;
  includeSignature?: boolean;
}

export interface EmailReceiptResult {
  orderId: string;
  recipientEmail: string;
  sentAt: string;
  messageId?: string;
  status: 'SENT' | 'FAILED' | 'PENDING';
  subject?: string;
  message?: string;
}

export interface ReceiptData {
  orderId: string;
  receiptNumber: string;
  clientInfo: {
    fullName: string;
    phone: string;
    email?: string;
  };
  orderDetails: {
    items: Array<{
      name: string;
      quantity: number;
      unitPrice: number;
      totalPrice: number;
    }>;
    totalAmount: number;
    discountAmount?: number;
    finalAmount: number;
  };
  createdAt: string;
  expectedCompletionDate?: string;
}

/**
 * Типи для API відповідей (фактичні структури, що повертає бекенд)
 *
 * ПРИМІТКА: Ці типи тимчасові до перегенерації OpenAPI клієнта.
 * Бекенд тепер повертає PdfReceiptResponse та EmailReceiptResponse.
 */
export interface PdfReceiptApiResponse {
  orderId: string;
  pdfUrl?: string;
  pdfData?: string;
  generatedAt: string;
  format: string;
  includeSignature: boolean;
  fileSize?: number;
  fileName?: string;
}

export interface EmailReceiptApiResponse {
  orderId: string;
  recipientEmail: string;
  sentAt: string;
  messageId?: string;
  status: string;
  subject?: string;
  message?: string;
}

/**
 * Перетворює доменні дані генерації квитанції у API формат
 */
export function mapReceiptGenerationDataToApi(
  domainData: ReceiptGenerationData
): ReceiptGenerationRequest {
  return {
    orderId: domainData.orderId,
    format: domainData.format,
    includeSignature: domainData.includeSignature,
  };
}

/**
 * Перетворює API результат генерації квитанції у доменний тип
 * Використовує типізовану структуру замість Record<string, any>
 */
export function mapReceiptGenerationResultFromApi(
  apiResult: PdfReceiptApiResponse
): ReceiptGenerationResult {
  // Використовуємо типізований результат

  return {
    orderId: apiResult.orderId || '',
    pdfUrl: apiResult.pdfUrl,
    pdfData: apiResult.pdfData,
    generatedAt: apiResult.generatedAt || new Date().toISOString(),
    format: apiResult.format || 'PDF',
    includeSignature: apiResult.includeSignature ?? false,
    fileSize: apiResult.fileSize,
    fileName: apiResult.fileName,
  };
}

/**
 * Перетворює доменні дані email квитанції у API формат
 */
export function mapEmailReceiptDataToApi(domainData: EmailReceiptData): EmailReceiptRequest {
  return {
    orderId: domainData.orderId,
    recipientEmail: domainData.recipientEmail,
    subject: domainData.subject,
    message: domainData.message,
    includeSignature: domainData.includeSignature,
  };
}

/**
 * Перетворює API результат email квитанції у доменний тип
 * Використовує типізовану структуру замість Record<string, any>
 */
export function mapEmailReceiptResultFromApi(
  apiResult: EmailReceiptApiResponse
): EmailReceiptResult {
  // Використовуємо типізований результат

  return {
    orderId: apiResult.orderId || '',
    recipientEmail: apiResult.recipientEmail || '',
    sentAt: apiResult.sentAt || new Date().toISOString(),
    messageId: apiResult.messageId,
    status: (apiResult.status as 'SENT' | 'FAILED' | 'PENDING') || 'PENDING',
    subject: apiResult.subject,
    message: apiResult.message,
  };
}

/**
 * Перетворює API дані квитанції у доменний тип
 */
export function mapReceiptDataFromApi(apiData: ReceiptDTO): ReceiptData {
  const clientInfo = apiData.clientInfo;
  const financialInfo = apiData.financialInfo;

  return {
    orderId: apiData.orderId || '',
    receiptNumber: apiData.receiptNumber || '',
    clientInfo: {
      fullName: clientInfo
        ? `${clientInfo.firstName || ''} ${clientInfo.lastName || ''}`.trim()
        : '',
      phone: clientInfo?.phone || '',
      email: clientInfo?.email,
    },
    orderDetails: {
      items: (apiData.items || []).map((item) => ({
        name: item.name || '',
        quantity: item.quantity || 1,
        unitPrice: item.basePrice || 0,
        totalPrice: item.finalPrice || 0,
      })),
      totalAmount: financialInfo?.totalAmount || 0,
      discountAmount: financialInfo?.discountAmount,
      finalAmount: financialInfo?.finalAmount || 0,
    },
    createdAt: apiData.createdDate || new Date().toISOString(),
    expectedCompletionDate: apiData.expectedCompletionDate,
  };
}
