import { z } from 'zod';

import {
  addOrderItemBody,
  addOrderItem201Response,
  updateOrderItemBody,
  getOrderItem200Response,
  safeValidate,
  validateOrThrow,
} from '@/shared/api/generated/order/zod';
import {
  getAllCategories200Response,
  getItemsByCategoryParams,
  getItemsByCategoryCode200Response,
  getAvailableUnitsForCategoryParams,
  getAvailableUnitsForCategory200Response,
} from '@/shared/api/generated/pricing/zod';

import { BaseWizardService } from '../../base.service';

/**
 * Сервіс для базової інформації про предмети з orval + zod інтеграцією
 *
 * Відповідальність (ТІЛЬКИ бізнес-логіка):
 * - Валідація створення та оновлення предметів через orval Zod схеми
 * - Композиція та валідація базової інформації предметів
 * - Бізнес-правила для категорій, найменувань та одиниць виміру
 * - Робота з енумами та валідація полів
 *
 * НЕ робить:
 * - API виклики (роль хуків + Orval)
 * - Збереження стану (роль Zustand)
 * - Кешування (роль TanStack Query)
 */

// Використовуємо orval схеми напряму
export type OrderItemRequest = z.infer<typeof addOrderItemBody>;
export type OrderItemResponse = z.infer<typeof addOrderItem201Response>;
export type OrderItemUpdateRequest = z.infer<typeof updateOrderItemBody>;
export type OrderItemData = z.infer<typeof getOrderItem200Response>;

// Локальні композитні схеми для базової інформації
const basicItemInfoSchema = z.object({
  name: z.string().min(1, "Найменування предмета обов'язкове").max(255),
  category: z.string().min(1, "Категорія обов'язкова"),
  quantity: z.number().min(0.01, 'Кількість повинна бути більше 0'),
  unitOfMeasure: z.enum(['piece', 'kg', 'meter', 'liter']),
  unitPrice: z.number().min(0, "Ціна не може бути від'ємною"),
});

const categorySelectionSchema = z.object({
  categoryCode: z.string().min(1, "Код категорії обов'язковий"),
  categoryName: z.string().min(1, "Назва категорії обов'язкова"),
});

const itemNameSelectionSchema = z.object({
  itemName: z.string().min(1, "Найменування предмета обов'язкове"),
  basePrice: z.number().min(0, "Базова ціна не може бути від'ємною"),
  description: z.string().optional(),
});

// Енуми тільки для основної інформації
const unitTypeEnum = z.enum(['piece', 'kg', 'meter', 'liter']);

// Експортуємо типи
export type BasicItemInfo = z.infer<typeof basicItemInfoSchema>;
export type CategorySelection = z.infer<typeof categorySelectionSchema>;
export type ItemNameSelection = z.infer<typeof itemNameSelectionSchema>;
export type UnitType = z.infer<typeof unitTypeEnum>;

export interface ItemValidationResult {
  isValid: boolean;
  errors: string[];
  validatedData?: OrderItemRequest;
}

export class BasicInfoService extends BaseWizardService {
  protected readonly serviceName = 'BasicInfoService';

  /**
   * Валідація базової інформації про предмет через orval схему
   */
  validateBasicItemInfo(data: unknown): {
    isValid: boolean;
    errors: string[];
    validatedData?: BasicItemInfo;
  } {
    const validation = safeValidate(basicItemInfoSchema, data);
    if (!validation.success) {
      return {
        isValid: false,
        errors: validation.errors,
      };
    }

    return {
      isValid: true,
      errors: [],
      validatedData: validation.data,
    };
  }

  /**
   * Створення об'єкта предмета для API
   */
  createOrderItem(basicInfo: BasicItemInfo): ItemValidationResult {
    // Валідація вхідних даних
    const validation = this.validateBasicItemInfo(basicInfo);
    if (!validation.isValid || !validation.validatedData) {
      return {
        isValid: false,
        errors: validation.errors,
      };
    }

    const validatedData = validation.validatedData;

    // Створення об'єкта відповідно до orval схеми
    const orderItem: OrderItemRequest = {
      name: validatedData.name,
      category: validatedData.category,
      quantity: validatedData.quantity,
      unitOfMeasure: validatedData.unitOfMeasure,
      unitPrice: validatedData.unitPrice,
      totalPrice: validatedData.quantity * validatedData.unitPrice,
    };

    // Валідація через orval схему
    const apiValidation = safeValidate(addOrderItemBody, orderItem);
    if (!apiValidation.success) {
      return {
        isValid: false,
        errors: apiValidation.errors,
      };
    }

    return {
      isValid: true,
      errors: [],
      validatedData: apiValidation.data,
    };
  }

  /**
   * Валідація вибору категорії
   */
  validateCategorySelection(data: unknown): {
    isValid: boolean;
    errors: string[];
    validatedData?: CategorySelection;
  } {
    const validation = safeValidate(categorySelectionSchema, data);
    if (!validation.success) {
      return {
        isValid: false,
        errors: validation.errors,
      };
    }

    return {
      isValid: true,
      errors: [],
      validatedData: validation.data,
    };
  }

