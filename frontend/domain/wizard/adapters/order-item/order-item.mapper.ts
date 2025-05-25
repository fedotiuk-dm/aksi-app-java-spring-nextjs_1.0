/**
 * @fileoverview Маппер для перетворення OrderItemDTO ↔ OrderItem
 * @module domain/wizard/adapters/order-item
 */

import type { OrderItem } from '../../types';
import type { OrderItemDTO, OrderItemDetailedDTO } from '@/lib/api';

/**
 * Перетворює OrderItemDTO у доменний OrderItem
 */
export function mapOrderItemDTOToDomain(apiItem: OrderItemDTO): OrderItem {
  return {
    id: apiItem.id || '',
    orderId: apiItem.orderId || '',
    name: apiItem.name,
    description: apiItem.description,
    quantity: apiItem.quantity,
    unitPrice: apiItem.unitPrice,
    totalPrice: apiItem.totalPrice || 0,
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
    photos: [], // Фото поки не підтримуються в OrderItemDTO
  };
}

/**
 * Перетворює OrderItemDetailedDTO у доменний OrderItem
 */
export function mapOrderItemDetailedDTOToDomain(apiItem: OrderItemDetailedDTO): OrderItem {
  return {
    id: apiItem.id || '',
    orderId: '', // OrderItemDetailedDTO не містить orderId
    name: apiItem.name || '',
    description: undefined,
    quantity: apiItem.quantity || 1,
    unitPrice: apiItem.basePrice || 0,
    totalPrice: apiItem.finalPrice || 0,
    category: apiItem.category,
    color: apiItem.color,
    material: apiItem.material,
    unitOfMeasure: apiItem.unitOfMeasure,
    defects: apiItem.defects?.join(', '), // Перетворюємо масив у рядок
    specialInstructions: undefined,
    fillerType: apiItem.filler,
    fillerCompressed: apiItem.fillerClumped,
    wearDegree: apiItem.wearPercentage ? `${apiItem.wearPercentage}%` : undefined,
    stains: apiItem.stains?.join(', '), // Перетворюємо масив у рядок
    otherStains: undefined,
    defectsAndRisks: apiItem.defects?.join(', '), // Перетворюємо масив у рядок
    noGuaranteeReason: undefined,
    defectsNotes: apiItem.defectNotes,
    photos: apiItem.photos?.map((photo) => photo.id || '') || [],
  };
}

/**
 * Перетворює доменний OrderItem у API формат
 */
export function mapOrderItemToDTO(domainItem: Partial<OrderItem>): Partial<OrderItemDTO> {
  return {
    id: domainItem.id,
    orderId: domainItem.orderId,
    name: domainItem.name || '',
    description: domainItem.description,
    quantity: domainItem.quantity || 1,
    unitPrice: domainItem.unitPrice || 0,
    totalPrice: domainItem.totalPrice,
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

/**
 * Перетворює масив API предметів у доменні типи
 */
export function mapOrderItemArrayToDomain(apiItems: OrderItemDTO[]): OrderItem[] {
  return apiItems.map(mapOrderItemDTOToDomain);
}
