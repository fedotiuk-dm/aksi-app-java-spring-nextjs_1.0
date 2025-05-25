/**
 * Схеми для числових полів - відповідальність за валідацію кількісних даних
 */

import { z } from 'zod';

import { FIELD_LIMITS } from '../constants';
import { VALIDATION_MESSAGES } from '../constants';

/**
 * Схема для кількості предметів
 */
export const quantitySchema = z
  .number()
  .min(FIELD_LIMITS.QUANTITY.min, VALIDATION_MESSAGES.MIN_VALUE(FIELD_LIMITS.QUANTITY.min))
  .max(FIELD_LIMITS.QUANTITY.max, VALIDATION_MESSAGES.MAX_VALUE(FIELD_LIMITS.QUANTITY.max))
  .int('Кількість повинна бути цілим числом');

/**
 * Схема для ціни
 */
export const priceSchema = z
  .number()
  .min(FIELD_LIMITS.PRICE.min, VALIDATION_MESSAGES.MIN_VALUE(FIELD_LIMITS.PRICE.min))
  .max(FIELD_LIMITS.PRICE.max, VALIDATION_MESSAGES.MAX_VALUE(FIELD_LIMITS.PRICE.max));

/**
 * Схема для загальної суми
 */
export const totalSchema = z
  .number()
  .min(0, VALIDATION_MESSAGES.MIN_VALUE(0))
  .max(FIELD_LIMITS.PRICE.max * FIELD_LIMITS.QUANTITY.max, 'Сума занадто велика');

/**
 * Схема для знижки (відсоток)
 */
export const discountPercentSchema = z
  .number()
  .min(0, VALIDATION_MESSAGES.MIN_VALUE(0))
  .max(100, VALIDATION_MESSAGES.MAX_VALUE(100));

/**
 * Схема для знижки (сума)
 */
export const discountAmountSchema = z
  .number()
  .min(0, VALIDATION_MESSAGES.MIN_VALUE(0))
  .max(FIELD_LIMITS.PRICE.max, VALIDATION_MESSAGES.MAX_VALUE(FIELD_LIMITS.PRICE.max));
