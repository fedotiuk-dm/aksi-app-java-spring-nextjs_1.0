/**
 * @fileoverview Маппер для перетворення PriceListItemDTO ↔ WizardPriceListItem
 * @module domain/wizard/adapters/pricing/mappers
 */

import type { WizardPriceListItem } from '../types';
import type { PriceListItemDTO } from '@/lib/api';

/**
 * Перетворює PriceListItemDTO у WizardPriceListItem
 */
export function mapPriceListItemDTOToDomain(apiItem: PriceListItemDTO): WizardPriceListItem {
  return {
    id: apiItem.id || '',
    categoryId: apiItem.categoryId || '',
    categoryCode: apiItem.categoryId || '', // Використовуємо categoryId як код
    categoryName: '', // Буде заповнено окремо
    itemNumber: apiItem.id || '', // Використовуємо id як номер
    name: apiItem.name || '',
    unitOfMeasure: apiItem.unitOfMeasure || 'шт',
    basePrice: apiItem.basePrice || 0,
    isActive: apiItem.active || false,
    description: '', // Поле відсутнє в DTO
    notes: '', // Поле відсутнє в DTO
  };
}

/**
 * Перетворює масив PriceListItemDTO у WizardPriceListItem[]
 */
export function mapPriceListItemArrayToDomain(apiItems: PriceListItemDTO[]): WizardPriceListItem[] {
  return apiItems.map(mapPriceListItemDTOToDomain);
}
