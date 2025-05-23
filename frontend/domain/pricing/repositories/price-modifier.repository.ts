/**
 * Реалізація репозиторію модифікаторів цін
 * In-memory реалізація з можливістю розширення для API інтеграції
 */

import { PricingUtils } from '../utils/pricing.utils';
import { PricingValidator } from '../utils/pricing.validator';

import type {
  PriceModifier,
  PriceModifierType,
  ServiceCategory,
  ModifierApplicationRule,
} from '../types';
import type {
  IPriceModifierRepository,
  FindModifiersOptions,
  PaginatedModifiersResult,
  ApplicableModifiersFilter,
} from './price-modifier.repository.interface';

/**
 * Константи для помилок
 */
const ERROR_MESSAGES = {
  MODIFIER_NOT_FOUND: 'Модифікатор не знайдено',
  MODIFIER_CODE_EXISTS: 'Модифікатор з таким кодом вже існує',
  INVALID_MODIFIER_DATA: 'Невалідні дані модифікатора',
  INVALID_PARAMETERS: 'Невалідні параметри операції',
  REPOSITORY_ERROR: 'Помилка репозиторію',
} as const;

/**
 * In-memory реалізація репозиторію модифікаторів цін
 */
export class PriceModifierRepository implements IPriceModifierRepository {
  private modifiers: Map<string, PriceModifier> = new Map();
  private lastSyncTime: Date = new Date();
  private cacheTimeout: number = 5 * 60 * 1000; // 5 хвилин

  constructor(initialData?: PriceModifier[]) {
    if (initialData) {
      initialData.forEach((modifier) => {
        this.modifiers.set(modifier.id, modifier);
      });
    }
  }

  // === ОСНОВНІ CRUD ОПЕРАЦІЇ ===

  async findById(id: string): Promise<PriceModifier | null> {
    if (!id?.trim()) {
      throw new Error(ERROR_MESSAGES.INVALID_PARAMETERS);
    }

    return this.modifiers.get(id) || null;
  }

  async findByCode(code: string): Promise<PriceModifier | null> {
    if (!code?.trim()) {
      throw new Error(ERROR_MESSAGES.INVALID_PARAMETERS);
    }

    for (const modifier of this.modifiers.values()) {
      if (modifier.code === code) {
        return modifier;
      }
    }
    return null;
  }

  async findAll(): Promise<PriceModifier[]> {
    return Array.from(this.modifiers.values());
  }

