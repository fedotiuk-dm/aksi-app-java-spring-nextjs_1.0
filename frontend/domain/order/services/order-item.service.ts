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
        name: itemData.name || 'Предмет без назви',
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
      byCategory: {} as Record<string, number>,
      byMaterial: {} as Record<string, number>,
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
        (stats.byMaterial as Record<string, number>)[item.material] =
          ((stats.byMaterial as Record<string, number>)[item.material] || 0) + 1;
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
      return (
        this.matchesKeyword(item, searchParams.keyword) &&
        this.matchesCategory(item, searchParams.category) &&
        this.matchesMaterial(item, searchParams.material) &&
        this.matchesDefects(item, searchParams.hasDefects) &&
        this.matchesStains(item, searchParams.hasStains) &&
        this.matchesPriceRange(item, searchParams.priceRange)
      );
    });
  }

  /**
   * Перевірка відповідності ключовому слову
   */
  private static matchesKeyword(item: OrderItem, keyword?: string): boolean {
    if (!keyword) return true;

    const searchableText = [item.name, item.description, item.category, item.color, item.material]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return searchableText.includes(keyword.toLowerCase());
  }

  /**
   * Перевірка відповідності категорії
   */
  private static matchesCategory(item: OrderItem, category?: string): boolean {
    return !category || item.category === category;
  }

  /**
   * Перевірка відповідності матеріалу
   */
  private static matchesMaterial(item: OrderItem, material?: string): boolean {
    return !material || item.material === material;
  }

  /**
   * Перевірка відповідності наявності дефектів
   */
  private static matchesDefects(item: OrderItem, hasDefects?: boolean): boolean {
    if (hasDefects === undefined) return true;

    const itemHasDefects = Boolean(item.defects && item.defects.length > 0);
    return itemHasDefects === hasDefects;
  }

  /**
   * Перевірка відповідності наявності плям
   */
  private static matchesStains(item: OrderItem, hasStains?: boolean): boolean {
    if (hasStains === undefined) return true;

    const itemHasStains = Boolean(item.stains && item.stains.length > 0);
    return itemHasStains === hasStains;
  }

  /**
   * Перевірка відповідності діапазону цін
   */
  private static matchesPriceRange(item: OrderItem, priceRange?: [number, number]): boolean {
    if (!priceRange) return true;

    const [minPrice, maxPrice] = priceRange;
    const itemPrice = item.totalPrice || 0;
    return itemPrice >= minPrice && itemPrice <= maxPrice;
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
    const NOT_SPECIFIED = 'Не вказано';

    return {
      name: item.name,
      category: item.category || NOT_SPECIFIED,
      quantity: `${item.quantity} ${item.unitOfMeasure || 'шт'}`,
      unitPrice: `${item.unitPrice?.toFixed(2) || '0.00'} грн`,
      totalPrice: `${item.totalPrice?.toFixed(2) || '0.00'} грн`,
      material: item.material || NOT_SPECIFIED,
      color: item.color || NOT_SPECIFIED,
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
