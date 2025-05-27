/**
 * @fileoverview Інтерфейс для валідації основної інформації
 * @module domain/wizard/services/stage-3-item-management/basic-info/interfaces/basic-info-validator
 */

import type {
  BasicInfoSchemaType,
  BasicInfoPartialSchemaType,
} from '../schemas/basic-info.schemas';
import type { BasicInfoValidationResult } from '../types';

/**
 * Інтерфейс для валідації основної інформації
 */
export interface IBasicInfoValidatorService {
  /**
   * Валідація повної основної інформації
   */
  validateBasicInfo(data: BasicInfoSchemaType): BasicInfoValidationResult;

  /**
   * Валідація часткової основної інформації
   */
  validatePartialBasicInfo(data: BasicInfoPartialSchemaType): BasicInfoValidationResult;

  /**
   * Валідація конкретного поля
   */
  validateField(fieldName: string, value: unknown): BasicInfoValidationResult;

  /**
   * Перевірка чи можна перейти до наступного кроку
   */
  canProceedToNext(data: BasicInfoPartialSchemaType): boolean;
}
