/**
 * @fileoverview Типи для квитанцій замовлень
 * @module domain/wizard/adapters/order/types/receipts
 */

import { WizardExpediteType, WizardPaymentMethod } from './base.types';
import { WizardOrderBranchInfo, WizardOrderClientInfo } from './entities.types';
import { WizardOrderItem } from './items.types';

/**
 * Дані для генерації квитанції
 */
export interface WizardReceiptGenerationData {
  readonly orderId: string;
  readonly includeSignature?: boolean;
  readonly format?: 'PDF' | 'HTML';
}

/**
 * Результат генерації квитанції
 */
export interface WizardReceiptGenerationResult {
  readonly success: boolean;
  readonly receiptUrl?: string;
  readonly receiptData?: string;
  readonly error?: string;
}

/**
 * Дані для відправки квитанції email
 */
export interface WizardEmailReceiptData {
  readonly orderId: string;
  readonly email: string;
  readonly subject?: string;
  readonly message?: string;
}

/**
 * Результат відправки квитанції email
 */
export interface WizardEmailReceiptResult {
  readonly sent: boolean;
  readonly messageId?: string;
  readonly error?: string;
}

/**
 * Фінансова інформація квитанції
 */
export interface WizardReceiptFinancialInfo {
  readonly totalAmount: number;
  readonly discountAmount?: number;
  readonly expediteSurcharge?: number;
  readonly finalAmount: number;
  readonly prepaymentAmount?: number;
  readonly balanceAmount: number;
}

/**
 * Дані квитанції для відображення
 */
export interface WizardReceiptData {
  readonly orderId: string;
  readonly receiptNumber: string;
  readonly tagNumber?: string;
  readonly createdDate: string;
  readonly expectedCompletionDate?: string;
  readonly expediteType: WizardExpediteType;
  readonly branchInfo?: WizardOrderBranchInfo;
  readonly clientInfo?: WizardOrderClientInfo;
  readonly items: WizardOrderItem[];
  readonly financialInfo: WizardReceiptFinancialInfo;
  readonly legalTerms?: string;
  readonly customerSignatureData?: string;
  readonly termsAccepted: boolean;
  readonly additionalNotes?: string;
  readonly paymentMethod?: WizardPaymentMethod;
}
