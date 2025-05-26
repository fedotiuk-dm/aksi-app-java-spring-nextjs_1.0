/**
 * @fileoverview Сервіс валідації основної інформації про предмет
 * @module domain/wizard/services/stage-3-item-management/basic-info/services
 */

import type { IBasicInfoValidator } from '../interfaces/basic-info.interfaces';
import type { BasicInfoValidationResult, CreateBasicItemData } from '../types/basic-info.types';
import type { OrderItem } from '@/domain/wizard/types';

/**
 * Сервіс валідації основної інформації
 */
export class BasicInfoValidatorService implements IBasicInfoValidator {
  // === Валідація основної інформації ===

  /**
   * Валідація основної інформації про предмет
   */
  validateBasicInfo(itemData: Partial<OrderItem>): BasicInfoValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const fieldErrors: Record<string, string[]> = {};

    // Валідація категорії
    const categoryValidation = this.validateCategorySelection(itemData.category || '');
    if (!categoryValidation.isValid) {
      errors.push(...categoryValidation.errors);
      fieldErrors.category = categoryValidation.errors;
    }

    // Валідація назви
    if (!itemData.name || itemData.name.trim().length === 0) {
      const error = "Найменування предмета є обов'язковим";
      errors.push(error);
      fieldErrors.name = [error];
    } else if (itemData.name.trim().length < 2) {
      const warning = 'Назва предмета занадто коротка';
      warnings.push(warning);
      fieldErrors.name = fieldErrors.name || [];
      fieldErrors.name.push(warning);
    }

    // Валідація кількості
    const quantityValidation = this.validateQuantity(
      itemData.quantity || 0,
      itemData.unitOfMeasure || ''
    );
    if (!quantityValidation.isValid) {
      errors.push(...quantityValidation.errors);
      fieldErrors.quantity = quantityValidation.errors;
    }

    // Валідація одиниці виміру
    if (!itemData.unitOfMeasure) {
      const error = "Одиниця виміру є обов'язковою";
      errors.push(error);
      fieldErrors.unitOfMeasure = [error];
    } else if (!['pieces', 'kg'].includes(itemData.unitOfMeasure)) {
      const error = 'Невірна одиниця виміру. Дозволені: pieces, kg';
      errors.push(error);
      fieldErrors.unitOfMeasure = [error];
    }

    // Валідація базової ціни
    if (itemData.basePrice !== undefined) {
      if (itemData.basePrice < 0) {
        const error = "Базова ціна не може бути від'ємною";
        errors.push(error);
        fieldErrors.basePrice = [error];
      } else if (itemData.basePrice === 0) {
        const warning = 'Базова ціна дорівнює нулю';
        warnings.push(warning);
        fieldErrors.basePrice = fieldErrors.basePrice || [];
        fieldErrors.basePrice.push(warning);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      fieldErrors,
    };
  }

  /**
   * Валідація вибору категорії
   */
  validateCategorySelection(categoryId: string): BasicInfoValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const fieldErrors: Record<string, string[]> = {};

