/**
 * Сервіс для роботи з предметами замовлення
 * Реалізує DDD Domain Service для управління бізнес-логікою предметів
 */

import type {
  OrderItem,
  OrderItemSearchParams,
  OrderItemStats,
  OrderItemPriceCalculation,
  OrderItemCharacteristics,
  MaterialType,
  DefectType,
  StainType,
} from '../types';

/**
 * Результат операції з предметом замовлення
 */
export interface OrderItemOperationResult {
  success: boolean;
  item?: OrderItem;
  items?: OrderItem[];
  calculation?: OrderItemPriceCalculation;
  error?: string;
}

/**
 * Дані для створення предмета
 */
export interface CreateOrderItemData {
  name: string;
  category: string;
  quantity: number;
  unitPrice: number;
  unitOfMeasure: string;
  description?: string;
  color?: string;
  material?: MaterialType;
  characteristics?: OrderItemCharacteristics;
}

/**
 * Order Item Domain Service
 */
export class OrderItemService {
  /**
   * Отримання списку предметів замовлення
   */
  static async getOrderItems(orderId: string): Promise<OrderItemOperationResult> {
    try {
      // TODO: Інтеграція з реальним API
      console.log('OrderItemService.getOrderItems:', { orderId });

      // Симуляція API виклику
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Симуляція даних
      const mockItems: OrderItem[] = [];

      return {
        success: true,
        items: mockItems,
      };
    } catch (error) {
      console.error('Error getting order items:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Невідома помилка отримання предметів',
      };
    }
  }

  /**
   * Отримання предмета за ID
   */
  static async getOrderItem(orderId: string, itemId: string): Promise<OrderItemOperationResult> {
    try {
      // TODO: Інтеграція з реальним API
      console.log('OrderItemService.getOrderItem:', { orderId, itemId });

      // Симуляція API виклику
      await new Promise((resolve) => setTimeout(resolve, 300));

      return {
        success: false,
        error: 'Предмет не знайдено',
      };
    } catch (error) {
      console.error('Error getting order item:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Невідома помилка отримання предмета',
      };
    }
  }

  /**
   * Додавання нового предмета до замовлення
   */
  static async addOrderItem(
    orderId: string,
    itemData: Partial<OrderItem>
  ): Promise<OrderItemOperationResult> {
    try {
      // TODO: Інтеграція з реальним API
      console.log('OrderItemService.addOrderItem:', { orderId, itemData });

      // Валідація обов'язкових полів
      const validationResult = this.validateItemData(itemData, true);
      if (!validationResult.success) {
        return validationResult;
      }

      // Симуляція API виклику
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Створення предмета з ID
      const newItem: OrderItem = {
        id: crypto.randomUUID(),
        orderId,
        name: itemData.name!,
        category: itemData.category,
        quantity: itemData.quantity || 1,
        unitPrice: itemData.unitPrice || 0,
        totalPrice: (itemData.quantity || 1) * (itemData.unitPrice || 0),
        unitOfMeasure: itemData.unitOfMeasure || 'шт',
        description: itemData.description,
        color: itemData.color,
        material: itemData.material,
        defects: itemData.defects,
        specialInstructions: itemData.specialInstructions,
        isComplete: true,
      };

      return {
        success: true,
        item: newItem,
      };
    } catch (error) {
      console.error('Error adding order item:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Невідома помилка додавання предмета',
      };
    }
  }

  /**
   * Оновлення існуючого предмета
   */
  static async updateOrderItem(
    orderId: string,
    itemId: string,
    itemData: Partial<OrderItem>
  ): Promise<OrderItemOperationResult> {
    try {
      // TODO: Інтеграція з реальним API
      console.log('OrderItemService.updateOrderItem:', { orderId, itemId, itemData });

      // Валідація даних
      const validationResult = this.validateItemData(itemData, false);
      if (!validationResult.success) {
        return validationResult;
      }

      // Симуляція API виклику
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Симуляція оновлення
      const updatedItem: OrderItem = {
        id: itemId,
        orderId,
        name: itemData.name || 'Оновлений предмет',
        ...itemData,
      } as OrderItem;

      return {
        success: true,
        item: updatedItem,
      };
    } catch (error) {
      console.error('Error updating order item:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Невідома помилка оновлення предмета',
      };
    }
  }

  /**
   * Видалення предмета
   */
  static async deleteOrderItem(orderId: string, itemId: string): Promise<OrderItemOperationResult> {
    try {
      // TODO: Інтеграція з реальним API
      console.log('OrderItemService.deleteOrderItem:', { orderId, itemId });

      // Симуляція API виклику
      await new Promise((resolve) => setTimeout(resolve, 500));

      return {
        success: true,
      };
    } catch (error) {
      console.error('Error deleting order item:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Невідома помилка видалення предмета',
      };
    }
  }

  /**
   * Розрахунок ціни предмета
   */
  static async calculateItemPrice(itemData: Partial<OrderItem>): Promise<OrderItemOperationResult> {
    try {
      // TODO: Інтеграція з pricing домену
      console.log('OrderItemService.calculateItemPrice:', { itemData });

      const basePrice = itemData.unitPrice || 0;
      const quantity = itemData.quantity || 1;

      // Симуляція розрахунку
      const calculation: OrderItemPriceCalculation = {
        basePrice,
        modifiers: [],
        subtotal: basePrice * quantity,
        discountAmount: 0,
        finalPrice: basePrice * quantity,
        breakdown: [
          {
            name: 'Базова ціна',
            type: 'BASE',
            amount: basePrice,
            description: `${basePrice} грн × ${quantity} ${itemData.unitOfMeasure || 'шт'}`,
          },
        ],
      };

      return {
        success: true,
        calculation,
      };
    } catch (error) {
      console.error('Error calculating item price:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Невідома помилка розрахунку ціни',
      };
    }
  }

