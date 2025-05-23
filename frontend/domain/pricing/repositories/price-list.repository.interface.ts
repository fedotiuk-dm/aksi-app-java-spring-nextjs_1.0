/**
 * Інтерфейс репозиторію для роботи з прайс-листом
 * Визначає контракт для доступу до даних прайс-листа
 */

import type {
  PriceListItem,
  ServiceCategory,
  PriceSearchParams,
  PriceSearchResult,
} from '../types';

/**
 * Опції для пошуку та фільтрації
 */
export interface FindPriceListOptions {
  category?: ServiceCategory;
  isActive?: boolean;
  itemNumbers?: string[];
  limit?: number;
  offset?: number;
  sortBy?: keyof PriceListItem;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Результат пагінованого пошуку
 */
export interface PaginatedPriceListResult {
  items: PriceListItem[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

/**
 * Інтерфейс репозиторію прайс-листа
 */
export interface IPriceListRepository {
  // === ОСНОВНІ CRUD ОПЕРАЦІЇ ===

  /**
   * Знаходить елемент за ID
   */
  findById(id: string): Promise<PriceListItem | null>;

  /**
   * Знаходить елемент за номером
   */
  findByItemNumber(itemNumber: string): Promise<PriceListItem | null>;

  /**
   * Знаходить всі елементи
   */
  findAll(): Promise<PriceListItem[]>;

  /**
   * Знаходить елементи з опціями фільтрації
   */
  findMany(options?: FindPriceListOptions): Promise<PriceListItem[]>;

  /**
   * Пагінований пошук
   */
  findPaginated(
    page: number,
    pageSize: number,
    options?: FindPriceListOptions
  ): Promise<PaginatedPriceListResult>;

  /**
   * Створює новий елемент
   */
  create(item: Omit<PriceListItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<PriceListItem>;

  /**
   * Оновлює існуючий елемент
   */
  update(id: string, updates: Partial<PriceListItem>): Promise<PriceListItem>;

  /**
   * Видаляє елемент
   */
  delete(id: string): Promise<void>;

  /**
   * Видаляє кілька елементів
   */
  deleteMany(ids: string[]): Promise<void>;

  // === СПЕЦІАЛІЗОВАНІ ОПЕРАЦІЇ ===

  /**
   * Знаходить елементи за категорією
   */
  findByCategory(category: ServiceCategory, activeOnly?: boolean): Promise<PriceListItem[]>;

  /**
   * Знаходить активні елементи
   */
  findActive(): Promise<PriceListItem[]>;

  /**
   * Пошук з текстом
   */
  search(searchParams: PriceSearchParams): Promise<PriceSearchResult>;

  /**
   * Знаходить подібні елементи
   */
  findSimilar(targetItem: PriceListItem, maxResults?: number): Promise<PriceListItem[]>;

  /**
   * Перевіряє існування елемента з номером
   */
  existsByItemNumber(itemNumber: string, excludeId?: string): Promise<boolean>;

  /**
   * Отримує статистику
   */
  getStatistics(): Promise<{
    totalItems: number;
    activeItems: number;
    categories: Record<ServiceCategory, number>;
    priceRange: { min: number; max: number; average: number };
  }>;

  // === БАТЧЕВІ ОПЕРАЦІЇ ===

  /**
   * Створює кілька елементів
   */
  createMany(
    items: Array<Omit<PriceListItem, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<PriceListItem[]>;

  /**
   * Оновлює кілька елементів
   */
  updateMany(
    updates: Array<{ id: string; data: Partial<PriceListItem> }>
  ): Promise<PriceListItem[]>;

  /**
   * Імпорт з CSV
   */
  importFromCsv(csvData: string): Promise<{
    imported: PriceListItem[];
    errors: Array<{ row: number; error: string }>;
  }>;

  /**
   * Експорт в CSV
   */
  exportToCsv(options?: FindPriceListOptions): Promise<string>;

  // === КЕШУВАННЯ ТА СИНХРОНІЗАЦІЯ ===

  /**
   * Очищає кеш
   */
  clearCache(): Promise<void>;

  /**
   * Синхронізує з сервером
   */
  sync(): Promise<void>;

  /**
   * Перевіряє чи дані актуальні
   */
  isDataStale(): boolean;
}
