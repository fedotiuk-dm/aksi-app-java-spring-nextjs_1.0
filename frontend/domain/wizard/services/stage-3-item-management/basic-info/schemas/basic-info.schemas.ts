/**
 * @fileoverview Zod схеми для валідації основної інформації предмета
 * @module domain/wizard/services/stage-3-item-management/basic-info/schemas/basic-info
 */

import { z } from 'zod';

import { ServiceCategory, MeasurementUnit } from '../types/service-categories.types';

/**
 * Схема для категорії послуги
 */
export const serviceCategorySchema = z.nativeEnum(ServiceCategory, {
  errorMap: () => ({ message: 'Оберіть категорію послуги' }),
});

/**
 * Схема для одиниці виміру
 */
export const measurementUnitSchema = z.nativeEnum(MeasurementUnit, {
  errorMap: () => ({ message: 'Оберіть одиницю виміру' }),
});

/**
 * Схема для найменування предмета
 */
export const itemNameSchema = z
  .string()
  .min(2, 'Найменування повинно містити мінімум 2 символи')
  .max(100, 'Найменування не може перевищувати 100 символів')
  .trim();

/**
 * Схема для кількості
 */
export const quantitySchema = z
  .number()
  .min(0.1, 'Кількість повинна бути більше 0')
  .max(1000, 'Кількість не може перевищувати 1000');

/**
 * Основна схема для валідації основної інформації
 */
export const basicInfoSchema = z.object({
  category: serviceCategorySchema,
  itemName: itemNameSchema,
  measurementUnit: measurementUnitSchema,
  quantity: quantitySchema,
});

/**
 * Схема для часткової валідації (під час введення)
 */
export const basicInfoPartialSchema = basicInfoSchema.partial();

/**
 * Типи, згенеровані з Zod схем
 */
export type BasicInfoSchemaType = z.infer<typeof basicInfoSchema>;
export type BasicInfoPartialSchemaType = z.infer<typeof basicInfoPartialSchema>;