  /**
   * Розрахунок статистики предметів
   */
  static calculateStats(items: OrderItem[]): OrderItemStats {
    const stats: OrderItemStats = {
      totalItems: items.length,
      totalValue: 0,
      averagePrice: 0,
      byCategory: {},
      byMaterial: {},
      withDefects: 0,
      withStains: 0,
      withPhotos: 0,
    };

    items.forEach((item) => {
      // Загальна вартість
      stats.totalValue += item.totalPrice || 0;

      // За категоріями
      if (item.category) {
        stats.byCategory[item.category] = (stats.byCategory[item.category] || 0) + 1;
      }

      // За матеріалами
      if (item.material) {
        stats.byMaterial[item.material] = (stats.byMaterial[item.material] || 0) + 1;
      }

      // З дефектами
      if (item.defects && item.defects.length > 0) {
        stats.withDefects++;
      }

      // З плямами
      if (item.stains && item.stains.length > 0) {
        stats.withStains++;
      }

      // З фото
      if (item.hasPhotos) {
        stats.withPhotos++;
      }
    });

    // Середня ціна
    stats.averagePrice = stats.totalItems > 0 ? stats.totalValue / stats.totalItems : 0;

    return stats;
  }

  /**
   * Фільтрація предметів
   */
  static filterItems(items: OrderItem[], searchParams: OrderItemSearchParams): OrderItem[] {
    return items.filter((item) => {
      // Пошук за ключовим словом
      if (searchParams.keyword) {
        const keyword = searchParams.keyword.toLowerCase();
        const searchableText = [
          item.name,
          item.description,
          item.category,
          item.color,
          item.material,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        if (!searchableText.includes(keyword)) {
          return false;
        }
      }

      // Фільтр за категорією
      if (searchParams.category && item.category !== searchParams.category) {
        return false;
      }

      // Фільтр за матеріалом
      if (searchParams.material && item.material !== searchParams.material) {
        return false;
      }

      // Фільтр за наявністю дефектів
      if (searchParams.hasDefects !== undefined) {
        const hasDefects = Boolean(item.defects && item.defects.length > 0);
        if (hasDefects !== searchParams.hasDefects) {
          return false;
        }
      }

      // Фільтр за наявністю плям
      if (searchParams.hasStains !== undefined) {
        const hasStains = Boolean(item.stains && item.stains.length > 0);
        if (hasStains !== searchParams.hasStains) {
          return false;
        }
      }

      // Фільтр за діапазоном цін
      if (searchParams.priceRange) {
        const [minPrice, maxPrice] = searchParams.priceRange;
        const itemPrice = item.totalPrice || 0;
        if (itemPrice < minPrice || itemPrice > maxPrice) {
          return false;
        }
      }

      return true;
    });
  }

  /**
   * Валідація даних предмета
   */
  private static validateItemData(
    itemData: Partial<OrderItem>,
    isCreate: boolean
  ): OrderItemOperationResult {
    const errors: string[] = [];

    // Валідація обов'язкових полів для створення
    if (isCreate) {
      if (!itemData.name || itemData.name.trim().length === 0) {
        errors.push("Назва предмета обов'язкова");
      }

      if (!itemData.quantity || itemData.quantity <= 0) {
        errors.push('Кількість повинна бути більше 0');
      }

      if (itemData.unitPrice === undefined || itemData.unitPrice < 0) {
        errors.push("Ціна не може бути від'ємною");
      }
    }

    // Валідація формату даних
    if (itemData.name && itemData.name.length > 200) {
      errors.push('Назва предмета занадто довга (максимум 200 символів)');
    }

    if (itemData.description && itemData.description.length > 1000) {
      errors.push('Опис занадто довгий (максимум 1000 символів)');
    }

    if (itemData.quantity && (itemData.quantity <= 0 || itemData.quantity > 999)) {
      errors.push('Кількість повинна бути від 1 до 999');
    }

    // Повернення результату валідації
    if (errors.length > 0) {
      return {
        success: false,
        error: errors.join('; '),
      };
    }

    return {
      success: true,
    };
  }

  /**
   * Форматування даних предмета для відображення
   */
  static formatItemForDisplay(item: OrderItem): Record<string, string> {
    return {
      name: item.name,
      category: item.category || 'Не вказано',
      quantity: `${item.quantity} ${item.unitOfMeasure || 'шт'}`,
      unitPrice: `${item.unitPrice?.toFixed(2) || '0.00'} грн`,
      totalPrice: `${item.totalPrice?.toFixed(2) || '0.00'} грн`,
      material: item.material || 'Не вказано',
      color: item.color || 'Не вказано',
      hasDefects: item.defects ? 'Так' : 'Ні',
      hasStains: item.stains ? 'Так' : 'Ні',
      isComplete: item.isComplete ? 'Завершено' : 'В процесі',
    };
  }

  /**
   * Генерація унікального номеру предмета
   */
  static generateItemNumber(orderId: string, itemIndex: number): string {
    const orderPart = orderId.slice(-4).toUpperCase();
    const itemPart = String(itemIndex + 1).padStart(3, '0');
    return `${orderPart}-${itemPart}`;
  }
}
