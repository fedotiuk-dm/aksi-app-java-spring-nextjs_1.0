/**
 * @fileoverview Маппер для перетворення PriceListItemDTO ↔ WizardPriceListItem
 * @module domain/wizard/adapters/pricing/mappers
 */

import type { WizardPriceListItem } from '../types';

/**
 * Інтерфейс для API відповіді з елементами прайс-листа
 */
interface PriceListItemApiResponse extends Record<string, unknown> {
  id?: string;
  categoryId?: string;
  name?: string;
  unitOfMeasure?: string;
  basePrice?: number;
  active?: boolean;
}

/**
 * Перетворює PriceListItemApiResponse у WizardPriceListItem
 */
export function mapPriceListItemDTOToDomain(
  apiItem: PriceListItemApiResponse
): WizardPriceListItem {
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
 * Перетворює масив PriceListItemApiResponse у WizardPriceListItem[]
 */
export function mapPriceListItemArrayToDomain(
  apiItems: PriceListItemApiResponse[]
): WizardPriceListItem[] {
  return apiItems.map(mapPriceListItemDTOToDomain);
}
