/**
 * Головний сервіс для Pricing домену
 * Реалізує бізнес-логіку, CRUD операції та інтеграцію з API
 */

import { PricingCalculator } from '../utils/pricing.calculator';
import { PricingUtils } from '../utils/pricing.utils';
import { PricingValidator } from '../utils/pricing.validator';

import type {
  PriceListItem,
  PriceModifier,
  PriceCalculationParams,
  PriceCalculationResult,
  PriceSearchParams,
  PriceSearchResult,
  ServiceCategory,
  PricingStatistics,
  PricingOperationResult,
} from '../types';

/**
 * Результат групового розрахунку
 */
interface BulkCalculationResult {
  results: PriceCalculationResult[];
  summary: {
    totalAmount: number;
    totalDiscount: number;
    finalAmount: number;
    itemsCount: number;
    averagePrice: number;
  };
  errors: string[];
}

/**
 * Елемент для групового розрахунку
 */
interface BulkCalculationItem {
  params: PriceCalculationParams;
  modifiers?: PriceModifier[];
}

/**
 * Результат порівняння цін
 */
interface PriceComparisonResult {
  comparisons: Array<{
    setIndex: number;
    result: PriceCalculationResult;
    savings: number;
    isOptimal: boolean;
  }>;
  recommendation: {
    bestSetIndex: number;
    savings: number;
    reasoning: string;
  };
}

export class PricingService {
  // === CRUD ОПЕРАЦІЇ З ПРАЙС-ЛИСТОМ ===

