/**
 * @fileoverview Маппер для перетворення OrderDTO ↔ WizardOrder
 * @module domain/wizard/adapters/order/mappers
 */

import {
  mapApiStatusToWizard,
  mapApiExpediteTypeToWizard,
  mapApiModifierTypeToWizard,
} from './enum.mapper.improved';
import { WizardModifierType } from '../../shared';

import type {
  WizardOrder,
  WizardOrderDetailed,
  WizardOrderSummary,
  WizardOrderCreateData,
  WizardOrderClientInfo,
  WizardOrderBranchInfo,
  WizardOrderItem,
} from '../types';
import type {
  OrderDTO,
  OrderDetailedSummaryResponse,
  CreateOrderRequest,
  OrderSummaryDTO,
  OrderItemDTO,
  OrderItemDetailedDTO,
  BranchLocationDTO,
  ClientResponse,
  PriceModifierDTO,
} from '@/lib/api';

/**
 * Перетворює ClientResponse у WizardOrderClientInfo
 */
function mapClientToOrderClientInfo(
  client: ClientResponse | undefined
): WizardOrderClientInfo | undefined {
  if (!client) return undefined;

  return {
    id: client.id || '',
    fullName: client.fullName || `${client.firstName || ''} ${client.lastName || ''}`.trim(),
    phone: client.phone || '',
    email: client.email,
  };
}

/**
 * Перетворює BranchLocationDTO у WizardOrderBranchInfo
 */
function mapBranchToOrderBranchInfo(
  branch: BranchLocationDTO | undefined
): WizardOrderBranchInfo | undefined {
  if (!branch) return undefined;

  return {
    id: branch.id || '',
    name: branch.name || '',
    code: branch.code || '',
    address: branch.address || '',
  };
}

/**
 * Перетворює OrderItemDTO у WizardOrderItem
 */
function mapOrderItemDTOToDomain(apiItem: OrderItemDTO): WizardOrderItem {
  return {
    id: apiItem.id,
    categoryName: apiItem.category || '',
    itemName: apiItem.name || '',
    quantity: apiItem.quantity || 1,
    unit: apiItem.unitOfMeasure || 'шт',
    basePrice: apiItem.unitPrice || 0,
    finalPrice: apiItem.totalPrice || apiItem.unitPrice || 0,
    material: apiItem.material,
    color: apiItem.color,
    notes: apiItem.specialInstructions,
  };
}

/**
 * Перетворює WizardPriceModifierType в WizardModifierType
 */
function mapPriceModifierTypeToWizardModifierType(type: string | undefined): WizardModifierType {
  switch (type) {
    case 'PERCENTAGE':
      return WizardModifierType.PERCENTAGE;
    case 'FIXED_AMOUNT':
      return WizardModifierType.FIXED_AMOUNT;
    case 'MULTIPLIER':
      return WizardModifierType.MULTIPLIER;
    default:
      return WizardModifierType.PERCENTAGE;
  }
}

/**
 * Перетворює PriceModifierDTO в доменний тип модифікатора
 */
function mapPriceModifierToDomain(apiModifier: PriceModifierDTO) {
  const wizardPriceModifierType = mapApiModifierTypeToWizard(apiModifier.type);
  return {
    name: apiModifier.name || '',
    type: mapPriceModifierTypeToWizardModifierType(wizardPriceModifierType.toString()),
    value: apiModifier.value || 0,
    amount: apiModifier.amount || 0,
  };
}

/**
 * Перетворює OrderItemDetailedDTO у WizardOrderItem
 */
function mapOrderItemDetailedDTOToDomain(apiItem: OrderItemDetailedDTO): WizardOrderItem {
  return {
    id: apiItem.id,
    categoryName: apiItem.category || '',
    itemName: apiItem.name || '',
    quantity: apiItem.quantity || 1,
    unit: apiItem.unitOfMeasure || 'шт',
    basePrice: apiItem.basePrice || 0,
    finalPrice: apiItem.finalPrice || apiItem.basePrice || 0,
    material: apiItem.material,
    color: apiItem.color,
    notes: apiItem.defectNotes,
  };
}

/**
 * Перетворює OrderDTO у WizardOrder
 */