  async findMany(options: FindModifiersOptions = {}): Promise<PriceModifier[]> {
    let modifiers = Array.from(this.modifiers.values());

    // Фільтрація
    if (options.type) {
      modifiers = modifiers.filter((modifier) => modifier.type === options.type);
    }

    if (options.category) {
      modifiers = modifiers.filter((modifier) =>
        modifier.applicableCategories.includes(options.category as ServiceCategory)
      );
    }

    if (options.isActive !== undefined) {
      modifiers = modifiers.filter((modifier) => modifier.isActive === options.isActive);
    }

    if (options.validAt) {
      const date = options.validAt;
      modifiers = modifiers.filter((modifier) => {
        if (modifier.validFrom && modifier.validFrom > date) return false;
        if (modifier.validTo && modifier.validTo < date) return false;
        return true;
      });
    }

    if (options.materialType) {
      modifiers = modifiers.filter((modifier) => {
        if (!modifier.materialTypes || modifier.materialTypes.length === 0) return true;
        return modifier.materialTypes.includes(options.materialType as string);
      });
    }

    if (options.colorType) {
      modifiers = modifiers.filter((modifier) => {
        if (!modifier.colorTypes || modifier.colorTypes.length === 0) return true;
        return modifier.colorTypes.includes(options.colorType as string);
      });
    }

    if (options.codes?.length) {
      modifiers = modifiers.filter((modifier) => options.codes?.includes(modifier.code));
    }

    // Сортування
    if (options.sortBy) {
      modifiers.sort((a, b) => {
        const aValue = a[options.sortBy as keyof PriceModifier];
        const bValue = b[options.sortBy as keyof PriceModifier];
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
      modifiers = modifiers.slice(start, end);
    }

    return modifiers;
  }

  async findPaginated(
    page: number,
    pageSize: number,
    options: FindModifiersOptions = {}
  ): Promise<PaginatedModifiersResult> {
    if (page < 1 || pageSize < 1) {
      throw new Error(ERROR_MESSAGES.INVALID_PARAMETERS);
    }

    // Отримуємо всі модифікатори без пагінації для підрахунку total
    const allFilteredModifiers = await this.findMany({
      ...options,
      offset: undefined,
      limit: undefined,
    });

    const total = allFilteredModifiers.length;
    const offset = (page - 1) * pageSize;

    // Отримуємо модифікатори для поточної сторінки
    const modifiers = await this.findMany({
      ...options,
      offset,
      limit: pageSize,
    });

    return {
      modifiers,
      total,
      page,
      pageSize,
      hasMore: offset + pageSize < total,
    };
  }

  async create(
    modifierData: Omit<PriceModifier, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<PriceModifier> {
    // Валідація
    const validation = PricingValidator.validatePriceModifier(modifierData as PriceModifier);
    if (!validation.valid) {
      throw new Error(`${ERROR_MESSAGES.INVALID_MODIFIER_DATA}: ${validation.errors.join(', ')}`);
    }

    // Перевірка унікальності коду
    const existingModifier = await this.findByCode(modifierData.code);
    if (existingModifier) {
      throw new Error(ERROR_MESSAGES.MODIFIER_CODE_EXISTS);
    }

    // Створення модифікатора
    const newModifier: PriceModifier = {
      ...modifierData,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.modifiers.set(newModifier.id, newModifier);
    return newModifier;
  }

  async update(id: string, updates: Partial<PriceModifier>): Promise<PriceModifier> {
    const existingModifier = await this.findById(id);
    if (!existingModifier) {
      throw new Error(ERROR_MESSAGES.MODIFIER_NOT_FOUND);
    }

    // Перевірка унікальності коду (якщо код змінюється)
    if (updates.code && updates.code !== existingModifier.code) {
      const existingByCode = await this.findByCode(updates.code);
      if (existingByCode && existingByCode.id !== id) {
        throw new Error(ERROR_MESSAGES.MODIFIER_CODE_EXISTS);
      }
    }

    const updatedModifier: PriceModifier = {
      ...existingModifier,
      ...updates,
      id: existingModifier.id, // Заборона зміни ID
      createdAt: existingModifier.createdAt, // Заборона зміни дати створення
      updatedAt: new Date(),
    };

    // Валідація оновленого модифікатора
    const validation = PricingValidator.validatePriceModifier(updatedModifier);
    if (!validation.valid) {
      throw new Error(`${ERROR_MESSAGES.INVALID_MODIFIER_DATA}: ${validation.errors.join(', ')}`);
    }

    this.modifiers.set(id, updatedModifier);
    return updatedModifier;
  }

  async delete(id: string): Promise<void> {
    const existingModifier = await this.findById(id);
    if (!existingModifier) {
      throw new Error(ERROR_MESSAGES.MODIFIER_NOT_FOUND);
    }

    this.modifiers.delete(id);
  }

  async deleteMany(ids: string[]): Promise<void> {
    for (const id of ids) {
      await this.delete(id);
    }
  }

  // === СПЕЦІАЛІЗОВАНІ ОПЕРАЦІЇ ===

  async findByType(type: PriceModifierType, activeOnly = true): Promise<PriceModifier[]> {
    return this.findMany({
      type,
      isActive: activeOnly ? true : undefined,
    });
  }

  async findByCategory(category: ServiceCategory, activeOnly = true): Promise<PriceModifier[]> {
    return this.findMany({
      category,
      isActive: activeOnly ? true : undefined,
    });
  }

  async findActive(): Promise<PriceModifier[]> {
    return this.findMany({ isActive: true });
  }

  async findApplicable(filter: ApplicableModifiersFilter): Promise<PriceModifier[]> {
    const options: FindModifiersOptions = {
      category: filter.category,
      isActive: filter.isActive ?? true,
      materialType: filter.materialType,
      colorType: filter.colorType,
      validAt: new Date(),
    };

    const modifiers = await this.findMany(options);

    // Додаткова фільтрація за сумою замовлення
    if (filter.orderAmount !== undefined) {
      return modifiers.filter((modifier) => {
        if (modifier.minOrderAmount && filter.orderAmount < modifier.minOrderAmount) return false;
        if (modifier.maxOrderAmount && filter.orderAmount > modifier.maxOrderAmount) return false;
        return true;
      });
    }

    return modifiers;
  }

  async findValidAt(date: Date, activeOnly = true): Promise<PriceModifier[]> {
    return this.findMany({
      validAt: date,
      isActive: activeOnly ? true : undefined,
    });
  }

  async findByPriorityRange(minPriority: number, maxPriority: number): Promise<PriceModifier[]> {
    const allModifiers = await this.findAll();
    return allModifiers.filter(
      (modifier) => modifier.priority >= minPriority && modifier.priority <= maxPriority
    );
  }

  async existsByCode(code: string, excludeId?: string): Promise<boolean> {
    const existingModifier = await this.findByCode(code);
    if (!existingModifier) return false;
    if (excludeId && existingModifier.id === excludeId) return false;
    return true;
  }

  async findConflicting(modifier: PriceModifier): Promise<PriceModifier[]> {
    const allModifiers = await this.findAll();

    return allModifiers.filter((existing) => {
      if (existing.id === modifier.id) return false;

      // Перевірка конфліктів за категоріями
      const hasCommonCategory = modifier.applicableCategories.some((cat) =>
        existing.applicableCategories.includes(cat)
      );

      if (!hasCommonCategory) return false;

      // Перевірка конфліктів за часовими рамками
      if (modifier.validFrom && existing.validTo && modifier.validFrom > existing.validTo)
        return false;
      if (modifier.validTo && existing.validFrom && modifier.validTo < existing.validFrom)
        return false;

      // Перевірка конфліктів за типом
      if (modifier.type === existing.type && modifier.conflictsWith?.includes(existing.code)) {
        return true;
      }

      return false;
    });
  }

  // === ГРУПУВАННЯ ТА СТАТИСТИКА ===

  async groupByType(): Promise<Record<PriceModifierType, PriceModifier[]>> {
    const allModifiers = await this.findAll();
    const grouped = {} as Record<PriceModifierType, PriceModifier[]>;

    allModifiers.forEach((modifier) => {
      if (!grouped[modifier.type]) {
        grouped[modifier.type] = [];
      }
      grouped[modifier.type].push(modifier);
    });

    return grouped;
  }

  async groupByCategory(): Promise<Record<ServiceCategory, PriceModifier[]>> {
    const allModifiers = await this.findAll();
    const grouped = {} as Record<ServiceCategory, PriceModifier[]>;

    allModifiers.forEach((modifier) => {
      modifier.applicableCategories.forEach((category) => {
        if (!grouped[category]) {
          grouped[category] = [];
        }
        if (!grouped[category].find((m) => m.id === modifier.id)) {
          grouped[category].push(modifier);
        }
      });
    });

    return grouped;
  }

  async getStatistics(): Promise<{
    totalModifiers: number;
    activeModifiers: number;
    byType: Record<PriceModifierType, number>;
    byCategory: Record<ServiceCategory, number>;
    averageValue: number;
    valueRange: { min: number; max: number };
  }> {
    const allModifiers = await this.findAll();
    const activeModifiers = allModifiers.filter((modifier) => modifier.isActive);

    // Підрахунок за типами
    const byType = {} as Record<PriceModifierType, number>;
    allModifiers.forEach((modifier) => {
      byType[modifier.type] = (byType[modifier.type] || 0) + 1;
    });

    // Підрахунок за категоріями
    const byCategory = {} as Record<ServiceCategory, number>;
    allModifiers.forEach((modifier) => {
      modifier.applicableCategories.forEach((category) => {
        byCategory[category] = (byCategory[category] || 0) + 1;
      });
    });

    // Діапазон значень
    const values = allModifiers.map((modifier) => Math.abs(modifier.value));
    const valueRange = {
      min: Math.min(...values),
      max: Math.max(...values),
    };

    const averageValue = values.reduce((sum, value) => sum + value, 0) / values.length;

    return {
      totalModifiers: allModifiers.length,
      activeModifiers: activeModifiers.length,
      byType,
      byCategory,
      averageValue,
      valueRange,
    };
  }

  // === БАТЧЕВІ ОПЕРАЦІЇ ===

  async createMany(
    modifiersData: Array<Omit<PriceModifier, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<PriceModifier[]> {
    const results: PriceModifier[] = [];

    for (const modifierData of modifiersData) {
      try {
        const newModifier = await this.create(modifierData);
        results.push(newModifier);
      } catch (error) {
        console.error(`Помилка створення модифікатора ${modifierData.code}:`, error);
      }
    }

    return results;
  }

  async updateMany(
    updates: Array<{ id: string; data: Partial<PriceModifier> }>
  ): Promise<PriceModifier[]> {
    const results: PriceModifier[] = [];

    for (const { id, data } of updates) {
      try {
        const updatedModifier = await this.update(id, data);
        results.push(updatedModifier);
      } catch (error) {
        console.error(`Помилка оновлення модифікатора ${id}:`, error);
      }
    }

    return results;
  }

  async deactivateMany(options: FindModifiersOptions): Promise<number> {
    const modifiers = await this.findMany(options);
    let deactivatedCount = 0;

    for (const modifier of modifiers) {
      try {
        await this.update(modifier.id, { isActive: false });
        deactivatedCount++;
      } catch (error) {
        console.error(`Помилка деактивації модифікатора ${modifier.id}:`, error);
      }
    }

    return deactivatedCount;
  }

  async activateMany(options: FindModifiersOptions): Promise<number> {
    const modifiers = await this.findMany(options);
    let activatedCount = 0;

    for (const modifier of modifiers) {
      try {
        await this.update(modifier.id, { isActive: true });
        activatedCount++;
      } catch (error) {
        console.error(`Помилка активації модифікатора ${modifier.id}:`, error);
      }
    }

    return activatedCount;
  }

  // === ВАЛІДАЦІЯ ТА ПЕРЕВІРКИ ===

  async validate(modifier: PriceModifier): Promise<{
    isValid: boolean;
    errors: string[];
    warnings: string[];
  }> {
    const validation = PricingValidator.validatePriceModifier(modifier);

    return {
      isValid: validation.valid,
      errors: validation.errors,
      warnings: validation.warnings,
    };
  }

  async canApply(
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
  }> {
    // Перевірка категорії
    if (!modifier.applicableCategories.includes(context.category)) {
      return {
        canApply: false,
        reason: `Модифікатор не застосовується до категорії ${context.category}`,
      };
    }

    // Перевірка матеріалу
    if (modifier.materialTypes?.length && context.materialType) {
      if (!modifier.materialTypes.includes(context.materialType)) {
        return {
          canApply: false,
          reason: `Модифікатор не застосовується до матеріалу ${context.materialType}`,
        };
      }
    }

    // Перевірка кольору
    if (modifier.colorTypes?.length && context.colorType) {
      if (!modifier.colorTypes.includes(context.colorType)) {
        return {
          canApply: false,
          reason: `Модифікатор не застосовується до кольору ${context.colorType}`,
        };
      }
    }

    // Перевірка суми замовлення
    if (context.orderAmount !== undefined) {
      if (modifier.minOrderAmount && context.orderAmount < modifier.minOrderAmount) {
        return {
          canApply: false,
          reason: `Мінімальна сума замовлення: ${modifier.minOrderAmount}`,
        };
      }

      if (modifier.maxOrderAmount && context.orderAmount > modifier.maxOrderAmount) {
        return {
          canApply: false,
          reason: `Максимальна сума замовлення: ${modifier.maxOrderAmount}`,
        };
      }
    }

    // Перевірка активності
    if (!modifier.isActive) {
      return {
        canApply: false,
        reason: 'Модифікатор неактивний',
      };
    }

    // Перевірка дат
    const now = new Date();
    if (modifier.validFrom && modifier.validFrom > now) {
      return {
        canApply: false,
        reason: `Модифікатор стане активним: ${modifier.validFrom.toLocaleDateString()}`,
      };
    }

    if (modifier.validTo && modifier.validTo < now) {
      return {
        canApply: false,
        reason: `Модифікатор більше неактивний з: ${modifier.validTo.toLocaleDateString()}`,
      };
    }

    return {
      canApply: true,
    };
  }

  // === КЕШУВАННЯ ТА СИНХРОНІЗАЦІЯ ===

  async clearCache(): Promise<void> {
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
    return `price-modifier-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
