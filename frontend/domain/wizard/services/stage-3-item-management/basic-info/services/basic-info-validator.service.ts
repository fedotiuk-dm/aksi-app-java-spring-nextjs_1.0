/**
 * @fileoverview Сервіс валідації основної інформації про предмет
 * @module domain/wizard/services/stage-3-item-management/basic-info/services/basic-info-validator
 */

import {
  IBasicInfoValidatorService,
  BasicInfoValidationResult,
  CreateBasicItemData,
  UpdateBasicInfoData
} from '../interfaces/basic-info.interfaces';

/**
 * Сервіс валідації основної інформації про предмет
 * @implements IBasicInfoValidatorService
 */
export class BasicInfoValidatorService implements IBasicInfoValidatorService {
  /**
   * Валідація даних для створення нового предмета
   * @param data Дані для створення
   */
  async validateCreateData(data: CreateBasicItemData): Promise<BasicInfoValidationResult> {
    const errors: string[] = [];
    const fieldErrors: Record<string, string[]> = {};

    // Валідація categoryId
    if (!data.categoryId) {
      errors.push('Категорія не вибрана');
      fieldErrors['categoryId'] = ['Поле обов\'язкове'];
    }

    // Валідація priceListItemId
    if (!data.priceListItemId) {
      errors.push('Послуга не вибрана');
      fieldErrors['priceListItemId'] = ['Поле обов\'язкове'];
    }

    // Валідація quantity
    if (data.quantity <= 0) {
      errors.push('Кількість має бути більше нуля');
      fieldErrors['quantity'] = ['Значення має бути більше нуля'];
    }

    // Валідація customName (якщо вказано)
    if (data.customName && data.customName.length > 100) {
      errors.push('Назва предмета занадто довга');
      fieldErrors['customName'] = ['Максимальна довжина 100 символів'];
    }

    const isValid = errors.length === 0;

    return {
      isValid,
      errors,
      warnings: [],
      fieldErrors
    };
  }

  /**
   * Валідація даних для оновлення предмета
   * @param data Дані для оновлення
   */
  async validateUpdateData(data: UpdateBasicInfoData): Promise<BasicInfoValidationResult> {
    const errors: string[] = [];
    const fieldErrors: Record<string, string[]> = {};
    const warnings: string[] = [];

    // Перевірка, чи є хоча б одне поле для оновлення
    if (!data.categoryId && !data.priceListItemId && !data.quantity && !data.customName) {
      errors.push('Немає даних для оновлення');
    }

    // Валідація quantity, якщо вказано
    if (data.quantity !== undefined) {
      if (data.quantity <= 0) {
        errors.push('Кількість має бути більше нуля');
        fieldErrors['quantity'] = ['Значення має бути більше нуля'];
      }
    }

    // Валідація customName, якщо вказано
    if (data.customName !== undefined && data.customName.length > 100) {
      errors.push('Назва предмета занадто довга');
      fieldErrors['customName'] = ['Максимальна довжина 100 символів'];
    }

    // Попередження при зміні категорії
    if (data.categoryId) {
      warnings.push('Зміна категорії може вплинути на цінові модифікатори');
    }

    const isValid = errors.length === 0;

    return {
      isValid,
      errors,
      warnings,
      fieldErrors
    };
  }

  /**
   * Перевірка сумісності характеристик
   * @param categoryId Ідентифікатор категорії
   * @param priceListItemId Ідентифікатор елемента прайс-листа
   */
  async validateCompatibility(
    categoryId: string,
    priceListItemId: string
  ): Promise<BasicInfoValidationResult> {
    // В реальному сервісі тут була б перевірка сумісності через API
    // Наразі повертаємо позитивну відповідь
    return {
      isValid: true,
      errors: [],
      warnings: [],
      fieldErrors: {}
    };
  }
}

// Єдиний екземпляр сервісу для використання в додатку
export const basicInfoValidatorService = new BasicInfoValidatorService();
