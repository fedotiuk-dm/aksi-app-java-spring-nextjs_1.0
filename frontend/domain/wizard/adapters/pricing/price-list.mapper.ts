/**
 * @fileoverview Маппер для перетворення елементів прайс-листа
 * @module domain/wizard/adapters/pricing
 */

import type { PriceListItem } from '../../../pricing/types/pricing.types';
import type { PriceListItemDTO } from '@/lib/api';

/**
 * Перетворює PriceListItemDTO у доменний PriceListItem
 */
export function mapPriceListItemDTOToDomain(apiItem: PriceListItemDTO): PriceListItem {
  return {
    id: apiItem.id || '',
    categoryId: apiItem.categoryId || '',
    catalogNumber: apiItem.catalogNumber,
    name: apiItem.name || '',
    unitOfMeasure: apiItem.unitOfMeasure || 'шт',
    basePrice: apiItem.basePrice || 0,
    priceBlack: apiItem.priceBlack,
    priceColor: apiItem.priceColor,
    active: apiItem.active ?? true,
  };
}

/**
 * Перетворює масив API елементів прайс-листа у доменні типи
 */
export function mapPriceListItemArrayToDomain(apiItems: PriceListItemDTO[]): PriceListItem[] {
  return apiItems.map(mapPriceListItemDTOToDomain);
}
