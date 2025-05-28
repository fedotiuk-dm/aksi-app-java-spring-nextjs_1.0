import { z } from 'zod';

import {
  getOrderItemsParams,
  getOrderItems200Response,
  getOrderItems200ResponseItem,
  addOrderItemParams,
  addOrderItemBody,
  addOrderItem201Response,
  updateOrderItemParams,
  updateOrderItemBody,
  updateOrderItem200Response,
  deleteOrderItem204Response,
  safeValidate,
  validateOrThrow,
} from '@/shared/api/generated/order/zod';

import { BaseWizardService } from '../../base.service';

/**
 * Сервіс менеджера предметів з orval + zod інтеграцією
 *
 * Відповідальність (ТІЛЬКИ менеджмент предметів):
 * - CRUD операції з предметами замовлення
 * - Табличне відображення та форматування
 * - Підсумки та розрахунки для замовлення
 * - Валідація параметрів запитів
 *
 * НЕ дублює типи з інших сервісів:
 * - OrderItemResponse, ItemValidationResult - тільки в basic-info
 * - Характеристики предметів - тільки в characteristics
 * - WearLevel, материали, кольори - тільки в characteristics
 *
 * НЕ робить:
 * - API виклики (роль хуків + Orval)
 * - Збереження стану (роль Zustand)
 * - Кешування (роль TanStack Query)
 * - Навігацію (роль XState)
 */

// ТІЛЬКИ типи для менеджменту та таблиці предметів
export type OrderItemsListResponse = z.infer<typeof getOrderItems200Response>;
export type OrderItemsParams = z.infer<typeof getOrderItemsParams>;
export type AddOrderItemParams = z.infer<typeof addOrderItemParams>;
export type UpdateOrderItemParams = z.infer<typeof updateOrderItemParams>;

// Локальні схеми для UI таблиці та менеджменту
const itemTableRowSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  category: z.string(),
  quantity: z.string(),
  material: z.string(),
  color: z.string(),
  price: z.number(),
});

const orderSummarySchema = z.object({
  totalItems: z.number().min(0),
  totalPrice: z.number().min(0),
  averagePrice: z.number().min(0),
  canProceed: z.boolean(),
});

// Локальні типи для менеджменту
export type ItemTableRow = z.infer<typeof itemTableRowSchema>;
export type OrderSummary = z.infer<typeof orderSummarySchema>;

export interface ItemsListValidationResult {
  isValid: boolean;
  errors: string[];
  validatedData?: OrderItemsListResponse;
}

export class ItemManagerService extends BaseWizardService {
  protected readonly serviceName = 'ItemManagerService';

  /**
   * Валідація параметрів для отримання предметів замовлення
   */
  validateGetOrderItemsParams(orderId: string): {
    isValid: boolean;
    errors: string[];
    validatedParams?: OrderItemsParams;
  } {
    const params = { orderId };
    const validation = safeValidate(getOrderItemsParams, params);
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
   * Валідація відповіді зі списком предметів
   */
  validateOrderItemsResponse(data: unknown): ItemsListValidationResult {
    const validation = safeValidate(getOrderItems200Response, data);
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
   * Розрахунок підсумків замовлення
   */
  calculateOrderSummary(items: OrderItemsListResponse): OrderSummary {
    if (!Array.isArray(items) || items.length === 0) {
      return {
        totalItems: 0,
        totalPrice: 0,
        averagePrice: 0,
        canProceed: false,
      };
    }

    const totalItems = items.length;
    const totalPrice = items.reduce((sum, item) => {
      return sum + (item.totalPrice || 0);
    }, 0);
    const averagePrice = totalPrice / totalItems;

    return {
      totalItems,
      totalPrice: Number(totalPrice.toFixed(2)),
      averagePrice: Number(averagePrice.toFixed(2)),
      canProceed: totalItems > 0,
    };
  }

  /**
   * Перевірка чи можна переходити до наступного етапу
   */
  canProceedToNextStage(items: OrderItemsListResponse): boolean {
    if (!Array.isArray(items) || items.length === 0) {
      return false;
    }

    // Всі предмети повинні мати необхідні поля
    return items.every(
      (item) => item.name && item.category && item.quantity && item.unitPrice !== undefined
    );
  }

  /**
   * Форматування предметів для відображення в таблиці
   */
  formatItemsForTable(items: OrderItemsListResponse): ItemTableRow[] {
    if (!Array.isArray(items)) {
      return [];
    }

    return items.map((item) => {
      const quantity = item.unitOfMeasure === 'kg' ? `${item.quantity} кг` : `${item.quantity} шт`;

      return {
        id: item.id || '',
        name: item.name || 'Без назви',
        category: item.category || 'Без категорії',
        quantity,
        material: item.material || '-',
        color: item.color || '-',
        price: item.totalPrice || 0,
      };
    });
  }

  /**
   * Пошук предмета за ID
   */
  findItemById(items: OrderItemsListResponse, itemId: string): (typeof items)[0] | null {
    if (!Array.isArray(items)) {
      return null;
    }

    return items.find((item) => item.id === itemId) || null;
  }

  /**
   * Перевірка на дублікати предметів
   */
  isItemDuplicate(
    items: OrderItemsListResponse,
    newItem: { name: string; category: string }
  ): boolean {
    if (!Array.isArray(items)) {
      return false;
    }

    return items.some((item) => item.name === newItem.name && item.category === newItem.category);
  }

  /**
   * Перевірка чи всі предмети завершені
   */
  areAllItemsComplete(items: OrderItemsListResponse): {
    isComplete: boolean;
    incompleteItems: string[];
  } {
    if (!Array.isArray(items) || items.length === 0) {
      return {
        isComplete: false,
        incompleteItems: ['Жодного предмета не додано'],
      };
    }

    const incompleteItems: string[] = [];

    items.forEach((item, index) => {
      const missingFields: string[] = [];

      if (!item.name) missingFields.push('назва');
      if (!item.category) missingFields.push('категорія');
      if (!item.quantity) missingFields.push('кількість');
      if (item.unitPrice === undefined) missingFields.push('ціна');

      if (missingFields.length > 0) {
        incompleteItems.push(`Предмет ${index + 1}: відсутні ${missingFields.join(', ')}`);
      }
    });

    return {
      isComplete: incompleteItems.length === 0,
      incompleteItems,
    };
  }
}
