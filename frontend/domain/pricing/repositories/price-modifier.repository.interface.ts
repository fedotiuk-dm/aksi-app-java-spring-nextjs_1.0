/**
 * Інтерфейс репозиторію для роботи з модифікаторами цін
 * Визначає контракт для доступу до даних модифікаторів
 */

import type {
  PriceModifier,
  PriceModifierType,
  ServiceCategory,
  ModifierApplicationRule,
} from '../types';

/**
 * Опції для пошуку модифікаторів
 */
export interface FindModifiersOptions {
  type?: PriceModifierType;
  category?: ServiceCategory;
  isActive?: boolean;
  validAt?: Date;
  materialType?: string;
  colorType?: string;
  codes?: string[];
  limit?: number;
  offset?: number;
  sortBy?: keyof PriceModifier;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Результат пагінованого пошуку модифікаторів
 */
export interface PaginatedModifiersResult {
  modifiers: PriceModifier[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

/**
 * Фільтр для застосовних модифікаторів
 */
export interface ApplicableModifiersFilter {
  category: ServiceCategory;
  materialType?: string;
  colorType?: string;
  orderAmount?: number;
  isActive?: boolean;
}

/**
 * Інтерфейс репозиторію модифікаторів цін
 */
export interface IPriceModifierRepository {
  // === ОСНОВНІ CRUD ОПЕРАЦІЇ ===

  /**
   * Знаходить модифікатор за ID
   */
  findById(id: string): Promise<PriceModifier | null>;

  /**
   * Знаходить модифікатор за кодом
   */
  findByCode(code: string): Promise<PriceModifier | null>;

  /**
   * Знаходить всі модифікатори
   */
  findAll(): Promise<PriceModifier[]>;

  /**
   * Знаходить модифікатори з опціями фільтрації
   */
  findMany(options?: FindModifiersOptions): Promise<PriceModifier[]>;

  /**
   * Пагінований пошук модифікаторів
   */
  findPaginated(
    page: number,
    pageSize: number,
    options?: FindModifiersOptions
  ): Promise<PaginatedModifiersResult>;

  /**
   * Створює новий модифікатор
   */
  create(modifier: Omit<PriceModifier, 'id' | 'createdAt' | 'updatedAt'>): Promise<PriceModifier>;

  /**
   * Оновлює існуючий модифікатор
   */
  update(id: string, updates: Partial<PriceModifier>): Promise<PriceModifier>;

  /**
   * Видаляє модифікатор
   */
  delete(id: string): Promise<void>;

  /**
   * Видаляє кілька модифікаторів
   */
  deleteMany(ids: string[]): Promise<void>;

  // === СПЕЦІАЛІЗОВАНІ ОПЕРАЦІЇ ===

  /**
   * Знаходить модифікатори за типом
   */
  findByType(type: PriceModifierType, activeOnly?: boolean): Promise<PriceModifier[]>;

  /**
   * Знаходить модифікатори за категорією
   */
  findByCategory(category: ServiceCategory, activeOnly?: boolean): Promise<PriceModifier[]>;

  /**
   * Знаходить активні модифікатори
   */
  findActive(): Promise<PriceModifier[]>;

  /**
   * Знаходить модифікатори, які застосовні до певних критеріїв
   */
  findApplicable(filter: ApplicableModifiersFilter): Promise<PriceModifier[]>;

  /**
   * Знаходить модифікатори, валідні на певну дату
   */
  findValidAt(date: Date, activeOnly?: boolean): Promise<PriceModifier[]>;

  /**
   * Знаходить модифікатори за пріоритетом
   */
  findByPriorityRange(minPriority: number, maxPriority: number): Promise<PriceModifier[]>;

  /**
   * Перевіряє існування модифікатора з кодом
   */
  existsByCode(code: string, excludeId?: string): Promise<boolean>;

  /**
   * Знаходить конфліктуючі модифікатори
   */
  findConflicting(modifier: PriceModifier): Promise<PriceModifier[]>;

  // === ГРУПУВАННЯ ТА СТАТИСТИКА ===

  /**
   * Групує модифікатори за типом
   */
  groupByType(): Promise<Record<PriceModifierType, PriceModifier[]>>;

  /**
   * Групує модифікатори за категорією
   */
  groupByCategory(): Promise<Record<ServiceCategory, PriceModifier[]>>;

  /**
   * Отримує статистику модифікаторів
   */
  getStatistics(): Promise<{
    totalModifiers: number;
    activeModifiers: number;
    byType: Record<PriceModifierType, number>;
    byCategory: Record<ServiceCategory, number>;
    averageValue: number;
    valueRange: { min: number; max: number };
  }>;

  // === БАТЧЕВІ ОПЕРАЦІЇ ===

  /**
   * Створює кілька модифікаторів
   */
  createMany(
    modifiers: Array<Omit<PriceModifier, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<PriceModifier[]>;

  /**
   * Оновлює кілька модифікаторів
   */
  updateMany(
    updates: Array<{ id: string; data: Partial<PriceModifier> }>
  ): Promise<PriceModifier[]>;

  /**
   * Деактивує модифікатори за критеріями
   */
  deactivateMany(options: FindModifiersOptions): Promise<number>;

  /**
   * Активує модифікатори за критеріями
   */
  activateMany(options: FindModifiersOptions): Promise<number>;

  // === ВАЛІДАЦІЯ ТА ПЕРЕВІРКИ ===

  /**
   * Валідує модифікатор
   */
  validate(modifier: PriceModifier): Promise<{
    isValid: boolean;
    errors: string[];
    warnings: string[];
  }>;

  /**
   * Перевіряє чи можна застосувати модифікатор
   */
  canApply(
    modifier: PriceModifier,
    context: {
      category: ServiceCategory;
      materialType?: string;
      colorType?: string;
      orderAmount?: number;
    }
  ): Promise<{
    canApply: boolean;
    reason?: string;
  }>;

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
