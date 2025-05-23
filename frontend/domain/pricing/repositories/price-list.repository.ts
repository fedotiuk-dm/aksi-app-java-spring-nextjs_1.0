/**
 * Реалізація репозиторію прайс-листа
 * In-memory реалізація з можливістю розширення для API інтеграції
 */

import { PricingUtils } from '../utils/pricing.utils';
import { PricingValidator } from '../utils/pricing.validator';

import type {
  PriceListItem,
  ServiceCategory,
  PriceSearchParams,
  PriceSearchResult,
} from '../types';
import type {
  IPriceListRepository,
  FindPriceListOptions,
  PaginatedPriceListResult,
} from './price-list.repository.interface';

/**
 * Константи для помилок
 */
const ERROR_MESSAGES = {
  ITEM_NOT_FOUND: 'Елемент прайс-листа не знайдено',
  ITEM_NUMBER_EXISTS: 'Елемент з таким номером вже існує',
  INVALID_ITEM_DATA: 'Невалідні дані елемента',
  INVALID_PARAMETERS: 'Невалідні параметри операції',
  REPOSITORY_ERROR: 'Помилка репозиторію',
} as const;

/**
 * In-memory реалізація репозиторію прайс-листа
 */
export class PriceListRepository implements IPriceListRepository {
  private items: Map<string, PriceListItem> = new Map();
  private lastSyncTime: Date = new Date();
  private cacheTimeout: number = 5 * 60 * 1000; // 5 хвилин

  constructor(initialData?: PriceListItem[]) {
    if (initialData) {
      initialData.forEach((item) => {
        this.items.set(item.id, item);
      });
    }
  }

  // === ОСНОВНІ CRUD ОПЕРАЦІЇ ===

  async findById(id: string): Promise<PriceListItem | null> {
    if (!id?.trim()) {
      throw new Error(ERROR_MESSAGES.INVALID_PARAMETERS);
    }

    return this.items.get(id) || null;
  }

  async findByItemNumber(itemNumber: string): Promise<PriceListItem | null> {
    if (!itemNumber?.trim()) {
      throw new Error(ERROR_MESSAGES.INVALID_PARAMETERS);
    }

    for (const item of this.items.values()) {
      if (item.itemNumber === itemNumber) {
        return item;
      }
    }
    return null;
  }

  async findAll(): Promise<PriceListItem[]> {
    return Array.from(this.items.values());
  }

  async findMany(options: FindPriceListOptions = {}): Promise<PriceListItem[]> {
    let items = Array.from(this.items.values());

    // Фільтрація
    if (options.category) {
      items = items.filter((item) => item.category === options.category);
    }

    if (options.isActive !== undefined) {
      items = items.filter((item) => item.isActive === options.isActive);
    }

    if (options.itemNumbers?.length) {
      items = items.filter((item) => options.itemNumbers!.includes(item.itemNumber));
    }

    // Сортування
    if (options.sortBy) {
      items.sort((a, b) => {
        const aValue = a[options.sortBy!];
        const bValue = b[options.sortBy!];
        const order = options.sortOrder === 'desc' ? -1 : 1;

        if (aValue < bValue) return -1 * order;
        if (aValue > bValue) return 1 * order;
        return 0;
      });
    }

    // Пагінація
    if (options.offset || options.limit) {
      const start = options.offset || 0;
      const end = options.limit ? start + options.limit : undefined;
      items = items.slice(start, end);
    }

    return items;
  }

  async findPaginated(
    page: number,
    pageSize: number,
    options: FindPriceListOptions = {}
  ): Promise<PaginatedPriceListResult> {
    if (page < 1 || pageSize < 1) {
      throw new Error(ERROR_MESSAGES.INVALID_PARAMETERS);
    }

    // Отримуємо всі елементи без пагінації для підрахунку total
    const allFilteredItems = await this.findMany({
      ...options,
      offset: undefined,
      limit: undefined,
    });

    const total = allFilteredItems.length;
    const offset = (page - 1) * pageSize;

    // Отримуємо елементи для поточної сторінки
    const items = await this.findMany({
      ...options,
      offset,
      limit: pageSize,
    });

    return {
      items,
      total,
      page,
      pageSize,
      hasMore: offset + pageSize < total,
    };
  }

