/**
 * @fileoverview Адаптер замовлень API → Domain
 * @module domain/wizard/adapters
 */

// === ІМПОРТИ ІНШИХ АДАПТЕРІВ ===
import { BranchAdapter } from './branch-adapter';
import { ClientAdapter } from './client-adapter';
import { OrderItemAdapter } from './order-item-adapter';

import type { OrderSummary, OrderStatus, ExpediteType } from '../types';
import type {
  OrderDTO,
  OrderDetailedSummaryResponse,
  CreateOrderRequest,
  OrderSummaryDTO,
} from '@/lib/api';

/**
 * Адаптер для перетворення API типів замовлень у доменні типи
 */
export class OrderAdapter {
  /**
   * Перетворює OrderDTO у доменний OrderSummary
   */
  static fromOrderDTO(apiOrder: OrderDTO): OrderSummary {
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
      clientInfo: apiOrder.client ? ClientAdapter.toDomain(apiOrder.client) : undefined,
      branchInfo: apiOrder.branchLocation
        ? BranchAdapter.toDomain(apiOrder.branchLocation)
        : undefined,
      items: (apiOrder.items || []).map(OrderItemAdapter.toDomain),
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
  static fromDetailedSummary(apiOrder: OrderDetailedSummaryResponse): OrderSummary {
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
      completedDate: undefined, // Відсутнє в detailed response
      expediteType: (apiOrder.expediteType as ExpediteType) || 'STANDARD',
      clientInfo: apiOrder.client ? ClientAdapter.toDomain(apiOrder.client) : undefined,
      branchInfo: apiOrder.branchLocation
        ? BranchAdapter.toDomain(apiOrder.branchLocation)
        : undefined,
      items: (apiOrder.items || []).map(OrderItemAdapter.toDomain),
      itemCount: apiOrder.items?.length || 0,
      customerNotes: apiOrder.customerNotes || undefined,
      internalNotes: undefined, // Відсутнє в detailed response
      completionComments: undefined, // Відсутнє в detailed response
      termsAccepted: undefined, // Відсутнє в detailed response
      finalizedAt: undefined, // Відсутнє в detailed response
      express: false, // Відсутнє в detailed response
      draft: false, // Відсутнє в detailed response
      printed: false, // Відсутнє в detailed response
      emailed: false, // Відсутнє в detailed response
    };
  }

  /**
   * Універсальний метод для будь-якого типу Order API
   */
  static toDomain(apiOrder: OrderDTO | OrderDetailedSummaryResponse): OrderSummary {
    // Перевіряємо чи це OrderDTO за наявністю специфічних полів
    if ('status' in apiOrder && 'internalNotes' in apiOrder) {
      return this.fromOrderDTO(apiOrder as OrderDTO);
    }
    return this.fromDetailedSummary(apiOrder as OrderDetailedSummaryResponse);
  }

  /**
   * Перетворює OrderSummaryDTO у спрощений доменний OrderSummary
   */
  static fromSummaryDTO(apiOrder: OrderSummaryDTO): OrderSummary {
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
   * Перетворює доменний тип у CreateOrderRequest для створення замовлення
   */
  static toCreateRequest(domainOrder: Partial<OrderSummary>): CreateOrderRequest {
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
}