    if (!categoryId || categoryId.trim().length === 0) {
      const error = "Категорія послуги є обов'язковою";
      errors.push(error);
      fieldErrors.categoryId = [error];
    } else if (categoryId.length < 3) {
      const warning = 'ID категорії здається занадто коротким';
      warnings.push(warning);
      fieldErrors.categoryId = [warning];
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      fieldErrors,
    };
  }

  /**
   * Валідація вибору елемента прайс-листа
   */
  validatePriceListSelection(priceListItemId: string): BasicInfoValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const fieldErrors: Record<string, string[]> = {};

    if (!priceListItemId || priceListItemId.trim().length === 0) {
      const error = "Елемент прайс-листа є обов'язковим";
      errors.push(error);
      fieldErrors.priceListItemId = [error];
    } else if (priceListItemId.length < 3) {
      const warning = 'ID елемента прайс-листа здається занадто коротким';
      warnings.push(warning);
      fieldErrors.priceListItemId = [warning];
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      fieldErrors,
    };
  }

  /**
   * Валідація кількості
   */
  validateQuantity(quantity: number, unitOfMeasure: string): BasicInfoValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const fieldErrors: Record<string, string[]> = {};

    // Перевірка на існування та тип
    if (quantity === undefined || quantity === null || isNaN(quantity)) {
      const error = "Кількість є обов'язковою та повинна бути числом";
      errors.push(error);
      fieldErrors.quantity = [error];
      return { isValid: false, errors, warnings, fieldErrors };
    }

    // Перевірка на позитивне значення
    if (quantity <= 0) {
      const error = 'Кількість повинна бути більше 0';
      errors.push(error);
      fieldErrors.quantity = [error];
    }

    // Перевірка максимальних значень
    if (unitOfMeasure === 'pieces' && quantity > 1000) {
      const warning = 'Велика кількість предметів (більше 1000 штук)';
      warnings.push(warning);
      fieldErrors.quantity = [warning];
    } else if (unitOfMeasure === 'kg' && quantity > 100) {
      const warning = 'Велика вага (більше 100 кг)';
      warnings.push(warning);
      fieldErrors.quantity = [warning];
    }

    // Перевірка дробових значень для штук
    if (unitOfMeasure === 'pieces' && quantity % 1 !== 0) {
      const error = 'Кількість штук повинна бути цілим числом';
      errors.push(error);
      fieldErrors.quantity = fieldErrors.quantity || [];
      fieldErrors.quantity.push(error);
    }

    // Перевірка точності для кілограмів
    if (unitOfMeasure === 'kg' && quantity.toString().split('.')[1]?.length > 3) {
      const warning = 'Занадто висока точність ваги (більше 3 знаків після коми)';
      warnings.push(warning);
      fieldErrors.quantity = fieldErrors.quantity || [];
      fieldErrors.quantity.push(warning);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      fieldErrors,
    };
  }

  /**
   * Валідація даних для створення предмета
   */
  validateCreateData(data: CreateBasicItemData): BasicInfoValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const fieldErrors: Record<string, string[]> = {};

    // Валідація categoryId
    const categoryValidation = this.validateCategorySelection(data.categoryId);
    if (!categoryValidation.isValid) {
      errors.push(...categoryValidation.errors);
      fieldErrors.categoryId = categoryValidation.errors;
    }

    // Валідація priceListItemId
    const priceListValidation = this.validatePriceListSelection(data.priceListItemId);
    if (!priceListValidation.isValid) {
      errors.push(...priceListValidation.errors);
      fieldErrors.priceListItemId = priceListValidation.errors;
    }

    // Валідація quantity (без unitOfMeasure, оскільки він буде взятий з прайс-листа)
    if (data.quantity === undefined || data.quantity === null || isNaN(data.quantity)) {
      const error = "Кількість є обов'язковою та повинна бути числом";
      errors.push(error);
      fieldErrors.quantity = [error];
    } else if (data.quantity <= 0) {
      const error = 'Кількість повинна бути більше 0';
      errors.push(error);
      fieldErrors.quantity = [error];
    }

    // Валідація customName (якщо вказано)
    if (data.customName !== undefined) {
      if (data.customName.trim().length === 0) {
        const warning = 'Користувацька назва порожня';
        warnings.push(warning);
        fieldErrors.customName = [warning];
      } else if (data.customName.trim().length < 2) {
        const warning = 'Користувацька назва занадто коротка';
        warnings.push(warning);
        fieldErrors.customName = [warning];
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      fieldErrors,
    };
  }

  // === Утилітарні методи ===

  /**
   * Перевірка чи всі обов'язкові поля заповнені
   */
  hasRequiredFields(itemData: Partial<OrderItem>): boolean {
    return !!(itemData.category && itemData.name && itemData.quantity && itemData.unitOfMeasure);
  }

  /**
   * Отримання списку відсутніх обов'язкових полів
   */
  getMissingRequiredFields(itemData: Partial<OrderItem>): string[] {
    const missing: string[] = [];

    if (!itemData.category) missing.push('category');
    if (!itemData.name) missing.push('name');
    if (!itemData.quantity) missing.push('quantity');
    if (!itemData.unitOfMeasure) missing.push('unitOfMeasure');

    return missing;
  }

  /**
   * Швидка перевірка валідності без детальних повідомлень
   */
  isValid(itemData: Partial<OrderItem>): boolean {
    return this.validateBasicInfo(itemData).isValid;
  }
}

// Експорт екземпляра сервісу (Singleton)
export const basicInfoValidatorService = new BasicInfoValidatorService();