  async create(
    itemData: Omit<PriceListItem, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<PriceListItem> {
    // Валідація
    const validation = PricingValidator.validatePriceListItem(itemData as PriceListItem);
    if (!validation.valid) {
      throw new Error(`${ERROR_MESSAGES.INVALID_ITEM_DATA}: ${validation.errors.join(', ')}`);
    }

    // Перевірка унікальності номера
    const existingItem = await this.findByItemNumber(itemData.itemNumber);
    if (existingItem) {
      throw new Error(ERROR_MESSAGES.ITEM_NUMBER_EXISTS);
    }

    // Створення елемента
    const newItem: PriceListItem = {
      ...itemData,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.items.set(newItem.id, newItem);
    return newItem;
  }

  async update(id: string, updates: Partial<PriceListItem>): Promise<PriceListItem> {
    const existingItem = await this.findById(id);
    if (!existingItem) {
      throw new Error(ERROR_MESSAGES.ITEM_NOT_FOUND);
    }

    // Перевірка унікальності номера (якщо номер змінюється)
    if (updates.itemNumber && updates.itemNumber !== existingItem.itemNumber) {
      const existingByNumber = await this.findByItemNumber(updates.itemNumber);
      if (existingByNumber && existingByNumber.id !== id) {
        throw new Error(ERROR_MESSAGES.ITEM_NUMBER_EXISTS);
      }
    }

    const updatedItem: PriceListItem = {
      ...existingItem,
      ...updates,
      id: existingItem.id, // Заборона зміни ID
      createdAt: existingItem.createdAt, // Заборона зміни дати створення
      updatedAt: new Date(),
    };

    // Валідація оновленого елемента
    const validation = PricingValidator.validatePriceListItem(updatedItem);
    if (!validation.valid) {
      throw new Error(`${ERROR_MESSAGES.INVALID_ITEM_DATA}: ${validation.errors.join(', ')}`);
    }

    this.items.set(id, updatedItem);
    return updatedItem;
  }

  async delete(id: string): Promise<void> {
    const existingItem = await this.findById(id);
    if (!existingItem) {
      throw new Error(ERROR_MESSAGES.ITEM_NOT_FOUND);
    }

    this.items.delete(id);
  }

  async deleteMany(ids: string[]): Promise<void> {
    for (const id of ids) {
      await this.delete(id);
    }
  }

  // === СПЕЦІАЛІЗОВАНІ ОПЕРАЦІЇ ===

  async findByCategory(category: ServiceCategory, activeOnly = true): Promise<PriceListItem[]> {
    return this.findMany({
      category,
      isActive: activeOnly ? true : undefined,
    });
  }

  async findActive(): Promise<PriceListItem[]> {
    return this.findMany({ isActive: true });
  }

  async search(searchParams: PriceSearchParams): Promise<PriceSearchResult> {
    const allItems = await this.findAll();
    const filteredItems = PricingUtils.filterPriceListItems(allItems, searchParams);
    return PricingUtils.createSearchResult(allItems, filteredItems, []);
  }

  async findSimilar(targetItem: PriceListItem, maxResults = 5): Promise<PriceListItem[]> {
    const allItems = await this.findAll();
    return PricingUtils.findSimilarItems(targetItem, allItems, maxResults);
  }

  async existsByItemNumber(itemNumber: string, excludeId?: string): Promise<boolean> {
    const existingItem = await this.findByItemNumber(itemNumber);
    if (!existingItem) return false;
    if (excludeId && existingItem.id === excludeId) return false;
    return true;
  }

  async getStatistics(): Promise<{
    totalItems: number;
    activeItems: number;
    categories: Record<ServiceCategory, number>;
    priceRange: { min: number; max: number; average: number };
  }> {
    const allItems = await this.findAll();
    const activeItems = allItems.filter((item) => item.isActive);

    // Підрахунок за категоріями
    const categories = {} as Record<ServiceCategory, number>;
    allItems.forEach((item) => {
      categories[item.category] = (categories[item.category] || 0) + 1;
    });

    // Діапазон цін
    const prices = allItems.map((item) => item.basePrice);
    const priceRange = {
      min: Math.min(...prices),
      max: Math.max(...prices),
      average: prices.reduce((sum, price) => sum + price, 0) / prices.length,
    };

    return {
      totalItems: allItems.length,
      activeItems: activeItems.length,
      categories,
      priceRange,
    };
  }

  // === БАТЧЕВІ ОПЕРАЦІЇ ===

  async createMany(
    itemsData: Array<Omit<PriceListItem, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<PriceListItem[]> {
    const results: PriceListItem[] = [];

    for (const itemData of itemsData) {
      try {
        const newItem = await this.create(itemData);
        results.push(newItem);
      } catch (error) {
        // Логування помилки, але продовжуємо обробку інших елементів
        console.error(`Помилка створення елемента ${itemData.itemNumber}:`, error);
      }
    }

    return results;
  }

  async updateMany(
    updates: Array<{ id: string; data: Partial<PriceListItem> }>
  ): Promise<PriceListItem[]> {
    const results: PriceListItem[] = [];

    for (const { id, data } of updates) {
      try {
        const updatedItem = await this.update(id, data);
        results.push(updatedItem);
      } catch (error) {
        // Логування помилки, але продовжуємо обробку інших елементів
        console.error(`Помилка оновлення елемента ${id}:`, error);
      }
    }

    return results;
  }

  async importFromCsv(csvData: string): Promise<{
    imported: PriceListItem[];
    errors: Array<{ row: number; error: string }>;
  }> {
    try {
      const parsedItems = PricingUtils.parseFromCsv(csvData);
      const imported: PriceListItem[] = [];
      const errors: Array<{ row: number; error: string }> = [];

      for (let i = 0; i < parsedItems.length; i++) {
        try {
          const newItem = await this.create(parsedItems[i]);
          imported.push(newItem);
        } catch (error) {
          errors.push({
            row: i + 2, // +2 бо рядок 1 - заголовки, індекс починається з 0
            error: error instanceof Error ? error.message : 'Невідома помилка',
          });
        }
      }

      return { imported, errors };
    } catch (error) {
      throw new Error(
        `Помилка парсингу CSV: ${error instanceof Error ? error.message : 'Невідома помилка'}`
      );
    }
  }

  async exportToCsv(options: FindPriceListOptions = {}): Promise<string> {
    const items = await this.findMany(options);
    return PricingUtils.exportToCsv(items);
  }

  // === КЕШУВАННЯ ТА СИНХРОНІЗАЦІЯ ===

  async clearCache(): Promise<void> {
    // В in-memory реалізації просто оновлюємо час синхронізації
    this.lastSyncTime = new Date();
  }

  async sync(): Promise<void> {
    // В майбутньому тут буде синхронізація з API
    this.lastSyncTime = new Date();
  }

  isDataStale(): boolean {
    const now = new Date();
    return now.getTime() - this.lastSyncTime.getTime() > this.cacheTimeout;
  }

  // === ПРИВАТНІ МЕТОДИ ===

  private generateId(): string {
    return `price-item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
