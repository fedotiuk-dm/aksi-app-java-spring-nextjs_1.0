/**
 * @fileoverview Маппер для перетворення OrderDTO ↔ OrderSummary
 * @module domain/wizard/adapters/order
 */

import { mapBranchDTOToDomain } from '../branch';
import { mapClientResponseToDomain } from '../client';
import { mapOrderItemDTOToDomain, mapOrderItemDetailedDTOToDomain } from '../order-item';

import type { OrderSummary, OrderStatus, ExpediteType } from '../../types';
import type {
  OrderDTO,
  OrderDetailedSummaryResponse,
  CreateOrderRequest,
  OrderSummaryDTO,
} from '@/lib/api';

/**
 * Перетворює OrderDTO у доменний OrderSummary
 */
export function mapOrderDTOToDomain(apiOrder: OrderDTO): OrderSummary {
  return {
    id: apiOrder.id || '',
    receiptNumber: apiOrder.receiptNumber || '',
    tagNumber: apiOrder.tagNumber || undefined,
    status: (apiOrder.status as OrderStatus) || 'DRAFT',
    totalAmount: apiOrder.totalAmount || 0,
    discountAmount: apiOrder.discountAmount || undefined,
    finalAmount: apiOrder.finalAmount || apiOrder.totalAmount || 0,
    prepaymentAmount: apiOrder.prepaymentAmount || undefined,
    balanceAmount: apiOrder.balanceAmount || 0,
    createdDate: apiOrder.createdDate || new Date().toISOString(),
    expectedCompletionDate: apiOrder.expectedCompletionDate || undefined,
    completedDate: apiOrder.completedDate || undefined,
    expediteType: (apiOrder.expediteType as ExpediteType) || 'STANDARD',
    clientInfo: apiOrder.client ? mapClientResponseToDomain(apiOrder.client) : undefined,
    branchInfo: apiOrder.branchLocation ? mapBranchDTOToDomain(apiOrder.branchLocation) : undefined,
    items: (apiOrder.items || []).map(mapOrderItemDTOToDomain),
    itemCount: apiOrder.items?.length || 0,
    customerNotes: apiOrder.customerNotes || undefined,
    internalNotes: apiOrder.internalNotes || undefined,
    completionComments: apiOrder.completionComments || undefined,
    termsAccepted: apiOrder.termsAccepted || false,
    finalizedAt: apiOrder.finalizedAt || undefined,
    express: apiOrder.express || false,
    draft: apiOrder.draft || false,
    printed: apiOrder.printed || false,
    emailed: apiOrder.emailed || false,
  };
}

/**
 * Перетворює OrderDetailedSummaryResponse у доменний OrderSummary
 */
export function mapOrderDetailedToDomain(apiOrder: OrderDetailedSummaryResponse): OrderSummary {
  return {
    id: apiOrder.id || '',
    receiptNumber: apiOrder.receiptNumber || '',
    tagNumber: apiOrder.tagNumber || undefined,
    status: 'DRAFT', // Відсутнє в detailed response
    totalAmount: apiOrder.totalAmount || 0,
    discountAmount: apiOrder.discountAmount || undefined,
    finalAmount: apiOrder.finalAmount || apiOrder.totalAmount || 0,
    prepaymentAmount: apiOrder.prepaymentAmount || undefined,
    balanceAmount: apiOrder.balanceAmount || 0,
    createdDate: apiOrder.createdDate || new Date().toISOString(),
    expectedCompletionDate: apiOrder.expectedCompletionDate || undefined,
    completedDate: undefined,
    expediteType: (apiOrder.expediteType as ExpediteType) || 'STANDARD',
    clientInfo: apiOrder.client ? mapClientResponseToDomain(apiOrder.client) : undefined,
    branchInfo: apiOrder.branchLocation ? mapBranchDTOToDomain(apiOrder.branchLocation) : undefined,
    items: (apiOrder.items || []).map(mapOrderItemDetailedDTOToDomain),
    itemCount: apiOrder.items?.length || 0,
    customerNotes: apiOrder.customerNotes || undefined,
    internalNotes: undefined,
    completionComments: undefined,
    termsAccepted: undefined,
    finalizedAt: undefined,
    express: false,
    draft: false,
    printed: false,
    emailed: false,
  };
}

/**
 * Перетворює OrderSummaryDTO у спрощений доменний OrderSummary
 */
export function mapOrderSummaryDTOToDomain(apiOrder: OrderSummaryDTO): OrderSummary {
  return {
    id: apiOrder.id || '',
    receiptNumber: apiOrder.receiptNumber || '',
    tagNumber: undefined,
    status: (apiOrder.status as OrderStatus) || 'DRAFT',
    totalAmount: apiOrder.totalAmount || 0,
    discountAmount: undefined,
    finalAmount: apiOrder.totalAmount || 0,
    prepaymentAmount: undefined,
    balanceAmount: 0,
    createdDate: apiOrder.createdAt || new Date().toISOString(),
    expectedCompletionDate: apiOrder.completionDate || undefined,
    completedDate: undefined,
    expediteType: 'STANDARD',
    clientInfo: undefined,
    branchInfo: undefined,
    items: [],
    itemCount: apiOrder.itemCount || 0,
    customerNotes: undefined,
    internalNotes: undefined,
    completionComments: undefined,
    termsAccepted: false,
    finalizedAt: undefined,
    express: false,
    draft: false,
    printed: false,
    emailed: false,
  };
}

/**
 * Перетворює доменний тип у CreateOrderRequest
 */
export function mapDomainToCreateRequest(domainOrder: Partial<OrderSummary>): CreateOrderRequest {
  return {
    clientId: domainOrder.clientInfo?.id || '',
    branchLocationId: domainOrder.branchInfo?.id || '',
    tagNumber: domainOrder.tagNumber,
    expectedCompletionDate: domainOrder.expectedCompletionDate,
    expediteType: domainOrder.expediteType as CreateOrderRequest['expediteType'],
    customerNotes: domainOrder.customerNotes,
    internalNotes: domainOrder.internalNotes,
  };
}

/**
 * Перетворює масив API замовлень у доменні типи
 */
export function mapOrderArrayToDomain(apiOrders: OrderDTO[]): OrderSummary[] {
  return apiOrders.map(mapOrderDTOToDomain);
}
