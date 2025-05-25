/**
 * @fileoverview Адаптер маппінгу типів API ↔ Domain для замовлень
 * @module domain/wizard/adapters/order-adapters
 */

import { BranchAdapter } from '../branch-adapters';
import { ClientAdapter } from '../client-adapter';
import { OrderItemAdapter } from '../order-item-adapter';

import type { OrderSummary, OrderStatus, ExpediteType } from '../../types';
import type {
  OrderDTO,
  OrderDetailedSummaryResponse,
  CreateOrderRequest,
  OrderSummaryDTO,
  PaymentCalculationRequest,
  OrderDiscountRequest,
  ReceiptGenerationRequest,
  EmailReceiptRequest,
  ReceiptDTO,
} from '@/lib/api';

/**
 * Доменні типи для фінансових операцій
 */
export interface PaymentCalculationData {
  orderId: string;
  paymentMethod: 'TERMINAL' | 'CASH' | 'BANK_TRANSFER';
  prepaymentAmount?: number;
}

export interface PaymentCalculationResult {
  orderId: string;
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  prepaymentAmount: number;
  balanceAmount: number;
  paymentMethod: string;
  calculatedAt: string;
}

export interface DiscountData {
  orderId: string;
  discountType: 'NO_DISCOUNT' | 'EVERCARD' | 'SOCIAL_MEDIA' | 'MILITARY' | 'CUSTOM';
  discountPercentage?: number;
  discountDescription?: string;
}

export interface DiscountResult {
  orderId: string;
  discountType: string;
  discountPercentage: number;
  discountAmount: number;
  appliedAt: string;
  description?: string;
}

/**
 * Доменні типи для документних операцій
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
 * Адаптер для маппінгу типів між API та Domain для замовлень
 *
 * Відповідальність:
 * - Перетворення API типів у доменні
 * - Перетворення доменних типів у API запити
 * - Маппінг різних типів замовлень (DTO, Summary, Detailed)
 */
export class OrderMappingAdapter {
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
   * Перетворює масив API замовлень у доменні типи
   */
  static toDomainArray(apiOrders: OrderDTO[]): OrderSummary[] {
    return apiOrders.map(this.fromOrderDTO);
  }

  /**
   * Перетворює доменний тип у CreateOrderRequest
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

  /**
   * Перетворює доменне замовлення у API формат
   */
  static toOrderDTO(domainOrder: Partial<OrderSummary>): Partial<OrderDTO> {
    return {
      id: domainOrder.id,
      receiptNumber: domainOrder.receiptNumber,
      tagNumber: domainOrder.tagNumber,
      status: domainOrder.status as OrderDTO.status,
      totalAmount: domainOrder.totalAmount,
      discountAmount: domainOrder.discountAmount,
      finalAmount: domainOrder.finalAmount,
      prepaymentAmount: domainOrder.prepaymentAmount,
      balanceAmount: domainOrder.balanceAmount,
      createdDate: domainOrder.createdDate,
      expectedCompletionDate: domainOrder.expectedCompletionDate,
      completedDate: domainOrder.completedDate,
      expediteType: domainOrder.expediteType as OrderDTO.expediteType,
      customerNotes: domainOrder.customerNotes,
      internalNotes: domainOrder.internalNotes,
      completionComments: domainOrder.completionComments,
      termsAccepted: domainOrder.termsAccepted,
      finalizedAt: domainOrder.finalizedAt,
      express: domainOrder.express,
      draft: domainOrder.draft,
      printed: domainOrder.printed,
      emailed: domainOrder.emailed,
    };
  }

  // === ФІНАНСОВІ ОПЕРАЦІЇ ===

  /**
   * Перетворює доменні дані оплати у API формат
   */
  static paymentDataToApi(domainData: PaymentCalculationData): PaymentCalculationRequest {
    return {
      orderId: domainData.orderId,
      paymentMethod: domainData.paymentMethod as PaymentCalculationRequest.paymentMethod,
      prepaymentAmount: domainData.prepaymentAmount,
    };
  }

  /**
   * Перетворює API результат оплати у доменний тип
   */
  static paymentResultFromApi(apiResult: Record<string, any>): PaymentCalculationResult {
    return {
      orderId: apiResult.orderId || '',
      totalAmount: apiResult.totalAmount || 0,
      discountAmount: apiResult.discountAmount || 0,
      finalAmount: apiResult.finalAmount || 0,
      prepaymentAmount: apiResult.prepaymentAmount || 0,
      balanceAmount: apiResult.balanceAmount || 0,
      paymentMethod: apiResult.paymentMethod || '',
      calculatedAt: apiResult.calculatedAt || new Date().toISOString(),
    };
  }

  /**
   * Перетворює доменні дані знижки у API формат
   */
  static discountDataToApi(domainData: DiscountData): OrderDiscountRequest {
    return {
      orderId: domainData.orderId,
      discountType: domainData.discountType as OrderDiscountRequest.discountType,
      discountPercentage: domainData.discountPercentage,
      discountDescription: domainData.discountDescription,
    };
  }

  /**
   * Перетворює API результат знижки у доменний тип
   */
  static discountResultFromApi(apiResult: Record<string, any>): DiscountResult {
    return {
      orderId: apiResult.orderId || '',
      discountType: apiResult.discountType || '',
      discountPercentage: apiResult.discountPercentage || 0,
      discountAmount: apiResult.discountAmount || 0,
      appliedAt: apiResult.appliedAt || new Date().toISOString(),
      description: apiResult.description,
    };
  }

  // === ДОКУМЕНТНІ ОПЕРАЦІЇ ===

  /**
   * Перетворює доменні дані генерації квитанції у API формат
   */
  static receiptGenerationDataToApi(domainData: ReceiptGenerationData): ReceiptGenerationRequest {
    return {
      orderId: domainData.orderId,
      format: domainData.format,
      includeSignature: domainData.includeSignature,
    };
  }

  /**
   * Перетворює API результат генерації квитанції у доменний тип
   */
  static receiptGenerationResultFromApi(apiResult: Record<string, any>): ReceiptGenerationResult {
    return {
      orderId: apiResult.orderId || '',
      pdfUrl: apiResult.pdfUrl,
      pdfData: apiResult.pdfData,
      generatedAt: apiResult.generatedAt || new Date().toISOString(),
      format: apiResult.format || 'PDF',
      includeSignature: apiResult.includeSignature ?? false,
    };
  }

  /**
   * Перетворює доменні дані email квитанції у API формат
   */
  static emailReceiptDataToApi(domainData: EmailReceiptData): EmailReceiptRequest {
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
   */
  static emailReceiptResultFromApi(apiResult: Record<string, any>): EmailReceiptResult {
    return {
      orderId: apiResult.orderId || '',
      recipientEmail: apiResult.recipientEmail || '',
      sentAt: apiResult.sentAt || new Date().toISOString(),
      messageId: apiResult.messageId,
      status: (apiResult.status as 'SENT' | 'FAILED' | 'PENDING') || 'PENDING',
    };
  }

  /**
   * Перетворює API дані квитанції у доменний тип
   */
  static receiptDataFromApi(apiData: ReceiptDTO): ReceiptData {
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
}
