/**
 * Адаптер для перетворення Order між API та доменом
 * Реалізує принцип чистої архітектури - domain не залежить від API
 */

import { OrderStatus, ExpediteType } from '../types';

import type { Order, OrderItem } from '../types';
import type { OrderDTO, CreateOrderRequest, OrderItemDTO } from '@/lib/api';

export class OrderAdapter {
  /**
   * Перетворює OrderDTO з API в доменний Order
   */
  static fromApiDTO(dto: OrderDTO): Order {
    return {
      id: dto.id?.toString(),
      receiptNumber: dto.receiptNumber || '',
      tagNumber: dto.tagNumber,
      client: dto.client,
      clientId: dto.clientId?.toString(),
      items: dto.items?.map(this.fromApiItemDTO) || [],
      itemsCount: dto.items?.length || 0,
      totalAmount: dto.totalAmount || 0,
      discountAmount: dto.discountAmount || 0,
      finalAmount: dto.finalAmount || 0,
      prepaymentAmount: dto.prepaymentAmount || 0,
      balanceAmount: dto.balanceAmount || 0,
      branchLocation: dto.branchLocation,
      branchLocationId: dto.branchLocationId?.toString(),
      status: this.fromApiStatus(dto.status),
      createdDate: dto.createdDate ? new Date(dto.createdDate) : new Date(),
      updatedDate: dto.updatedDate ? new Date(dto.updatedDate) : undefined,
      expectedCompletionDate: dto.expectedCompletionDate
        ? new Date(dto.expectedCompletionDate)
        : undefined,
      completedDate: dto.completedDate ? new Date(dto.completedDate) : undefined,
      customerNotes: dto.customerNotes,
      internalNotes: dto.internalNotes,
      completionComments: dto.completionComments,
      expediteType: this.fromApiExpediteType(dto.expediteType),
      termsAccepted: dto.termsAccepted || false,
      finalizedAt: dto.finalizedAt ? new Date(dto.finalizedAt) : undefined,
      express: dto.express || false,
      draft: dto.draft || false,
      printed: dto.printed || false,
      emailed: dto.emailed || false,
    };
  }

  /**
   * Перетворює доменний Order в API DTO
   */
  static toApiDTO(order: Order): CreateOrderRequest {
    return {
      receiptNumber: order.receiptNumber,
      tagNumber: order.tagNumber,
      clientId: order.clientId ? parseInt(order.clientId) : undefined,
      branchLocationId: order.branchLocationId ? parseInt(order.branchLocationId) : undefined,
      customerNotes: order.customerNotes,
      internalNotes: order.internalNotes,
      expediteType: (order.expediteType || 'STANDARD') as any,
      draft: order.draft || false,
      // items додаватимуться окремо через OrderItemService
    };
  }

  /**
   * Перетворює OrderItemDTO в доменний OrderItem
   */
  private static fromApiItemDTO(dto: OrderItemDTO): OrderItem {
    return {
      id: dto.id?.toString(),
      orderId: dto.orderId?.toString(),
      name: dto.name || '',
      description: dto.description,
      quantity: dto.quantity || 1,
      unitPrice: dto.unitPrice || 0,
      totalPrice: dto.totalPrice || 0,
      category: dto.category,
      color: dto.color,
      material: dto.material,
      unitOfMeasure: dto.unitOfMeasure,
      defects: dto.defects,
      specialInstructions: dto.specialInstructions,
      fillerType: dto.fillerType,
      fillerCompressed: dto.fillerCompressed,
      wearDegree: dto.wearDegree,
      stains: dto.stains,
      otherStains: dto.otherStains,
      defectsAndRisks: dto.defectsAndRisks,
      noGuaranteeReason: dto.noGuaranteeReason,
      defectsNotes: dto.defectsNotes,
      calculatedPrice: dto.totalPrice || 0,
      discountApplied: 0,
      modifiersApplied: [],
      hasPhotos: false,
      photoCount: 0,
      isComplete: false,
      hasIssues: Boolean(dto.defects || dto.defectsAndRisks || dto.noGuaranteeReason),
    };
  }

  /**
   * Перетворює API статус в доменний enum
   */
  private static fromApiStatus(status?: string): OrderStatus {
    if (!status) return OrderStatus.DRAFT;

    const statusMap: Record<string, OrderStatus> = {
      DRAFT: OrderStatus.DRAFT,
      NEW: OrderStatus.NEW,
      IN_PROGRESS: OrderStatus.IN_PROGRESS,
      COMPLETED: OrderStatus.COMPLETED,
      DELIVERED: OrderStatus.DELIVERED,
      CANCELLED: OrderStatus.CANCELLED,
    };

    return statusMap[status] || OrderStatus.DRAFT;
  }

  /**
   * Перетворює API тип терміновості в доменний enum
   */
  private static fromApiExpediteType(expediteType?: string): ExpediteType {
    if (!expediteType) return ExpediteType.STANDARD;

    const expediteMap: Record<string, ExpediteType> = {
      STANDARD: ExpediteType.STANDARD,
      EXPRESS_48H: ExpediteType.EXPRESS_48H,
      EXPRESS_24H: ExpediteType.EXPRESS_24H,
    };

    return expediteMap[expediteType] || ExpediteType.STANDARD;
  }

  /**
   * Перетворює масив API DTO в масив доменних об'єктів
   */
  static fromApiDTOList(dtos: OrderDTO[]): Order[] {
    return dtos.map(this.fromApiDTO);
  }

  /**
   * Створює порожнє замовлення для нового
   */
  static createEmpty(): Order {
    return {
      receiptNumber: '',
      client: {} as any, // Буде заповнено в візарді
      branchLocation: {} as any, // Буде заповнено в візарді
      status: OrderStatus.DRAFT,
      items: [],
      totalAmount: 0,
      discountAmount: 0,
      finalAmount: 0,
      prepaymentAmount: 0,
      balanceAmount: 0,
      expediteType: ExpediteType.STANDARD,
      termsAccepted: false,
      draft: true,
      express: false,
      printed: false,
      emailed: false,
    };
  }

  /**
   * Створює короткий опис замовлення для відображення
   */
  static createSummary(order: Order): string {
    const parts = [
      `№${order.receiptNumber}`,
      order.client.firstName && order.client.lastName
        ? `${order.client.lastName} ${order.client.firstName}`
        : order.client.phone,
      `${order.items?.length || 0} пред.`,
      `${order.finalAmount || 0} грн`,
    ];

    return parts.filter(Boolean).join(' | ');
  }
}
