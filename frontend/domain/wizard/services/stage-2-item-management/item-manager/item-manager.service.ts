import {
  getOrderItems,
  addOrderItem,
  updateOrderItem,
  deleteOrderItem,
  calculateOrderItemPrice,
  type WizardOrderItem,
  type WizardOrderItemDetailed,
} from '@/domain/wizard/adapters/order';
import {
  itemListSchema,
  itemListItemSchema,
  itemSummarySchema,
  type ItemSummary,
} from '@/domain/wizard/schemas';

import { BaseWizardService } from '../../base.service';

/**
 * Інтерфейс для відображення предмета в таблиці
 */
interface ItemTableRow {
  id: string;
  name: string;
  category: string;
  quantity: string;
  material: string;
  color: string;
  price: number;
}

/**
 * Розширений мінімалістський менеджер предметів замовлення
 * Розмір: ~120 рядків (в межах ліміту)
 *
 * Відповідальність (ТІЛЬКИ):
 * - Композиція order-item адаптерів для CRUD операцій
 * - Валідація через ВСІ централізовані Zod схеми менеджера 2.0
 * - Мінімальні розрахунки підсумків та цін
 * - Форматування для UI таблиці
 *
 * НЕ дублює:
 * - API виклики (роль order-item адаптерів)
 * - Збереження стану (роль Zustand)
 * - Кешування (роль TanStack Query)
 * - Навігацію (роль XState)
 * - Схеми валідації (роль централізованих schemas)
 */

export class ItemManagerService extends BaseWizardService {
  protected readonly serviceName = 'ItemManagerService';

  /**
   * Композиція: отримання предметів через адаптер
   */
  async getOrderItems(orderId: string): Promise<WizardOrderItem[]> {
    const result = await getOrderItems(orderId);
    return result.success ? result.data || [] : [];
  }

  /**
   * Композиція: додавання предмета через адаптер
   */
  async addItem(
    orderId: string,
    itemData: Partial<WizardOrderItem>
  ): Promise<WizardOrderItem | null> {
    const result = await addOrderItem(orderId, itemData);
    return result.success ? result.data || null : null;
  }

  /**
   * Композиція: оновлення предмета через адаптер
   */
  async updateItem(
    orderId: string,
    itemId: string,
    itemData: Partial<WizardOrderItem>
  ): Promise<WizardOrderItem | null> {
    const result = await updateOrderItem(orderId, itemId, itemData);
    return result.success ? result.data || null : null;
  }

  /**
   * Композиція: видалення предмета через адаптер
   */
  async deleteItem(orderId: string, itemId: string): Promise<boolean> {
    const result = await deleteOrderItem(orderId, itemId);
    return result.success;
  }

  /**
   * Композиція: розрахунок ціни предмета через адаптер
   */
  async calculateItemPrice(itemData: Partial<WizardOrderItem>): Promise<number> {
    const result = await calculateOrderItemPrice(itemData);
    return result.success ? result.data || 0 : 0;
  }

  /**
   * Валідація окремого предмета в списку
   */
  validateItemListItem(item: unknown) {
    return itemListItemSchema.safeParse(item);
  }

  /**
   * Валідація списку предметів через централізовану схему
   */
  validateItemList(items: unknown) {
    return itemListSchema.safeParse({ items });
  }

  /**
   * Валідація підсумку через централізовану схему
   */
  validateSummary(summary: unknown) {
    return itemSummarySchema.safeParse(summary);
  }

  /**
   * Розрахунок підсумків замовлення - мінімальна логіка
   */
  calculateSummary(items: WizardOrderItem[]): ItemSummary {
    const totalItems = items.length;
    const totalPrice = items.reduce((sum, item) => sum + item.finalPrice, 0);
    const averagePrice = totalItems > 0 ? totalPrice / totalItems : 0;

    return {
      totalItems,
      totalPrice,
      averagePrice,
      canProceed: totalItems > 0,
    };
  }

  /**
   * Перевірка чи можна продовжити до наступного етапу
   */
  canProceedToNextStage(items: WizardOrderItem[]): boolean {
    return items.length > 0 && items.every((item) => item.finalPrice > 0);
  }

  /**
   * Форматування даних для таблиці (крок 2.0) з типізацією
   */
  formatItemsForTable(items: WizardOrderItem[]): ItemTableRow[] {
    return items.map((item) => ({
      id: item.id || '',
      name: item.itemName,
      category: item.categoryName,
      quantity: `${item.quantity} ${item.unit}`,
      material: item.material || '—',
      color: item.color || '—',
      price: item.finalPrice,
    }));
  }

  /**
   * Пошук предмета в списку за ID
   */
  findItemById(items: WizardOrderItem[], itemId: string): WizardOrderItem | null {
    return items.find((item) => item.id === itemId) || null;
  }

  /**
   * Перевірка унікальності предмета в замовленні (за назвою + характеристиками)
   */
  isItemDuplicate(items: WizardOrderItem[], newItem: WizardOrderItemDetailed): boolean {
    return items.some(
      (item) =>
        item.itemName === newItem.itemName &&
        item.material === newItem.material &&
        item.color === newItem.color
    );
  }

  /**
   * Створення підсумку з валідацією
   */
  createSummaryWithValidation(items: WizardOrderItem[]): ItemSummary {
    const summary = this.calculateSummary(items);

    const validation = this.validateSummary(summary);
    if (!validation.success) {
      throw new Error(`Валідація підсумку: ${validation.error.errors[0]?.message}`);
    }

    return validation.data;
  }
}
