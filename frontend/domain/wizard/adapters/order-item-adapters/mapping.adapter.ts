/**
 * @fileoverview Адаптер маппінгу типів API ↔ Domain для предметів замовлень
 * @module domain/wizard/adapters/order-item-adapters
 */

import type { OrderItem } from '../../types';
import type { OrderItemDTO, OrderItemDetailedDTO } from '@/lib/api';

/**
 * Адаптер для маппінгу типів між API та Domain для предметів замовлень
 *
 * Відповідальність:
 * - Перетворення API типів у доменні
 * - Перетворення доменних типів у API запити
 * - Маппінг різних типів предметів (DTO, Detailed)
 */
export class OrderItemMappingAdapter {
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
      defects: apiItem.defects || undefined,
      specialInstructions: apiItem.specialInstructions || undefined,
      fillerType: apiItem.fillerType || undefined,
      fillerCompressed: apiItem.fillerCompressed || undefined,
      wearDegree: apiItem.wearDegree || undefined,
      stains: apiItem.stains || undefined,
      otherStains: apiItem.otherStains || undefined,
      defectsAndRisks: apiItem.defectsAndRisks || undefined,
      noGuaranteeReason: apiItem.noGuaranteeReason || undefined,
      defectsNotes: apiItem.defectsNotes || undefined,
      photos: [], // OrderItemDTO не містить фото
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
      specialInstructions: undefined, // Відсутнє в detailed DTO
      fillerType: apiItem.filler || undefined,
      fillerCompressed: apiItem.fillerClumped || undefined,
      wearDegree: apiItem.wearPercentage?.toString() || undefined,
      stains: Array.isArray(apiItem.stains) ? apiItem.stains.join(', ') : undefined,
      otherStains: undefined, // Відсутнє в detailed DTO
      defectsAndRisks: Array.isArray(apiItem.defects) ? apiItem.defects.join(', ') : undefined,
      noGuaranteeReason: undefined, // Відсутнє в detailed DTO
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
   * Перетворює масив API предметів у доменні типи
   */
  static toDomainArray(apiItems: OrderItemDTO[]): OrderItem[] {
    return apiItems.map(this.fromBasicDTO);
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
   * Перетворює доменний тип у повний OrderItemDTO для створення
   */
  static toCreateRequest(domainItem: Partial<OrderItem>): OrderItemDTO {
    return {
      id: domainItem.id,
      orderId: domainItem.orderId,
      name: domainItem.name || '',
      description: domainItem.description,
      quantity: domainItem.quantity || 1,
      unitPrice: domainItem.unitPrice || 0,
      totalPrice: domainItem.totalPrice || 0,
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
   * Перетворює доменний тип у OrderItemDTO для оновлення
   */
  static toUpdateRequest(domainItem: Partial<OrderItem>): OrderItemDTO {
    return this.toCreateRequest(domainItem);
  }

  /**
   * Валідує доменний OrderItem
   */
  static validateDomainItem(item: Partial<OrderItem>): string[] {
    const errors: string[] = [];

    if (!item.name || item.name.trim() === '') {
      errors.push("Назва предмета обов'язкова");
    }

    if (!item.quantity || item.quantity <= 0) {
      errors.push('Кількість повинна бути більше 0');
    }

    if (!item.unitPrice || item.unitPrice < 0) {
      errors.push("Ціна за одиницю не може бути від'ємною");
    }

    return errors;
  }

  /**
   * Обчислює загальну ціну предмета
   */
  static calculateTotalPrice(item: Partial<OrderItem>): number {
    const quantity = item.quantity || 0;
    const unitPrice = item.unitPrice || 0;
    return quantity * unitPrice;
  }

  /**
   * Перевіряє чи потребує предмет фото
   */
  static requiresPhotos(item: OrderItem): boolean {
    return !!(item.defects || item.stains || item.defectsAndRisks);
  }

  /**
   * Створює короткий опис предмета для відображення
   */
  static createDisplaySummary(item: OrderItem): string {
    const parts = [item.name];

    if (item.material) parts.push(item.material);
    if (item.color) parts.push(item.color);
    if (item.quantity > 1) parts.push(`${item.quantity} ${item.unitOfMeasure || 'шт'}`);

    return parts.join(', ');
  }
}
