/**
 * Адаптери для перетворення API моделей у доменні типи
 * Відповідальність за трансформацію даних між API та доменним шаром
 */

import {
  ClientSearchResult,
  Branch,
  OrderItem,
  OrderSummary,
  OrderStatus,
  ExpediteType,
} from '../types/state';

/**
 * Адаптер для перетворення API ClientResponse у доменний ClientSearchResult
 */
export class ClientAdapter {
  /**
   * Перетворює API відповідь у доменний тип клієнта
   */
  static toDomain(apiClient: any): ClientSearchResult {
    return {
      id: apiClient.id || '',
      lastName: apiClient.lastName || '',
      firstName: apiClient.firstName || '',
      fullName: apiClient.fullName || `${apiClient.firstName} ${apiClient.lastName}`.trim(),
      phone: apiClient.phone || '',
      email: apiClient.email,
      address: apiClient.address,
      structuredAddress: apiClient.structuredAddress
        ? {
            street: apiClient.structuredAddress.street || '',
            city: apiClient.structuredAddress.city || '',
            zipCode: apiClient.structuredAddress.zipCode,
            country: apiClient.structuredAddress.country,
          }
        : undefined,
      communicationChannels: apiClient.communicationChannels || [],
      source: apiClient.source,
      sourceDetails: apiClient.sourceDetails,
      createdAt: apiClient.createdAt || new Date().toISOString(),
      updatedAt: apiClient.updatedAt || new Date().toISOString(),
      orderCount: apiClient.orderCount || 0,
      recentOrders: (apiClient.recentOrders || []).map((order: any) => ({
        id: order.id,
        receiptNumber: order.receiptNumber,
        status: order.status as OrderStatus,
        totalAmount: order.totalAmount || 0,
        createdAt: order.createdAt,
        completionDate: order.completionDate,
        itemCount: order.itemCount || 0,
      })),
    };
  }

  /**
   * Перетворює доменний тип у API request
   */
  static toApiRequest(domainClient: Partial<ClientSearchResult>): any {
    return {
      firstName: domainClient.firstName,
      lastName: domainClient.lastName,
      phone: domainClient.phone,
      email: domainClient.email,
      address: domainClient.address,
      communicationChannels: domainClient.communicationChannels,
      source: domainClient.source,
      sourceDetails: domainClient.sourceDetails,
    };
  }
}

/**
 * Адаптер для перетворення API BranchLocationDTO у доменний Branch
 */
export class BranchAdapter {
  /**
   * Перетворює API відповідь у доменний тип філії
   */
  static toDomain(apiBranch: any): Branch {
    return {
      id: apiBranch.id || '',
      name: apiBranch.name || '',
      address: apiBranch.address || '',
      phone: apiBranch.phone,
      code: apiBranch.code || '',
      active: apiBranch.active !== false,
      createdAt: apiBranch.createdAt || new Date().toISOString(),
      updatedAt: apiBranch.updatedAt || new Date().toISOString(),
    };
  }
}

/**
 * Адаптер для перетворення API OrderItemDTO у доменний OrderItem
 */
export class OrderItemAdapter {
  /**
   * Перетворює API відповідь у доменний тип предмета
   */
  static toDomain(apiItem: any): OrderItem {
    return {
      id: apiItem.id || '',
      orderId: apiItem.orderId,
      name: apiItem.name || '',
      description: apiItem.description,
      quantity: apiItem.quantity || 1,
      unitPrice: apiItem.unitPrice || 0,
      totalPrice: apiItem.totalPrice || apiItem.unitPrice * apiItem.quantity,
      category: apiItem.category,
      color: apiItem.color,
      material: apiItem.material,
      unitOfMeasure: apiItem.unitOfMeasure,
      defects: apiItem.defects,
      specialInstructions: apiItem.specialInstructions,
      fillerType: apiItem.fillerType,
      fillerCompressed: apiItem.fillerCompressed,
      wearDegree: apiItem.wearDegree,
      stains: apiItem.stains,
      otherStains: apiItem.otherStains,
      defectsAndRisks: apiItem.defectsAndRisks,
      noGuaranteeReason: apiItem.noGuaranteeReason,
      defectsNotes: apiItem.defectsNotes,
      photos: apiItem.photos || [],
    };
  }

