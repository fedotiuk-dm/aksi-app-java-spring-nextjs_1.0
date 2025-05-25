/**
 * @fileoverview Адаптер предметів замовлення API → Domain
 * @module domain/wizard/adapters
 */

// === ІМПОРТИ ЗГЕНЕРОВАНИХ API ТИПІВ ===
import type { OrderItem } from '../types';
import type { OrderItemDTO, OrderItemDetailedDTO } from '@/lib/api';

/**
 * Адаптер для перетворення API типів предметів замовлення у доменні типи
 */
export class OrderItemAdapter {
  /**
   * Перетворює базовий OrderItemDTO у доменний OrderItem
   */
  static fromBasicDTO(apiItem: OrderItemDTO): OrderItem {
    return {
      id: apiItem.id || '',
      orderId: apiItem.orderId || undefined,
      name: apiItem.name || '',
      description: apiItem.description || undefined,
      quantity: apiItem.quantity || 1,
      unitPrice: apiItem.unitPrice || 0,
      totalPrice: apiItem.totalPrice || (apiItem.unitPrice || 0) * (apiItem.quantity || 1),
      category: apiItem.category || undefined,
      color: apiItem.color || undefined,
      material: apiItem.material || undefined,
      unitOfMeasure: apiItem.unitOfMeasure || undefined,
      defects: Array.isArray(apiItem.defects)
        ? apiItem.defects.join(', ')
        : typeof apiItem.defects === 'string'
          ? apiItem.defects
          : undefined,
      specialInstructions: apiItem.specialInstructions || undefined,
      // Поля відсутні в базовому DTO
      fillerType: undefined,
      fillerCompressed: undefined,
      wearDegree: undefined,
      stains: undefined,
      otherStains: undefined,
      defectsAndRisks: undefined,
      noGuaranteeReason: undefined,
      defectsNotes: undefined,
      photos: [],
    };
  }

  /**
   * Перетворює детальний OrderItemDetailedDTO у доменний OrderItem
   */
  static fromDetailedDTO(apiItem: OrderItemDetailedDTO): OrderItem {
    return {
      id: apiItem.id || '',
      orderId: undefined, // Відсутнє в detailed DTO
      name: apiItem.name || '',
      description: undefined, // Відсутнє в detailed DTO
      quantity: apiItem.quantity || 1,
      unitPrice: apiItem.basePrice || 0,
      totalPrice: apiItem.finalPrice || apiItem.basePrice || 0,
      category: apiItem.category || undefined,
      color: apiItem.color || undefined,
      material: apiItem.material || undefined,
      unitOfMeasure: apiItem.unitOfMeasure || undefined,
      defects: Array.isArray(apiItem.defects) ? apiItem.defects.join(', ') : undefined,
      specialInstructions: undefined,
      fillerType: apiItem.filler || undefined,
      fillerCompressed: apiItem.fillerClumped || undefined,
      wearDegree: apiItem.wearPercentage?.toString() || undefined,
      stains: Array.isArray(apiItem.stains) ? apiItem.stains.join(', ') : undefined,
      otherStains: undefined,
      defectsAndRisks: Array.isArray(apiItem.defects) ? apiItem.defects.join(', ') : undefined,
      noGuaranteeReason: undefined,
      defectsNotes: apiItem.defectNotes || undefined,
      photos: (apiItem.photos || []).map((photo) => photo.id || ''),
    };
  }

  /**
   * Універсальний метод для будь-якого типу OrderItem API
   */
  static toDomain(apiItem: OrderItemDTO | OrderItemDetailedDTO): OrderItem {
    // Перевіряємо чи це detailed DTO за наявністю специфічних полів
    if ('basePrice' in apiItem || 'finalPrice' in apiItem || 'filler' in apiItem) {
      return this.fromDetailedDTO(apiItem as OrderItemDetailedDTO);
    }
    return this.fromBasicDTO(apiItem as OrderItemDTO);
  }

  /**
   * Перетворює доменний тип у OrderItemDTO для API запитів
   */
  static toApiRequest(domainItem: Partial<OrderItem>): Partial<OrderItemDTO> {
    return {
      name: domainItem.name,
      description: domainItem.description,
      quantity: domainItem.quantity,
      unitPrice: domainItem.unitPrice,
      totalPrice: domainItem.totalPrice,
      category: domainItem.category,
      color: domainItem.color,
      material: domainItem.material,
      unitOfMeasure: domainItem.unitOfMeasure,
      defects: domainItem.defects,
      specialInstructions: domainItem.specialInstructions,
    };
  }
}
