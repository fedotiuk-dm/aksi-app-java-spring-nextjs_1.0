/**
 * @fileoverview Маппер для перетворення PriceListItemDTO ↔ WizardPriceListItem
 * @module domain/wizard/adapters/pricing/mappers
 */

import type { WizardPriceListItem } from '../types';
import type { PriceListItemDTO } from '@/lib/api';

/**
 * Розширений інтерфейс для API відповіді з елементами прайс-листа
 * Додає поля, які можуть не бути в базовому PriceListItemDTO
 */
interface ExtendedPriceListItemResponse extends PriceListItemDTO {
  categoryCode?: string;
  categoryName?: string;
  description?: string;
  notes?: string;
}

/**
 * Перетворює ExtendedPriceListItemResponse у WizardPriceListItem
 */
export function mapPriceListItemDTOToDomain(
  apiItem: ExtendedPriceListItemResponse
): WizardPriceListItem {
  return {
    id: apiItem.id || '',
    categoryId: apiItem.categoryId || '',
    categoryCode: apiItem.categoryCode || apiItem.categoryId || '',
    categoryName: apiItem.categoryName || '',
    itemNumber: apiItem.catalogNumber?.toString() || apiItem.id || '',
    name: apiItem.name || '',
    unitOfMeasure: apiItem.unitOfMeasure || 'шт',
    basePrice: apiItem.basePrice || 0,
    isActive: apiItem.active || false,
    description: apiItem.description || '',
    notes: apiItem.notes || '',
  };
}

/**
 * Перетворює масив ExtendedPriceListItemResponse у WizardPriceListItem[]
 */
export function mapPriceListItemArrayToDomain(
  apiItems: ExtendedPriceListItemResponse[]
): WizardPriceListItem[] {
  return apiItems.map(mapPriceListItemDTOToDomain);
}
