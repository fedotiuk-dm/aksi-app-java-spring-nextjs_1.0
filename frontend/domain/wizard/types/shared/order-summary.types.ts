/**
 * Типи для підсумку замовлення у wizard
 */

import type { ClientData, BranchData, OrderItemListItem, ExpediteType } from './orval-types';

/**
 * Композитний тип для підсумку замовлення (wizard-специфічний)
 */
export interface OrderSummaryData {
  id: string;
  receiptNumber: string;
  tagNumber?: string;
  status: 'DRAFT' | 'NEW' | 'IN_PROGRESS' | 'COMPLETED' | 'DELIVERED' | 'CANCELLED';
  totalAmount: number;
  discountAmount?: number;
  finalAmount: number;
  prepaymentAmount?: number;
  balanceAmount: number;
  createdDate: string;
  expectedCompletionDate?: string;
  completedDate?: string;
  expediteType: ExpediteType;
  clientInfo?: ClientData;
  branchInfo?: BranchData;
  items: OrderItemListItem[];
  itemCount: number;
  customerNotes?: string;
  internalNotes?: string;
  completionComments?: string;
  termsAccepted?: boolean;
  finalizedAt?: string;
  express: boolean;
  draft: boolean;
  printed: boolean;
  emailed: boolean;
}
