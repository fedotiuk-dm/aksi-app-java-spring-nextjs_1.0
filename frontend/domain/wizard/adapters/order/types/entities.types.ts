/**
 * @fileoverview Основні сутності замовлень, клієнтів та філій
 * @module domain/wizard/adapters/order/types/entities
 */

import { WizardOrderStatus, WizardExpediteType } from './base.types';
import { WizardOrderItem, WizardOrderItemDetailed } from './items.types';

import type { WizardModifierType } from '../../pricing/types';

/**
 * Інформація про клієнта в замовленні (спрощена)
 */
export interface WizardOrderClientInfo {
  readonly id: string;
  readonly fullName: string;
  readonly phone: string;
  readonly email?: string;
}

/**
 * Інформація про філію в замовленні (спрощена)
 */
export interface WizardOrderBranchInfo {
  readonly id: string;
  readonly name: string;
  readonly code: string;
  readonly address: string;
}

/**
 * Замовлення для wizard (базова інформація)
 */
export interface WizardOrder {
  readonly id: string;
  readonly receiptNumber: string;
  readonly tagNumber?: string;
  readonly status: WizardOrderStatus;
  readonly clientInfo?: WizardOrderClientInfo;
  readonly branchInfo?: WizardOrderBranchInfo;
  readonly items: WizardOrderItem[];
  readonly itemCount: number;
  readonly totalAmount: number;
  readonly discountAmount?: number;
  readonly finalAmount: number;
  readonly prepaymentAmount?: number;
  readonly balanceAmount: number;
  readonly expediteType: WizardExpediteType;
  readonly expectedCompletionDate?: string;
  readonly createdDate: string;
  readonly updatedDate?: string;
  readonly completedDate?: string;
  readonly customerNotes?: string;
  readonly internalNotes?: string;
  readonly completionComments?: string;
  readonly termsAccepted: boolean;
  readonly finalizedAt?: string;
  readonly express: boolean;
  readonly draft: boolean;
  readonly printed: boolean;
  readonly emailed: boolean;
}

/**
 * Детальне замовлення з повною інформацією
 */
export interface WizardOrderDetailed {
  readonly id: string;
  readonly receiptNumber: string;
  readonly tagNumber?: string;
  readonly clientInfo?: WizardOrderClientInfo;
  readonly branchInfo?: WizardOrderBranchInfo;
  readonly items: WizardOrderItemDetailed[];
  readonly totalAmount: number;
  readonly discountAmount?: number;
  readonly expediteSurchargeAmount?: number;
  readonly finalAmount: number;
  readonly prepaymentAmount?: number;
  readonly balanceAmount: number;
  readonly expediteType: WizardExpediteType;
  readonly expectedCompletionDate?: string;
  readonly createdDate: string;
  readonly customerNotes?: string;
  readonly discountType?: string;
  readonly discountPercentage?: number;
}

/**
 * Короткий опис замовлення
 */
export interface WizardOrderSummary {
  readonly id: string;
  readonly receiptNumber: string;
  readonly status: WizardOrderStatus;
  readonly totalAmount: number;
  readonly createdAt: string;
  readonly completionDate?: string;
  readonly itemCount: number;
}

/**
 * Дані для створення замовлення
 */
export interface WizardOrderCreateData {
  readonly tagNumber?: string;
  readonly clientId: string;
  readonly branchLocationId: string;
  readonly items?: WizardOrderItem[];
  readonly discountAmount?: number;
  readonly prepaymentAmount?: number;
  readonly expectedCompletionDate?: string;
  readonly customerNotes?: string;
  readonly internalNotes?: string;
  readonly expediteType?: WizardExpediteType;
  readonly draft?: boolean;
}

/**
 * Результат ініціалізації замовлення
 */
export interface WizardOrderInitializationResult {
  readonly orderId: string;
  readonly receiptNumber?: string; // Генерується автоматично на бекенді
  readonly tagNumber: string; // Унікальна мітка, введена вручну
  readonly createdAt?: string;
}

/**
 * Дані для оновлення замовлення
 */
export interface WizardOrderUpdateData {
  readonly tagNumber?: string;
  readonly items?: WizardOrderItem[];
  readonly discountAmount?: number;
  readonly prepaymentAmount?: number;
  readonly expectedCompletionDate?: string;
  readonly customerNotes?: string;
  readonly internalNotes?: string;
  readonly expediteType?: WizardExpediteType;
  readonly status?: WizardOrderStatus;
}

