/**
 * @fileoverview Мапери для конвертації API відповідей у доменні типи
 * @module domain/wizard/services/stage-3-item-management/basic-info/utils/api-mappers
 */

import { ServiceCategory, MeasurementUnit } from '../types/service-categories.types';

import type {
  ServiceCategoryApiResponse,
  ItemNameApiResponse,
} from '../schemas/api-responses.schemas';
import type { ItemNameOption } from '../types/basic-info-state.types';
import type { ServiceCategoryInfo } from '../types/service-categories.types';

/**
 * Мапер для конвертації API категорії у доменну модель
 */
export function mapServiceCategoryApiToDomain(
  apiResponse: ServiceCategoryApiResponse
): ServiceCategoryInfo {
  // Визначаємо категорію на основі коду або назви
  const categoryId = mapCategoryCodeToEnum(apiResponse.code);

  // Визначаємо одиницю виміру за замовчуванням для категорії
  const defaultUnit = getDefaultUnitForCategory(categoryId);

  return {
    id: categoryId,
    name: apiResponse.name,
    description: apiResponse.description,
    defaultUnit,
  };
}

/**
 * Мапер для конвертації API предмета у доменну модель
 */
export function mapItemNameApiToDomain(apiResponse: ItemNameApiResponse): ItemNameOption {
  const categoryId = mapCategoryCodeToEnum(apiResponse.categoryCode || apiResponse.categoryId);
  const defaultUnit = mapUnitOfMeasureToEnum(apiResponse.unitOfMeasure);

  return {
    id: apiResponse.id,
    name: apiResponse.name,
    basePrice: apiResponse.basePrice,
    category: categoryId,
    defaultUnit,
  };
}

/**
 * Приватні утиліти
 */
function mapCategoryCodeToEnum(code?: string): ServiceCategory {
  const codeToEnum: Record<string, ServiceCategory> = {
    'clothing-textile-cleaning': ServiceCategory.CLOTHING_TEXTILE_CLEANING,
    laundry: ServiceCategory.LAUNDRY,
    ironing: ServiceCategory.IRONING,
    'leather-cleaning-restoration': ServiceCategory.LEATHER_CLEANING_RESTORATION,
    'sheepskin-coats': ServiceCategory.SHEEPSKIN_COATS,
    'natural-fur-products': ServiceCategory.NATURAL_FUR_PRODUCTS,
    'textile-dyeing': ServiceCategory.TEXTILE_DYEING,
  };

  return codeToEnum[code || ''] || ServiceCategory.CLOTHING_TEXTILE_CLEANING;
}

function mapUnitOfMeasureToEnum(unit: string): MeasurementUnit {
  const unitMap: Record<string, MeasurementUnit> = {
    шт: MeasurementUnit.PIECES,
    штуки: MeasurementUnit.PIECES,
    pieces: MeasurementUnit.PIECES,
    кг: MeasurementUnit.KILOGRAMS,
    кілограми: MeasurementUnit.KILOGRAMS,
    kilograms: MeasurementUnit.KILOGRAMS,
  };

  return unitMap[unit.toLowerCase()] || MeasurementUnit.PIECES;
}

function getDefaultUnitForCategory(category: ServiceCategory): MeasurementUnit {
  // Для прання білизни - кілограми, для всього іншого - штуки
  return category === ServiceCategory.LAUNDRY ? MeasurementUnit.KILOGRAMS : MeasurementUnit.PIECES;
}