  /**
   * Створює новий елемент прайс-листа
   */
  static createPriceListItem(
    itemData: Omit<PriceListItem, 'id' | 'createdAt' | 'updatedAt'>,
    existingItems: PriceListItem[] = []
  ): PricingOperationResult {
    try {
      // Валідація даних
      const validation = PricingValidator.validatePriceListItem(itemData as PriceListItem);
      if (!validation.valid) {
        return {
          success: false,
          errors: {
            validation: validation.errors.reduce(
              (acc, error, index) => {
                acc[`field_${index}`] = error;
                return acc;
              },
              {} as Record<string, string>
            ),
          },
        };
      }

      // Перевірка унікальності номера
      const existingByNumber = existingItems.find(
        (item) => item.itemNumber === itemData.itemNumber
      );
      if (existingByNumber) {
        return {
          success: false,
          errors: {
            validation: {
              itemNumber: 'Елемент з таким номером вже існує',
            },
          },
        };
      }

      // Створення елемента
      const newItem: PriceListItem = {
        ...itemData,
        id: this.generateId(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      return {
        success: true,
        data: newItem,
      };
    } catch (error) {
      return {
        success: false,
        errors: {
          general: error instanceof Error ? error.message : 'Невідома помилка',
        },
      };
    }
  }

  /**
   * Оновлює елемент прайс-листа
   */
  static updatePriceListItem(
    itemId: string,
    updates: Partial<PriceListItem>,
    existingItems: PriceListItem[] = []
  ): PricingOperationResult {
    try {
      const existingItem = existingItems.find((item) => item.id === itemId);
      if (!existingItem) {
        return {
          success: false,
          errors: {
            general: 'Елемент не знайдено',
          },
        };
      }

      const updatedItem = { ...existingItem, ...updates, updatedAt: new Date() };

      // Валідація оновленого елемента
      const validation = PricingValidator.validatePriceListItem(updatedItem);
      if (!validation.valid) {
        return {
          success: false,
          errors: {
            validation: validation.errors.reduce(
              (acc, error, index) => {
                acc[`field_${index}`] = error;
                return acc;
              },
              {} as Record<string, string>
            ),
          },
        };
      }

      // Перевірка унікальності номера (якщо номер змінився)
      if (updates.itemNumber && updates.itemNumber !== existingItem.itemNumber) {
        const existingByNumber = existingItems.find(
          (item) => item.itemNumber === updates.itemNumber && item.id !== itemId
        );
        if (existingByNumber) {
          return {
            success: false,
            errors: {
              validation: {
                itemNumber: 'Елемент з таким номером вже існує',
              },
            },
          };
        }
      }

      return {
        success: true,
        data: updatedItem,
      };
    } catch (error) {
      return {
        success: false,
        errors: {
          general: error instanceof Error ? error.message : 'Невідома помилка',
        },
      };
    }
  }

  /**
   * Видаляє елемент прайс-листа
   */
  static deletePriceListItem(
    itemId: string,
    existingItems: PriceListItem[] = []
  ): PricingOperationResult {
    try {
      const existingItem = existingItems.find((item) => item.id === itemId);
      if (!existingItem) {
        return {
          success: false,
          errors: {
            general: 'Елемент не знайдено',
          },
        };
      }

      return {
        success: true,
        data: itemId,
      };
    } catch (error) {
      return {
        success: false,
        errors: {
          general: error instanceof Error ? error.message : 'Невідома помилка',
        },
      };
    }
  }

  // === CRUD ОПЕРАЦІЇ З МОДИФІКАТОРАМИ ===

  /**
   * Створює новий модифікатор
   */
  static createPriceModifier(
    modifierData: Omit<PriceModifier, 'id' | 'createdAt' | 'updatedAt'>
  ): PricingOperationResult {
    try {
      // Валідація даних
      const validation = PricingValidator.validatePriceModifier(modifierData as PriceModifier);
      if (!validation.valid) {
        return {
          success: false,
          errors: {
            validation: validation.errors.reduce(
              (acc, error, index) => {
                acc[`field_${index}`] = error;
                return acc;
              },
              {} as Record<string, string>
            ),
          },
        };
      }

      // Створення модифікатора
      const newModifier: PriceModifier = {
        ...modifierData,
        id: this.generateId(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      return {
        success: true,
        data: newModifier,
      };
    } catch (error) {
      return {
        success: false,
        errors: {
          general: error instanceof Error ? error.message : 'Невідома помилка',
        },
      };
    }
  }

  /**
   * Валідує модифікатор
   */
  static validatePriceModifier(modifier: PriceModifier): PricingOperationResult {
    try {
      const validation = PricingValidator.validatePriceModifier(modifier);
      return {
        success: validation.valid,
        errors: validation.valid
          ? undefined
          : {
              validation: validation.errors.reduce(
                (acc, error, index) => {
                  acc[`field_${index}`] = error;
                  return acc;
                },
                {} as Record<string, string>
              ),
            },
        warnings: validation.warnings,
      };
    } catch (error) {
      return {
        success: false,
        errors: {
          general: error instanceof Error ? error.message : 'Невідома помилка',
        },
      };
    }
  }

  /**
   * Валідує елемент прайс-листа
   */
  static validatePriceListItem(item: PriceListItem): PricingOperationResult {
    try {
      const validation = PricingValidator.validatePriceListItem(item);
      return {
        success: validation.valid,
        errors: validation.valid
          ? undefined
          : {
              validation: validation.errors.reduce(
                (acc, error, index) => {
                  acc[`field_${index}`] = error;
                  return acc;
                },
                {} as Record<string, string>
              ),
            },
        warnings: validation.warnings,
      };
    } catch (error) {
      return {
        success: false,
        errors: {
          general: error instanceof Error ? error.message : 'Невідома помилка',
        },
      };
    }
  }

  // === ОПЕРАЦІЇ ПОШУКУ ===

  /**
   * Шукає елементи прайс-листа
   */
  static searchPriceList(
    allItems: PriceListItem[],
    searchParams: PriceSearchParams
  ): PriceSearchResult {
    const filteredItems = PricingUtils.filterPriceListItems(allItems, searchParams);

    // Створюємо результат пошуку
    return PricingUtils.createSearchResult(allItems, filteredItems, []);
  }

  /**
   * Знаходить елемент прайс-листа за номером
   */
  static findPriceListItemByNumber(
    items: PriceListItem[],
    itemNumber: string
  ): PriceListItem | null {
    return items.find((item) => item.itemNumber === itemNumber) || null;
  }

  /**
   * Знаходить подібні послуги
   */
  static findSimilarServices(
    targetItem: PriceListItem,
    allItems: PriceListItem[],
    maxResults: number = 5
  ): PriceListItem[] {
    return PricingUtils.findSimilarItems(targetItem, allItems, maxResults);
  }

  // === ОПЕРАЦІЇ З РОЗРАХУНКАМИ ===

  /**
   * Розраховує ціну для одного предмета
   */
  static calculatePrice(
    params: PriceCalculationParams,
    modifiers: PriceModifier[] = []
  ): PriceCalculationResult {
    return PricingCalculator.calculatePrice(params, modifiers);
  }

  /**
   * Груповий розрахунок цін
   */
  static calculateBulkPrices(items: BulkCalculationItem[]): PricingOperationResult {
    try {
      const results: PriceCalculationResult[] = [];
      const errors: string[] = [];

      // Розраховуємо ціну для кожного елемента
      items.forEach((item, index) => {
        try {
          const result = PricingCalculator.calculatePrice(item.params, item.modifiers);
          results.push(result);
        } catch (error) {
          errors.push(
            `Помилка розрахунку для елемента ${index + 1}: ${
              error instanceof Error ? error.message : 'Невідома помилка'
            }`
          );
        }
      });

      // Розраховуємо підсумок
      const summary = PricingCalculator.calculateBulkPrice(results);

      const bulkResult: BulkCalculationResult = {
        results,
        summary,
        errors,
      };

      return {
        success: errors.length === 0,
        data: bulkResult,
        errors: errors.length > 0 ? { calculation: errors } : undefined,
      };
    } catch (error) {
      return {
        success: false,
        errors: {
          general: error instanceof Error ? error.message : 'Невідома помилка',
        },
      };
    }
  }

  /**
   * Порівнює ціни з різними наборами модифікаторів
   */
  static comparePriceOptions(
    params: PriceCalculationParams,
    modifierSets: PriceModifier[][]
  ): PricingOperationResult {
    try {
      const comparisons = PricingCalculator.comparePrices(params, modifierSets);

      // Знаходимо найкращий варіант
      const bestOption = comparisons.find((comp) => comp.isOptimal);
      const recommendation = {
        bestSetIndex: bestOption?.setIndex || 0,
        savings: Math.max(...comparisons.map((comp) => comp.savings)),
        reasoning: this.generateRecommendationReasoning(comparisons),
      };

      const comparisonResult: PriceComparisonResult = {
        comparisons,
        recommendation,
      };

      return {
        success: true,
        data: comparisonResult,
      };
    } catch (error) {
      return {
        success: false,
        errors: {
          general: error instanceof Error ? error.message : 'Невідома помилка',
        },
      };
    }
  }

  // === ОПЕРАЦІЇ З МОДИФІКАТОРАМИ ===

  /**
   * Отримує модифікатори, застосовні до предмета
   */
  static getApplicableModifiers(
    item: PriceListItem,
    allModifiers: PriceModifier[]
  ): PriceModifier[] {
    return PricingUtils.getApplicableModifiers(item, allModifiers);
  }

  /**
   * Отримує рекомендовані модифікатори для предмета
   */
  static getRecommendedModifiers(
    item: PriceListItem,
    params: PriceCalculationParams,
    allModifiers: PriceModifier[]
  ): PriceModifier[] {
    const applicableModifiers = this.getApplicableModifiers(item, allModifiers);

    // Логіка рекомендацій на основі характеристик предмета
    return applicableModifiers.filter((modifier) => {
      // Рекомендуємо модифікатори на основі параметрів
      if (params.urgencyLevel && params.urgencyLevel !== 'standard') {
        return modifier.code.includes('urgent') || modifier.code.includes('терміново');
      }

      if (params.materialType) {
        return (
          !modifier.materialTypes ||
          modifier.materialTypes.length === 0 ||
          modifier.materialTypes.includes(params.materialType)
        );
      }

      return modifier.priority <= 10; // Високоприоритетні модифікатори
    });
  }

  // === УТИЛІТИ ===

  /**
   * Генерує унікальний номер для елемента прайс-листа
   */
  static generateItemNumber(
    category: ServiceCategory,
    existingItems: PriceListItem[] = []
  ): string {
    const existingNumbers = existingItems.map((item) => item.itemNumber);
    return PricingUtils.generateItemNumber(category, existingNumbers);
  }

  /**
   * Розраховує статистику цін
   */
  static calculateStatistics(
    items: PriceListItem[],
    modifiers: PriceModifier[] = []
  ): PricingStatistics {
    return PricingUtils.calculatePricingStatistics(items, modifiers);
  }

  // === ЕКСПОРТ/ІМПОРТ ===

  /**
   * Експортує прайс-лист
   */
  static exportPriceList(
    items: PriceListItem[],
    format: 'csv' | 'json' = 'csv'
  ): PricingOperationResult {
    try {
      let exportData: string;

      switch (format) {
        case 'csv':
          exportData = PricingUtils.exportToCsv(items);
          break;
        case 'json':
          exportData = JSON.stringify(items, null, 2);
          break;
        default:
          throw new Error('Непідтримуваний формат експорту');
      }

      return {
        success: true,
        data: exportData,
      };
    } catch (error) {
      return {
        success: false,
        errors: {
          general: error instanceof Error ? error.message : 'Невідома помилка',
        },
      };
    }
  }

  /**
   * Імпортує прайс-лист з CSV
   */
  static importPriceListFromCsv(csvContent: string): PricingOperationResult {
    try {
      const parsedItems = PricingUtils.parseFromCsv(csvContent);

      if (parsedItems.length === 0) {
        return {
          success: false,
          errors: {
            general: 'Не знайдено валідних елементів для імпорту',
          },
        };
      }

      return {
        success: true,
        data: parsedItems,
        metadata: {
          itemsProcessed: parsedItems.length,
        },
      };
    } catch (error) {
      return {
        success: false,
        errors: {
          general: error instanceof Error ? error.message : 'Невідома помилка',
        },
      };
    }
  }

  // === ПРИВАТНІ МЕТОДИ ===

  /**
   * Генерує унікальний ID
   */
  private static generateId(): string {
    return `pricing_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Генерує обгрунтування рекомендації
   */
  private static generateRecommendationReasoning(
    comparisons: Array<{
      setIndex: number;
      result: PriceCalculationResult;
      savings: number;
      isOptimal: boolean;
    }>
  ): string {
    const bestOption = comparisons.find((comp) => comp.isOptimal);
    if (!bestOption) {
      return 'Не вдалося визначити оптимальний варіант';
    }

    const savings = Math.max(...comparisons.map((comp) => comp.savings));
    if (savings > 0) {
      return `Оптимальний варіант заощаджує ${savings.toFixed(2)} грн порівняно з іншими опціями`;
    }

    return 'Рекомендований варіант має найкращу ціну серед доступних опцій';
  }
}
