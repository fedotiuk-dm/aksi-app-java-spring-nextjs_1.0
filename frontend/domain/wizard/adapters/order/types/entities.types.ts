/**
 * @fileoverview Основні сутності замовлень, клієнтів та філій
 * @module domain/wizard/adapters/order/types/entities
 */

import { WizardOrderStatus, WizardExpediteType } from './base.types';
import { WizardOrderItem, WizardOrderItemDetailed } from './items.types';

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
