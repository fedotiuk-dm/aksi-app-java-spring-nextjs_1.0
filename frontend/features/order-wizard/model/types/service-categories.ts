/**
 * Типи для категорій послуг
 */

/**
 * Категорії послуг
 */
export enum ServiceCategory {
  TEXTILE_CLEANING = 'TEXTILE_CLEANING',
  LAUNDRY = 'LAUNDRY',
  IRONING = 'IRONING',
  LEATHER_CLEANING = 'LEATHER_CLEANING',
  SHEEPSKIN = 'SHEEPSKIN',
  FUR = 'FUR',
  TEXTILE_DYEING = 'TEXTILE_DYEING',
}

/**
 * Назви категорій послуг для відображення
 */
export const SERVICE_CATEGORY_LABELS: Record<ServiceCategory, string> = {
  [ServiceCategory.TEXTILE_CLEANING]: 'Чистка одягу та текстилю',
  [ServiceCategory.LAUNDRY]: 'Прання білизни',
  [ServiceCategory.IRONING]: 'Прасування',
  [ServiceCategory.LEATHER_CLEANING]: 'Чистка та відновлення шкіряних виробів',
  [ServiceCategory.SHEEPSKIN]: 'Дублянки',
  [ServiceCategory.FUR]: 'Вироби із натурального хутра',
  [ServiceCategory.TEXTILE_DYEING]: 'Фарбування текстильних виробів',
};

/**
 * Одиниці виміру
 */
export enum MeasurementUnit {
  PIECES = 'PIECES',
  KILOGRAMS = 'KILOGRAMS',
}

/**
 * Назви одиниць виміру для відображення
 */
export const MEASUREMENT_UNIT_LABELS: Record<MeasurementUnit, string> = {
  [MeasurementUnit.PIECES]: 'Штуки',
  [MeasurementUnit.KILOGRAMS]: 'Кілограми',
};

/**
 * Категорії, для яких одиницею виміру є кілограми
 */
export const KILOGRAM_CATEGORIES = [
  ServiceCategory.LAUNDRY,
];

/**
 * Інтерфейс для найменування виробу
 */
export interface ItemName {
  id: string;
  name: string;
  categoryId: ServiceCategory;
  unitPrice: number;
  measurementUnit: MeasurementUnit;
}
