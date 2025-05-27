/**
 * @fileoverview Типи категорій послуг для підетапу 2.1
 * @module domain/wizard/services/stage-3-item-management/basic-info/types/service-categories
 */

/**
 * Категорії послуг згідно з документацією
 */
export enum ServiceCategory {
  CLOTHING_TEXTILE_CLEANING = 'clothing-textile-cleaning', // Чистка одягу та текстилю
  LAUNDRY = 'laundry', // Прання білизни
  IRONING = 'ironing', // Прасування
  LEATHER_CLEANING_RESTORATION = 'leather-cleaning-restoration', // Чистка та відновлення шкіряних виробів
  SHEEPSKIN_COATS = 'sheepskin-coats', // Дублянки
  NATURAL_FUR_PRODUCTS = 'natural-fur-products', // Вироби із натурального хутра
  TEXTILE_DYEING = 'textile-dyeing', // Фарбування текстильних виробів
}

/**
 * Інформація про категорію послуги
 */
export interface ServiceCategoryInfo {
  id: ServiceCategory;
  name: string;
  description?: string;
  defaultUnit: MeasurementUnit;
}

/**
 * Одиниці виміру згідно з документацією
 */
export enum MeasurementUnit {
  PIECES = 'pieces', // Штуки (для більшості виробів)
  KILOGRAMS = 'kilograms', // Кілограми (для білизни та певних текстильних виробів)
}

/**
 * Інформація про одиницю виміру
 */
export interface MeasurementUnitInfo {
  unit: MeasurementUnit;
  name: string;
  abbreviation: string;
}