  /**
   * Валідація вибору найменування предмета
   */
  validateItemNameSelection(data: unknown): {
    isValid: boolean;
    errors: string[];
    validatedData?: ItemNameSelection;
  } {
    const validation = safeValidate(itemNameSelectionSchema, data);
    if (!validation.success) {
      return {
        isValid: false,
        errors: validation.errors,
      };
    }

    return {
      isValid: true,
      errors: [],
      validatedData: validation.data,
    };
  }

  /**
   * Валідація параметрів для отримання предметів за категорією
   */
  validateCategoryParams(categoryId: string): {
    isValid: boolean;
    errors: string[];
    validatedParams?: z.infer<typeof getItemsByCategoryParams>;
  } {
    const validation = safeValidate(getItemsByCategoryParams, { categoryId });
    if (!validation.success) {
      return {
        isValid: false,
        errors: validation.errors,
      };
    }

    return {
      isValid: true,
      errors: [],
      validatedParams: validation.data,
    };
  }

  /**
   * Валідація параметрів для отримання одиниць виміру
   */
  validateUnitsParams(categoryId: string): {
    isValid: boolean;
    errors: string[];
    validatedParams?: z.infer<typeof getAvailableUnitsForCategoryParams>;
  } {
    const validation = safeValidate(getAvailableUnitsForCategoryParams, { categoryId });
    if (!validation.success) {
      return {
        isValid: false,
        errors: validation.errors,
      };
    }

    return {
      isValid: true,
      errors: [],
      validatedParams: validation.data,
    };
  }

  /**
   * Отримання доступних одиниць виміру
   */
  getAvailableUnits(): UnitType[] {
    return unitTypeEnum.options;
  }

  /**
   * Валідація одиниці виміру
   */
  validateUnitType(unit: string): boolean {
    return unitTypeEnum.safeParse(unit).success;
  }

  /**
   * Розрахунок загальної ціни предмета
   */
  calculateTotalPrice(quantity: number, unitPrice: number): number {
    if (quantity <= 0 || unitPrice < 0) {
      return 0;
    }
    return Math.round(quantity * unitPrice * 100) / 100; // Округлення до копійок
  }

  /**
   * Створення мінімального предмета з валідацією
   */
  createMinimalItem(
    name: string,
    category: string,
    quantity: number,
    unitPrice: number,
    unitOfMeasure: UnitType = 'piece'
  ): ItemValidationResult {
    const basicInfo: BasicItemInfo = {
      name,
      category,
      quantity,
      unitOfMeasure,
      unitPrice,
    };

    return this.createOrderItem(basicInfo);
  }

  /**
   * Валідація та оновлення існуючого предмета
   */
  updateOrderItem(
    itemData: Partial<OrderItemRequest>,
    currentItem: OrderItemData
  ): ItemValidationResult {
    // Об'єднуємо існуючі дані з новими
    const updatedItem: OrderItemRequest = {
      name: itemData.name || currentItem.name,
      category: itemData.category || currentItem.category || '',
      quantity: itemData.quantity || currentItem.quantity,
      unitOfMeasure: itemData.unitOfMeasure || currentItem.unitOfMeasure || 'piece',
      unitPrice: itemData.unitPrice || currentItem.unitPrice,
      totalPrice: this.calculateTotalPrice(
        itemData.quantity || currentItem.quantity,
        itemData.unitPrice || currentItem.unitPrice
      ),
      description: itemData.description || currentItem.description,
      color: itemData.color || currentItem.color,
      material: itemData.material || currentItem.material,
      defects: itemData.defects || currentItem.defects,
      specialInstructions: itemData.specialInstructions || currentItem.specialInstructions,
      fillerType: itemData.fillerType || currentItem.fillerType,
      fillerCompressed: itemData.fillerCompressed || currentItem.fillerCompressed,
      wearDegree: itemData.wearDegree || currentItem.wearDegree,
      stains: itemData.stains || currentItem.stains,
      otherStains: itemData.otherStains || currentItem.otherStains,
      defectsAndRisks: itemData.defectsAndRisks || currentItem.defectsAndRisks,
      noGuaranteeReason: itemData.noGuaranteeReason || currentItem.noGuaranteeReason,
      defectsNotes: itemData.defectsNotes || currentItem.defectsNotes,
    };

    // Валідація через orval схему
    const apiValidation = safeValidate(updateOrderItemBody, updatedItem);
    if (!apiValidation.success) {
      return {
        isValid: false,
        errors: apiValidation.errors,
      };
    }

    return {
      isValid: true,
      errors: [],
      validatedData: apiValidation.data,
    };
  }

  /**
   * Перевірка готовності предмета для додавання до замовлення
   */
  isItemReadyForOrder(itemData: OrderItemRequest): {
    isReady: boolean;
    missingFields: string[];
  } {
    const missingFields: string[] = [];

    if (!itemData.name?.trim()) {
      missingFields.push('Найменування предмета');
    }

    if (!itemData.category?.trim()) {
      missingFields.push('Категорія');
    }

    if (!itemData.quantity || itemData.quantity <= 0) {
      missingFields.push('Кількість');
    }

    if (!itemData.unitPrice || itemData.unitPrice < 0) {
      missingFields.push('Ціна за одиницю');
    }

    if (!itemData.unitOfMeasure) {
      missingFields.push('Одиниця виміру');
    }

    return {
      isReady: missingFields.length === 0,
      missingFields,
    };
  }
}
