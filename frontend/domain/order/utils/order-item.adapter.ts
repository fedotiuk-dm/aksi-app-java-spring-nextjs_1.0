/**
 * Адаптер для перетворення OrderItem між API та доменом
 */

import { MaterialType, WearDegree, FillerType } from '../types';

import type { OrderItem } from '../types';
// Тимчасово використовуємо any для API типів поки не буде створено правильний API клієнт
type OrderItemDTO = any;
type CreateOrderItemRequest = any;

export class OrderItemAdapter {
  /**
   * Перетворює OrderItemDTO з API в доменний OrderItem
   */
  static fromApiDTO(dto: OrderItemDTO): OrderItem {
    return {
      id: dto.id?.toString(),
      orderId: dto.orderId?.toString(),
      name: dto.name || '',
      description: dto.description,
      quantity: dto.quantity || 1,
      unitPrice: dto.unitPrice || 0,
      totalPrice: dto.totalPrice || 0,
      calculatedPrice: dto.totalPrice || 0,
      category: dto.category,
      color: dto.color,
      material: this.fromApiMaterial(dto.material),
      unitOfMeasure: dto.unitOfMeasure,
      defects: dto.defects,
      specialInstructions: dto.specialInstructions,
      fillerType: this.fromApiFillerType(dto.fillerType),
      fillerCompressed: dto.fillerCompressed,
      wearDegree: this.fromApiWearDegree(dto.wearDegree),
      stains: dto.stains,
      otherStains: dto.otherStains,
      defectsAndRisks: dto.defectsAndRisks,
      noGuaranteeReason: dto.noGuaranteeReason,
      defectsNotes: dto.defectsNotes,
      discountApplied: 0,
      modifiersApplied: [],
      hasPhotos: false,
      photoCount: 0,
      isComplete: false,
      hasIssues: Boolean(dto.defects || dto.defectsAndRisks || dto.noGuaranteeReason),
    };
  }

  /**
   * Перетворює доменний OrderItem в API DTO
   */
  static toApiDTO(item: OrderItem): CreateOrderItemRequest {
    return {
      orderId: item.orderId ? parseInt(item.orderId) : undefined,
      name: item.name,
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      category: item.category,
      color: item.color,
      material: item.material,
      unitOfMeasure: item.unitOfMeasure,
      defects: item.defects,
      specialInstructions: item.specialInstructions,
      fillerType: item.fillerType,
      fillerCompressed: item.fillerCompressed,
      wearDegree: item.wearDegree,
      stains: item.stains,
      otherStains: item.otherStains,
      defectsAndRisks: item.defectsAndRisks,
      noGuaranteeReason: item.noGuaranteeReason,
      defectsNotes: item.defectsNotes,
    };
  }

  /**
   * Перетворює API матеріал в доменний enum
   */
  private static fromApiMaterial(material?: string): MaterialType | undefined {
    if (!material) return undefined;

    const materialMap: Record<string, MaterialType> = {
      COTTON: MaterialType.COTTON,
      WOOL: MaterialType.WOOL,
      SILK: MaterialType.SILK,
      SYNTHETIC: MaterialType.SYNTHETIC,
      LEATHER: MaterialType.LEATHER,
      NUBUCK: MaterialType.NUBUCK,
      SUEDE: MaterialType.SUEDE,
      SPLIT_LEATHER: MaterialType.SPLIT_LEATHER,
    };

    return materialMap[material];
  }

  /**
   * Перетворює API тип наповнювача в доменний enum
   */
  private static fromApiFillerType(fillerType?: string): FillerType | undefined {
    if (!fillerType) return undefined;

    const fillerMap: Record<string, FillerType> = {
      DOWN: FillerType.DOWN,
      SYNTHETIC: FillerType.SYNTHETIC,
      OTHER: FillerType.OTHER,
    };

    return fillerMap[fillerType];
  }

  /**
   * Перетворює API ступінь зносу в доменний enum
   */
  private static fromApiWearDegree(wearDegree?: string): WearDegree | undefined {
    if (!wearDegree) return undefined;

    const wearMap: Record<string, WearDegree> = {
      '10%': WearDegree.PERCENT_10,
      '30%': WearDegree.PERCENT_30,
      '50%': WearDegree.PERCENT_50,
      '75%': WearDegree.PERCENT_75,
    };

    return wearMap[wearDegree];
  }

  /**
   * Перетворює масив API DTO в масив доменних об'єктів
   */
  static fromApiDTOList(dtos: OrderItemDTO[]): OrderItem[] {
    return dtos.map(this.fromApiDTO);
  }

  /**
   * Створює порожній предмет для нового
   */
  static createEmpty(orderId?: string): OrderItem {
    return {
      orderId,
      name: '',
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0,
      calculatedPrice: 0,
      discountApplied: 0,
      modifiersApplied: [],
      hasPhotos: false,
      photoCount: 0,
      isComplete: false,
      hasIssues: false,
    };
  }

  /**
   * Створює короткий опис предмета для відображення
   */
  static createSummary(item: OrderItem): string {
    const parts = [item.name];

    if (item.color) parts.push(item.color);
    if (item.quantity > 1) parts.push(`${item.quantity} шт.`);
    if (item.totalPrice) parts.push(`${item.totalPrice} грн`);

    return parts.filter(Boolean).join(' | ');
  }
}