export function mapOrderDTOToDomain(apiOrder: OrderDTO): WizardOrder {
  return {
    id: apiOrder.id || '',
    receiptNumber: apiOrder.receiptNumber || '',
    tagNumber: apiOrder.tagNumber,
    status: mapApiStatusToWizard(apiOrder.status),
    clientInfo: mapClientToOrderClientInfo(apiOrder.client),
    branchInfo: mapBranchToOrderBranchInfo(apiOrder.branchLocation),
    items: (apiOrder.items || []).map(mapOrderItemDTOToDomain),
    itemCount: apiOrder.items?.length || 0,
    totalAmount: apiOrder.totalAmount || 0,
    discountAmount: apiOrder.discountAmount,
    finalAmount: apiOrder.finalAmount || apiOrder.totalAmount || 0,
    prepaymentAmount: apiOrder.prepaymentAmount,
    balanceAmount: apiOrder.balanceAmount || 0,
    expediteType: mapApiExpediteTypeToWizard(apiOrder.expediteType),
    expectedCompletionDate: apiOrder.expectedCompletionDate,
    createdDate: apiOrder.createdDate || new Date().toISOString(),
    updatedDate: apiOrder.updatedDate,
    completedDate: apiOrder.completedDate,
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
 * Перетворює OrderDetailedSummaryResponse у WizardOrderDetailed
 */
export function mapOrderDetailedToDomain(
  apiOrder: OrderDetailedSummaryResponse
): WizardOrderDetailed {
  return {
    id: apiOrder.id || '',
    receiptNumber: apiOrder.receiptNumber || '',
    tagNumber: apiOrder.tagNumber,
    clientInfo: mapClientToOrderClientInfo(apiOrder.client),
    branchInfo: mapBranchToOrderBranchInfo(apiOrder.branchLocation),
    items: (apiOrder.items || []).map((item: OrderItemDetailedDTO) => ({
      ...mapOrderItemDetailedDTOToDomain(item),
      priceCalculation: {
        basePrice: item.basePrice || 0,
        modifiers: (item.priceModifiers || []).map(mapPriceModifierToDomain),
        subtotal: (item.basePrice || 0) * (item.quantity || 1),
        discountAmount: 0, // Не доступно в OrderItemDetailedDTO
        finalPrice: item.finalPrice || 0,
      },
      defects: item.defects || [],
      stains: item.stains || [],
      risks: item.defects || [], // В API defects об'єднані з ризиками
    })),
    totalAmount: apiOrder.totalAmount || 0,
    discountAmount: apiOrder.discountAmount,
    expediteSurchargeAmount: apiOrder.expediteSurchargeAmount,
    finalAmount: apiOrder.finalAmount || 0,
    prepaymentAmount: apiOrder.prepaymentAmount,
    balanceAmount: apiOrder.balanceAmount || 0,
    expediteType: mapApiExpediteTypeToWizard(apiOrder.expediteType),
    expectedCompletionDate: apiOrder.expectedCompletionDate,
    createdDate: apiOrder.createdDate || new Date().toISOString(),
    customerNotes: apiOrder.customerNotes,
    discountType: apiOrder.discountType,
    discountPercentage: apiOrder.discountPercentage,
  };
}

/**
 * Перетворює OrderSummaryDTO у WizardOrderSummary
 */
export function mapOrderSummaryDTOToDomain(apiOrder: OrderSummaryDTO): WizardOrderSummary {
  return {
    id: apiOrder.id || '',
    receiptNumber: apiOrder.receiptNumber || '',
    status: mapApiStatusToWizard(apiOrder.status),
    totalAmount: apiOrder.totalAmount || 0,
    createdAt: apiOrder.createdAt || new Date().toISOString(),
    completionDate: apiOrder.completionDate,
    itemCount: apiOrder.itemCount || 0,
  };
}

/**
 * Перетворює WizardOrderCreateData у CreateOrderRequest
 */
export function mapOrderToCreateRequest(orderData: WizardOrderCreateData): CreateOrderRequest {
  return {
    tagNumber: orderData.tagNumber,
    clientId: orderData.clientId,
    branchLocationId: orderData.branchLocationId,
    items: orderData.items?.map((item) => ({
      name: item.itemName,
      description: item.categoryName,
      quantity: item.quantity,
      unitPrice: item.basePrice,
      totalPrice: item.finalPrice,
      category: item.categoryName,
      material: item.material,
      color: item.color,
      unitOfMeasure: item.unit,
      specialInstructions: item.notes,
    })),
    discountAmount: orderData.discountAmount,
    prepaymentAmount: orderData.prepaymentAmount,
    expectedCompletionDate: orderData.expectedCompletionDate,
    customerNotes: orderData.customerNotes,
    internalNotes: orderData.internalNotes,
    expediteType: orderData.expediteType
      ? (orderData.expediteType as unknown as CreateOrderRequest.expediteType)
      : undefined,
    draft: orderData.draft,
  };
}

/**
 * Перетворює масив OrderDTO у WizardOrder[]
 */
export function mapOrderArrayToDomain(apiOrders: OrderDTO[]): WizardOrder[] {
  return apiOrders.map(mapOrderDTOToDomain);
}

/**
 * Перетворює WizardOrder у часткові дані для створення
 */
export function mapWizardOrderToCreateData(order: Partial<WizardOrder>): WizardOrderCreateData {
  if (!order.clientInfo?.id || !order.branchInfo?.id) {
    throw new Error("Обов'язкові поля для створення замовлення: clientId, branchLocationId");
  }

  return {
    tagNumber: order.tagNumber,
    clientId: order.clientInfo.id,
    branchLocationId: order.branchInfo.id,
    items: order.items,
    discountAmount: order.discountAmount,
    prepaymentAmount: order.prepaymentAmount,
    expectedCompletionDate: order.expectedCompletionDate,
    customerNotes: order.customerNotes,
    internalNotes: order.internalNotes,
    expediteType: order.expediteType,
    draft: order.draft,
  };
}
