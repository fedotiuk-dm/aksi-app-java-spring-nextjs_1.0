/**
 * @fileoverview API функції для операцій з прайс-листом
 * @module domain/wizard/adapters/pricing
 */

import { PricingApiService, PricingPriceListService } from '@/lib/api';

import { mapPriceListItemDTOToDomain, mapPriceListItemArrayToDomain } from './price-list.mapper';

import type { PriceListItem } from '../../../pricing/types/pricing.types';

/**
 * Отримання елемента прайс-листа за ID
 */
export async function getPriceListItemById(itemId: string): Promise<PriceListItem> {
  try {
    const apiResponse = await PricingPriceListService.getItemById({ itemId });
    return mapPriceListItemDTOToDomain(apiResponse);
  } catch (error) {
    console.error(`Помилка при отриманні елемента прайс-листа ${itemId}:`, error);
    throw new Error(`Не вдалося отримати елемент прайс-листа: ${error}`);
  }
}

/**
 * Отримання всіх елементів прайс-листа за кодом категорії
 */
export async function getPriceListItemsByCategoryCode(
  categoryCode: string
): Promise<PriceListItem[]> {
  try {
    const apiResponse = await PricingPriceListService.getItemsByCategoryCode({ categoryCode });
    return mapPriceListItemArrayToDomain(apiResponse);
  } catch (error) {
    console.error(
      `Помилка при отриманні елементів прайс-листа для категорії ${categoryCode}:`,
      error
    );
    throw new Error(`Не вдалося отримати елементи прайс-листа: ${error}`);
  }
}

/**
 * Альтернативний метод через PricingApiService
 */
export async function getPriceListItemsByCategoryCodeAlt(
  categoryCode: string
): Promise<PriceListItem[]> {
  try {
    const apiResponse = await PricingApiService.getItemsByCategoryCode({ categoryCode });
    return mapPriceListItemArrayToDomain(apiResponse);
  } catch (error) {
    console.error(
      `Помилка при отриманні елементів прайс-листа для категорії ${categoryCode}:`,
      error
    );
    throw new Error(`Не вдалося отримати елементи прайс-листа: ${error}`);
  }
}