/**
 * Підпис клієнта
 */
export interface WizardCustomerSignature {
  readonly id: string;
  readonly orderId: string;
  readonly signatureData: string;
  readonly signatureType: string;
  readonly createdAt: string;
  readonly updatedAt?: string;
}

/**
 * Дані для створення підпису клієнта
 */
export interface WizardCustomerSignatureCreateData {
  readonly orderId: string;
  readonly signatureData: string;
  readonly signatureType: string;
}

/**
 * Дані для фіналізації замовлення
 */
export interface WizardOrderFinalizationData {
  readonly orderId: string;
  readonly signatureData?: string;
  readonly termsAccepted?: boolean;
  readonly sendReceiptByEmail?: boolean;
  readonly generatePrintableReceipt?: boolean;
  readonly comments?: string;
}

/**
 * Дані для додаткових вимог до замовлення
 */
export interface WizardAdditionalRequirementsData {
  readonly orderId: string;
  readonly additionalRequirements?: string;
  readonly customerNotes?: string;
}

/**
 * Результат операції з додатковими вимогами
 */
export interface WizardAdditionalRequirementsResult {
  readonly orderId: string;
  readonly additionalRequirements?: string;
  readonly customerNotes?: string;
  readonly updatedAt?: string;
}

/**
 * Дані для оновлення параметрів виконання замовлення
 */
export interface WizardOrderCompletionUpdateData {
  readonly orderId: string;
  readonly expediteType: WizardExpediteType;
  readonly expectedCompletionDate: string;
}

/**
 * Дані для розрахунку дати завершення замовлення
 */
export interface WizardCompletionDateCalculationData {
  readonly serviceCategoryIds: string[];
  readonly expediteType: WizardExpediteType;
}

/**
 * Результат оновлення параметрів виконання замовлення
 */
export interface WizardOrderCompletionResult {
  readonly orderId: string;
  readonly expediteType: string;
  readonly expectedCompletionDate: string;
  readonly expediteSurcharge: number;
  readonly updatedAt?: string;
}

/**
 * Результат розрахунку дати завершення замовлення
 */
export interface WizardCompletionDateCalculationResult {
  readonly expectedCompletionDate: string;
  readonly expediteType: string;
  readonly expediteSurcharge: number;
  readonly standardCompletionDate?: string;
  readonly calculatedAt?: string;
}

/**
 * API відповідь для базової ціни
 */
export interface WizardBasePriceResponse {
  readonly price?: number;
  readonly basePrice?: number;
  readonly unitOfMeasure?: string;
  readonly categoryCode?: string;
  readonly itemName?: string;
  readonly color?: string;
}

/**
 * API відповідь для модифікатора
 */
export interface WizardModifierResponse {
  readonly code?: string;
  readonly name?: string;
  readonly description?: string;
  readonly type?: WizardModifierType;
  readonly value?: number;
  readonly category?: 'GENERAL' | 'TEXTILE' | 'LEATHER';
  readonly applicableCategories?: string[];
  readonly isRecommended?: boolean;
}

/**
 * API відповідь для попередження про ризики
 */
export interface WizardRiskWarningResponse {
  readonly type?: string;
  readonly severity?: 'LOW' | 'MEDIUM' | 'HIGH';
  readonly message?: string;
  readonly recommendation?: string;
}

/**
 * Фотографія предмета замовлення
 */
export interface WizardOrderItemPhoto {
  readonly id: string;
  readonly itemId: string;
  readonly fileName: string;
  readonly filePath: string;
  readonly fileSize: number;
  readonly mimeType: string;
  readonly description?: string;
  readonly annotations?: string;
  readonly uploadedAt: string;
  readonly updatedAt?: string;
}

/**
 * Дані для завантаження фотографії
 */
export interface WizardPhotoUploadData {
  readonly itemId: string;
  readonly file: File;
  readonly description?: string;
}

/**
 * Дані для оновлення анотацій фотографії
 */
export interface WizardPhotoAnnotationsData {
  readonly itemId: string;
  readonly photoId: string;
  readonly annotations: string;
  readonly description?: string;
}
