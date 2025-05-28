import {
  getAllServiceCategories,
  getPriceListItemsByCategory,
  getAvailableUnitsForCategory,
  type WizardServiceCategory,
  type WizardPriceListItem,
  type WizardUnitOfMeasure,
} from '@/domain/wizard/adapters/pricing';
import {
  // Основні схеми підетапу 2.1
  basicItemInfoSchema,
  categorySelectionSchema,
  itemNameSelectionSchema,

  // Схеми для менеджера предметів (2.0)
  itemListItemSchema,
  itemListSchema,
  itemSummarySchema,

  // Енуми
  unitTypeEnum,
  wearLevelEnum,
  fillerTypeEnum,

  // Типи
  type BasicItemInfo,
  type CategorySelection,
  type ItemNameSelection,
  type UnitType,
  type ItemListItem,
  type ItemList,
  type ItemSummary,
  type WearLevel,
  type FillerType,
} from '@/domain/wizard/schemas';

import { BaseWizardService } from '../../base.service';

/**
 * Розширений мінімалістський сервіс для основної інформації про предмет
 * Розмір: ~120 рядків (в межах ліміту)
 *
 * Відповідальність (ТІЛЬКИ):
 * - Композиція pricing адаптерів для категорій + прайс-лист
 * - Валідація через ВСІ централізовані Zod схеми підетапу 2.1
 * - Мінімальна фільтрація за категоріями
 * - Робота з енумами (одиниці, рівні зносу, наповнювачі)
 *
 * НЕ дублює:
 * - API виклики (роль pricing адаптерів)
 * - Мапінг даних (роль адаптерів)
 * - Збереження стану (роль Zustand)
 * - Кешування (роль TanStack Query)
 * - Схеми валідації (роль централізованих schemas)
 */

export class BasicInfoService extends BaseWizardService {
  protected readonly serviceName = 'BasicInfoService';

  // === КОМПОЗИЦІЯ АДАПТЕРІВ ===

  /**
   * Композиція: отримання всіх категорій
   */
  async getCategories(): Promise<WizardServiceCategory[]> {
    const result = await getAllServiceCategories();
    return result.success ? result.data || [] : [];
  }

  /**
   * Композиція: фільтрація прайс-листа за категорією
   */
  async getItemsByCategory(categoryCode: string): Promise<WizardPriceListItem[]> {
    const result = await getPriceListItemsByCategory(categoryCode);
    return result.success ? result.data || [] : [];
  }

  /**
   * Композиція: отримання одиниць виміру
   */
  async getUnitsForCategory(categoryId: string): Promise<WizardUnitOfMeasure[]> {
    const result = await getAvailableUnitsForCategory(categoryId);
    return result.success ? result.data || [] : [];
  }

  // === ВАЛІДАЦІЯ ОСНОВНИХ СХЕМ 2.1 ===

  /**
   * Валідація повної базової інформації
   */
  validateBasicInfo(data: unknown) {
    return basicItemInfoSchema.safeParse(data);
  }

  /**
   * Валідація вибору категорії
   */
  validateCategorySelection(data: unknown) {
    return categorySelectionSchema.safeParse(data);
  }

  /**
   * Валідація вибору найменування
   */
  validateItemNameSelection(data: unknown) {
    return itemNameSelectionSchema.safeParse(data);
  }

  // === ВАЛІДАЦІЯ МЕНЕДЖЕРА ПРЕДМЕТІВ 2.0 ===

  /**
   * Валідація предмета в списку
   */
  validateItemListItem(data: unknown) {
    return itemListItemSchema.safeParse(data);
  }

  /**
   * Валідація списку предметів
   */
  validateItemList(data: unknown) {
    return itemListSchema.safeParse(data);
  }

  /**
   * Валідація підсумку замовлення
   */
  validateItemSummary(data: unknown) {
    return itemSummarySchema.safeParse(data);
  }

  // === РОБОТА З ЕНУМАМИ ===

  /**
   * Отримання всіх можливих одиниць виміру
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
   * Отримання всіх рівнів зносу
   */
  getAvailableWearLevels(): WearLevel[] {
    return wearLevelEnum.options;
  }

  /**
   * Валідація рівня зносу
   */
  validateWearLevel(level: string): boolean {
    return wearLevelEnum.safeParse(level).success;
  }

  /**
   * Отримання всіх типів наповнювачів
   */
  getAvailableFillerTypes(): FillerType[] {
    return fillerTypeEnum.options;
  }

  /**
   * Валідація типу наповнювача
   */
  validateFillerType(type: string): boolean {
    return fillerTypeEnum.safeParse(type).success;
  }

  // === БІЗНЕС-ЛОГІКА ===

  /**
   * Перевірка сумісності одиниці з категорією
   */
  isUnitCompatible(categoryCode: string, unitType: UnitType): boolean {
    // Основна логіка сумісності буде в адаптерах або бізнес-правилах
    // Тут тільки мінімальна валідація
    return this.validateUnitType(unitType) && ['piece', 'kg'].includes(unitType);
  }

  /**
   * Отримання одиниці виміру за замовчуванням для категорії
   */
  getDefaultUnit(categoryCode: string): UnitType {
    // Більшість предметів - штуки, тільки білизна - кілограми
    const kgCategories = ['laundry', 'washing'];
    return kgCategories.includes(categoryCode.toLowerCase()) ? 'kg' : 'piece';
  }

  /**
   * Створення базової інформації з валідацією
   */
  createBasicInfoWithValidation(
    categoryCode: string,
    itemName: string,
    quantity: number,
    unitType: UnitType
  ) {
    const data: BasicItemInfo = {
      categoryCode,
      itemName,
      quantity,
      unitType,
    };

    const validation = this.validateBasicInfo(data);
    if (!validation.success) {
      throw new Error(`Валідація базової інформації: ${validation.error.errors[0]?.message}`);
    }

    return validation.data;
  }
}