  /**
   * Перетворює доменний тип у API request
   */
  static toApiRequest(domainItem: Partial<OrderItem>): any {
    return {
      name: domainItem.name,
      description: domainItem.description,
      quantity: domainItem.quantity,
      unitPrice: domainItem.unitPrice,
      category: domainItem.category,
      color: domainItem.color,
      material: domainItem.material,
      unitOfMeasure: domainItem.unitOfMeasure,
      defects: domainItem.defects,
      specialInstructions: domainItem.specialInstructions,
      fillerType: domainItem.fillerType,
      fillerCompressed: domainItem.fillerCompressed,
      wearDegree: domainItem.wearDegree,
      stains: domainItem.stains,
      otherStains: domainItem.otherStains,
      defectsAndRisks: domainItem.defectsAndRisks,
      noGuaranteeReason: domainItem.noGuaranteeReason,
      defectsNotes: domainItem.defectsNotes,
    };
  }
}

/**
 * Адаптер для перетворення API OrderDTO у доменний OrderSummary
 */
export class OrderAdapter {
  /**
   * Перетворює API відповідь у доменний тип замовлення
   */
  static toDomain(apiOrder: any): OrderSummary {
    return {
      id: apiOrder.id || '',
      receiptNumber: apiOrder.receiptNumber || '',
      tagNumber: apiOrder.tagNumber,
      status: (apiOrder.status as OrderStatus) || 'DRAFT',
      totalAmount: apiOrder.totalAmount || 0,
      discountAmount: apiOrder.discountAmount,
      finalAmount: apiOrder.finalAmount || apiOrder.totalAmount || 0,
      prepaymentAmount: apiOrder.prepaymentAmount,
      balanceAmount: apiOrder.balanceAmount || 0,
      createdDate: apiOrder.createdDate || new Date().toISOString(),
      expectedCompletionDate: apiOrder.expectedCompletionDate,
      completedDate: apiOrder.completedDate,
      expediteType: (apiOrder.expediteType as ExpediteType) || 'STANDARD',
      clientInfo: ClientAdapter.toDomain(apiOrder.client),
      branchInfo: BranchAdapter.toDomain(apiOrder.branchLocation),
      items: (apiOrder.items || []).map(OrderItemAdapter.toDomain),
      itemCount: apiOrder.items?.length || 0,
      customerNotes: apiOrder.customerNotes,
      internalNotes: apiOrder.internalNotes,
      completionComments: apiOrder.completionComments,
      termsAccepted: apiOrder.termsAccepted || false,
      finalizedAt: apiOrder.finalizedAt,
      express: apiOrder.express || false,
      draft: apiOrder.draft || false,
      printed: apiOrder.printed || false,
      emailed: apiOrder.emailed || false,
    };
  }

  /**
   * Перетворює доменний тип у API request для створення
   */
  static toCreateRequest(domainOrder: Partial<OrderSummary>): any {
    return {
      clientId: domainOrder.clientInfo?.id,
      branchLocationId: domainOrder.branchInfo?.id,
      items: domainOrder.items?.map(OrderItemAdapter.toApiRequest),
      totalAmount: domainOrder.totalAmount,
      discountAmount: domainOrder.discountAmount,
      prepaymentAmount: domainOrder.prepaymentAmount,
      expectedCompletionDate: domainOrder.expectedCompletionDate,
      expediteType: domainOrder.expediteType,
      customerNotes: domainOrder.customerNotes,
      internalNotes: domainOrder.internalNotes,
      express: domainOrder.express,
    };
  }
}

/**
 * Універсальний адаптер для пагінованих відповідей
 */
export class PaginationAdapter {
  /**
   * Перетворює API paginated response у доменний формат
   */
  static toDomain<T, R>(
    apiResponse: any,
    itemAdapter: (item: T) => R
  ): {
    items: R[];
    totalElements: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    hasNext: boolean;
    hasPrevious: boolean;
  } {
    return {
      items: (apiResponse.content || []).map(itemAdapter),
      totalElements: apiResponse.totalElements || 0,
      totalPages: apiResponse.totalPages || 0,
      currentPage: apiResponse.number || 0,
      pageSize: apiResponse.size || 10,
      hasNext: !apiResponse.last,
      hasPrevious: !apiResponse.first,
    };
  }
}
