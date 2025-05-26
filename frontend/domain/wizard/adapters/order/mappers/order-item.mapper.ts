/**
 * @fileoverview Маппер для перетворення OrderItemDTO ↔ WizardOrderItem
 * @module domain/wizard/adapters/order/mappers
 */

import { WizardModifierType } from '../../pricing/types';

import type { WizardOrderItem, WizardOrderItemDetailed } from '../types';
import type { OrderItemDTO, OrderItemDetailedDTO } from '@/lib/api';

/**
 * Конвертер типу модифікатора з API в доменний тип
 */
function mapModifierTypeToDomain(apiType?: string): WizardModifierType {
  switch (apiType?.toUpperCase()) {
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
 * Перетворює OrderItemDTO у WizardOrderItem
 */
export function mapOrderItemDTOToDomain(apiItem: OrderItemDTO): WizardOrderItem {
  return {
    id: apiItem.id || '',
    categoryName: apiItem.category || '',
    itemName: apiItem.name || '',
    quantity: apiItem.quantity || 1,
    unit: apiItem.unitOfMeasure || 'шт',
    basePrice: apiItem.unitPrice || 0,
    finalPrice: apiItem.totalPrice || 0,
    material: apiItem.material,
    color: apiItem.color,
    notes: apiItem.specialInstructions,
  };
}

/**
 * Перетворює OrderItemDetailedDTO у WizardOrderItemDetailed
 */
export function mapOrderItemDetailedDTOToDomain(
  apiItem: OrderItemDetailedDTO
): WizardOrderItemDetailed {
  return {
    id: apiItem.id || '',
    categoryName: apiItem.category || '',
    itemName: apiItem.name || '',
    quantity: apiItem.quantity || 1,
    unit: apiItem.unitOfMeasure || 'шт',
    basePrice: apiItem.basePrice || 0,
    finalPrice: apiItem.finalPrice || 0,
    material: apiItem.material,
    color: apiItem.color,
    notes: apiItem.defectNotes,
    priceCalculation: {
      basePrice: apiItem.basePrice || 0,
      modifiers:
        apiItem.priceModifiers?.map((modifier) => ({
          name: modifier.name || '',
          type: mapModifierTypeToDomain(modifier.type),
          value: modifier.value || 0,
          amount: modifier.amount || 0,
        })) || [],
      subtotal: apiItem.basePrice || 0,
      discountAmount: 0,
      finalPrice: apiItem.finalPrice || 0,
    },
    defects: apiItem.defects || [],
    stains: apiItem.stains || [],
    risks: apiItem.defects || [], // Ризики = дефекти в API
    fillerType: apiItem.filler,
    fillerCompressed: apiItem.fillerClumped,
    wearDegree: apiItem.wearPercentage ? `${apiItem.wearPercentage}%` : undefined,
    photos: apiItem.photos?.map((photo) => photo.id || '') || [],
  };
}

/**
 * Перетворює WizardOrderItem у API формат
 */
export function mapOrderItemToDTO(domainItem: Partial<WizardOrderItem>): Partial<OrderItemDTO> {
  return {
    id: domainItem.id,
    name: domainItem.itemName || '',
    category: domainItem.categoryName,
    quantity: domainItem.quantity || 1,
    unitPrice: domainItem.basePrice || 0,
    totalPrice: domainItem.finalPrice,
    unitOfMeasure: domainItem.unit,
    material: domainItem.material,
    color: domainItem.color,
    specialInstructions: domainItem.notes,
  };
}

/**
 * Перетворює масив OrderItemDTO у WizardOrderItem[]
 */
export function mapOrderItemArrayToDomain(apiItems: OrderItemDTO[]): WizardOrderItem[] {
  return apiItems.map(mapOrderItemDTOToDomain);
}

/**
 * Перетворює масив OrderItemDetailedDTO у WizardOrderItemDetailed[]
 */
export function mapOrderItemDetailedArrayToDomain(
  apiItems: OrderItemDetailedDTO[]
): WizardOrderItemDetailed[] {
  return apiItems.map(mapOrderItemDetailedDTOToDomain);
}
