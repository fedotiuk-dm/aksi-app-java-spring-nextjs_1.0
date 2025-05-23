/**
 * Утиліти для Pricing домену
 * Допоміжні функції для роботи з цінами, прайс-листами та модифікаторами
 */

import { ServiceCategory, UnitOfMeasure } from '../types';

import type {
  PriceListItem,
  PriceModifier,
  ServiceCategoryInfo,
  PriceSearchParams,
  PriceSearchResult,
  PricingStatistics,
  PriceCalculationResult,
} from '../types';

export class PricingUtils {
  /**
   * Фільтрує елементи прайс-листа за параметрами пошуку
   */
  static filterPriceListItems(items: PriceListItem[], params: PriceSearchParams): PriceListItem[] {
    return items.filter((item) => {
      return (
        this.matchesActiveFilter(item, params) &&
        this.matchesCategoryFilter(item, params) &&
        this.matchesUnitFilter(item, params) &&
        this.matchesPriceRangeFilter(item, params) &&
        this.matchesItemNumbersFilter(item, params) &&
        this.matchesTagsFilter(item, params) &&
        this.matchesKeywordFilter(item, params)
      );
    });
  }

  /**
   * Перевіряє фільтр за активністю
   */
  private static matchesActiveFilter(item: PriceListItem, params: PriceSearchParams): boolean {
    return params.isActive === undefined || item.isActive === params.isActive;
  }

  /**
   * Перевіряє фільтр за категорією
   */
  private static matchesCategoryFilter(item: PriceListItem, params: PriceSearchParams): boolean {
    if (params.category && item.category !== params.category) {
      return false;
    }

    if (params.categories && params.categories.length > 0) {
      return params.categories.includes(item.category);
    }

    return true;
  }

  /**
   * Перевіряє фільтр за одиницею виміру
   */
  private static matchesUnitFilter(item: PriceListItem, params: PriceSearchParams): boolean {
    return !params.unitOfMeasure || item.unitOfMeasure === params.unitOfMeasure;
  }

  /**
   * Перевіряє фільтр за ціновим діапазоном
   */
  private static matchesPriceRangeFilter(item: PriceListItem, params: PriceSearchParams): boolean {
    const minPriceCheck = params.minPrice === undefined || item.basePrice >= params.minPrice;
    const maxPriceCheck = params.maxPrice === undefined || item.basePrice <= params.maxPrice;

    return minPriceCheck && maxPriceCheck;
  }

  /**
   * Перевіряє фільтр за номерами
   */
  private static matchesItemNumbersFilter(item: PriceListItem, params: PriceSearchParams): boolean {
    return (
      !params.itemNumbers ||
      params.itemNumbers.length === 0 ||
      params.itemNumbers.includes(item.itemNumber)
    );
  }

  /**
   * Перевіряє фільтр за тегами
   */
  private static matchesTagsFilter(item: PriceListItem, params: PriceSearchParams): boolean {
    if (params.tags && params.tags.length > 0) {
      const itemTags = item.tags || [];
      const hasMatchingTag = params.tags.some((tag) =>
        itemTags.some((itemTag) => itemTag.toLowerCase().includes(tag.toLowerCase()))
      );
      if (!hasMatchingTag) {
        return false;
      }
    }
    return true;
  }

  /**
   * Перевіряє фільтр за ключовим словом
   */
  private static matchesKeywordFilter(item: PriceListItem, params: PriceSearchParams): boolean {
    if (params.keyword && params.keyword.trim().length > 0) {
      const keyword = params.keyword.toLowerCase();
      const searchFields = [
        item.name,
        item.description,
        item.itemNumber,
        ...(item.keywords || []),
        ...(item.tags || []),
      ];

      const hasMatch = searchFields.some((field) => field && field.toLowerCase().includes(keyword));

      if (!hasMatch) {
        return false;
      }
    }
    return true;
  }

  /**
   * Сортує елементи прайс-листа
   */
  static sortPriceListItems(
    items: PriceListItem[],
    sortBy: 'name' | 'price' | 'category' | 'itemNumber' | 'popularity',
    order: 'asc' | 'desc' = 'asc'
  ): PriceListItem[] {
    return [...items].sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name, 'uk');
          break;

        case 'price':
          comparison = a.basePrice - b.basePrice;
          break;

        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;

        case 'itemNumber':
          comparison = a.itemNumber.localeCompare(b.itemNumber);
          break;

        case 'popularity':
          // Тут можна додати логіку на основі статистики використання
          comparison = 0;
          break;

        default:
          comparison = 0;
      }

      return order === 'desc' ? -comparison : comparison;
    });
  }

  /**
   * Групує елементи прайс-листа за категоріями
   */
  static groupPriceListItemsByCategory(
    items: PriceListItem[]
  ): Record<ServiceCategory, PriceListItem[]> {
    const grouped = {} as Record<ServiceCategory, PriceListItem[]>;

    // Ініціалізуємо всі категорії
    const categories = Object.values(ServiceCategory) as ServiceCategory[];
    categories.forEach((category) => {
      grouped[category] = [];
    });

    // Групуємо елементи
    items.forEach((item) => {
      if (!grouped[item.category]) {
        grouped[item.category] = [];
      }
      grouped[item.category].push(item);
    });

    return grouped;
  }

  /**
   * Групує елементи за одиницею виміру
   */
  static groupPriceListItemsByUnit(items: PriceListItem[]): Record<UnitOfMeasure, PriceListItem[]> {
    const grouped = {} as Record<UnitOfMeasure, PriceListItem[]>;

    // Ініціалізуємо всі одиниці
    const units = Object.values(UnitOfMeasure) as UnitOfMeasure[];
    units.forEach((unit) => {
      grouped[unit] = [];
    });

    // Групуємо елементи
    items.forEach((item) => {
      if (!grouped[item.unitOfMeasure]) {
        grouped[item.unitOfMeasure] = [];
      }
      grouped[item.unitOfMeasure].push(item);
    });

    return grouped;
  }

  /**
   * Знаходить подібні елементи прайс-листа
   */
  static findSimilarItems(
    targetItem: PriceListItem,
    allItems: PriceListItem[],
    maxResults: number = 5
  ): PriceListItem[] {
    return allItems
      .filter((item) => item.id !== targetItem.id)
      .map((item) => ({
        item,
        similarity: this.calculateItemSimilarity(targetItem, item),
      }))
      .filter((pair) => pair.similarity > 0.3) // Мінімальна схожість 30%
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, maxResults)
      .map((pair) => pair.item);
  }

  /**
   * Розраховує схожість між елементами прайс-листа
   */
  private static calculateItemSimilarity(item1: PriceListItem, item2: PriceListItem): number {
    let score = 0;
    let factors = 0;

    // Категорія (вага 30%)
    if (item1.category === item2.category) {
      score += 0.3;
    }
    factors += 0.3;

    // Одиниця виміру (вага 20%)
    if (item1.unitOfMeasure === item2.unitOfMeasure) {
      score += 0.2;
    }
    factors += 0.2;

    // Ціновий діапазон (вага 25%)
    const priceDiff = Math.abs(item1.basePrice - item2.basePrice);
    const maxPrice = Math.max(item1.basePrice, item2.basePrice);
    if (maxPrice > 0) {
      const priceScore = Math.max(0, 1 - priceDiff / maxPrice) * 0.25;
      score += priceScore;
    }
    factors += 0.25;

    // Схожість назв (вага 25%)
    const nameScore = this.calculateStringSimilarity(item1.name, item2.name) * 0.25;
    score += nameScore;
    factors += 0.25;

    return factors > 0 ? score / factors : 0;
  }

  /**
   * Розраховує схожість між рядками
   */
  private static calculateStringSimilarity(str1: string, str2: string): number {
    const a = str1.toLowerCase();
    const b = str2.toLowerCase();

    if (a === b) return 1;

    const maxLength = Math.max(a.length, b.length);
    if (maxLength === 0) return 1;

    // Простий алгоритм Левенштейна
    const distance = this.levenshteinDistance(a, b);
    return 1 - distance / maxLength;
  }

  /**
   * Розраховує відстань Левенштейна
   */
  private static levenshteinDistance(a: string, b: string): number {
    const matrix = [];

    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    return matrix[b.length][a.length];
  }

  /**
   * Розраховує статистику цін
   */
  static calculatePricingStatistics(
    items: PriceListItem[],
    modifiers: PriceModifier[] = []
  ): PricingStatistics {
    const activeItems = items.filter((item) => item.isActive);

    // Розподіл за категоріями
    const categories = Object.values(ServiceCategory) as ServiceCategory[];
    const categoryStats = categories.map((category) => {
      const categoryItems = activeItems.filter((item) => item.category === category);
      const prices = categoryItems.map((item) => item.basePrice);

      return {
        category,
        minPrice: prices.length > 0 ? Math.min(...prices) : 0,
        maxPrice: prices.length > 0 ? Math.max(...prices) : 0,
        averagePrice: prices.length > 0 ? prices.reduce((a, b) => a + b, 0) / prices.length : 0,
        itemsCount: categoryItems.length,
      };
    });

    // Популярні послуги (тут можна додати логіку на основі статистики)
    const popularItems = activeItems.slice(0, 10).map((item) => ({
      itemId: item.id || item.itemNumber,
      name: item.name,
      usageCount: 0, // Буде заповнено з реальної статистики
      averagePrice: item.basePrice,
    }));

    // Статистика модифікаторів
    const modifierUsage = modifiers
      .filter((mod) => mod.isActive)
      .map((modifier) => ({
        modifierId: modifier.id,
        name: modifier.name,
        applicationCount: 0, // Буде заповнено з реальної статистики
        totalImpact: 0, // Буде заповнено з реальної статистики
      }));

    return {
      totalItems: items.length,
      activeItems: activeItems.length,
      categoriesCount: new Set(activeItems.map((item) => item.category)).size,
      modifiersCount: modifiers.filter((mod) => mod.isActive).length,
      priceDistribution: categoryStats,
      popularItems,
      modifierUsage,
      calculatedAt: new Date(),
    };
  }

  /**
   * Знаходить модифікатори для елемента прайс-листа
   */
  static getApplicableModifiers(
    item: PriceListItem,
    allModifiers: PriceModifier[]
  ): PriceModifier[] {
    return allModifiers.filter((modifier) => {
      if (!modifier.isActive) return false;

      // Перевіряємо дати дії
      const now = new Date();
      if (modifier.validFrom && modifier.validFrom > now) return false;
      if (modifier.validUntil && modifier.validUntil < now) return false;

      // Перевіряємо категорії
      return modifier.applicableCategories.includes(item.category);
    });
  }

  /**
   * Форматує ціну для відображення
   */
  static formatPrice(price: number, currency: string = 'UAH', locale: string = 'uk-UA'): string {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  }

  /**
   * Форматує одиницю виміру для відображення
   */
  static formatUnitOfMeasure(unit: UnitOfMeasure): string {
    const unitNames: Record<UnitOfMeasure, string> = {
      [UnitOfMeasure.PIECE]: 'шт.',
      [UnitOfMeasure.KILOGRAM]: 'кг',
      [UnitOfMeasure.SQUARE_METER]: 'кв.м',
      [UnitOfMeasure.LINEAR_METER]: 'п.м',
    };

    return unitNames[unit] || unit;
  }

  /**
   * Форматує назву категорії для відображення
   */
  static formatCategoryName(category: ServiceCategory): string {
    const categoryNames: Record<ServiceCategory, string> = {
      [ServiceCategory.CLOTHING_CLEANING]: 'Чистка одягу та текстилю',
      [ServiceCategory.LAUNDRY]: 'Прання білизни',
      [ServiceCategory.IRONING]: 'Прасування',
      [ServiceCategory.LEATHER_CLEANING]: 'Чистка та відновлення шкіряних виробів',
      [ServiceCategory.SHEEPSKIN_COATS]: 'Дублянки',
      [ServiceCategory.FUR_PRODUCTS]: 'Вироби із натурального хутра',
      [ServiceCategory.TEXTILE_DYEING]: 'Фарбування текстильних виробів',
    };

    return categoryNames[category] || category;
  }

  /**
   * Створює пошуковий результат
   */
  static createSearchResult(
    allItems: PriceListItem[],
    filteredItems: PriceListItem[],
    categories: ServiceCategoryInfo[]
  ): PriceSearchResult {
    // Ціновий діапазон
    const prices = filteredItems.map((item) => item.basePrice);
    const priceRange = {
      min: prices.length > 0 ? Math.min(...prices) : 0,
      max: prices.length > 0 ? Math.max(...prices) : 0,
      average: prices.length > 0 ? prices.reduce((a, b) => a + b, 0) / prices.length : 0,
    };

    return {
      items: filteredItems,
      totalCount: allItems.length,
      filteredCount: filteredItems.length,
      categories,
      priceRange,
      hasMore: false, // Для пагінації в майбутньому
    };
  }

  /**
   * Валідує номер елемента прайс-листа
   */
  static validateItemNumber(itemNumber: string): boolean {
    // Перевіряємо формат: літери та цифри, довжина 3-20 символів
    const pattern = /^[A-Za-z0-9\-\.]{3,20}$/;
    return pattern.test(itemNumber);
  }

  /**
   * Генерує унікальний номер для елемента прайс-листа
   */
  static generateItemNumber(category: ServiceCategory, existingNumbers: string[]): string {
    const categoryPrefixes: Record<ServiceCategory, string> = {
      [ServiceCategory.CLOTHING_CLEANING]: 'CL',
      [ServiceCategory.LAUNDRY]: 'LA',
      [ServiceCategory.IRONING]: 'IR',
      [ServiceCategory.LEATHER_CLEANING]: 'LE',
      [ServiceCategory.SHEEPSKIN_COATS]: 'SH',
      [ServiceCategory.FUR_PRODUCTS]: 'FU',
      [ServiceCategory.TEXTILE_DYEING]: 'DY',
    };

    const prefix = categoryPrefixes[category] || 'XX';
    let counter = 1;
    let itemNumber: string;

    do {
      itemNumber = `${prefix}-${counter.toString().padStart(4, '0')}`;
      counter++;
    } while (existingNumbers.includes(itemNumber));

    return itemNumber;
  }

  /**
   * Експортує прайс-лист у CSV формат
   */
  static exportToCsv(items: PriceListItem[]): string {
    const headers = [
      'Номер',
      'Назва',
      'Категорія',
      'Базова ціна',
      'Одиниця виміру',
      'Активний',
      'Опис',
    ];

    const rows = items.map((item) => [
      item.itemNumber,
      item.name,
      this.formatCategoryName(item.category),
      item.basePrice.toString(),
      this.formatUnitOfMeasure(item.unitOfMeasure),
      item.isActive ? 'Так' : 'Ні',
      item.description || '',
    ]);

    return [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');
  }

  /**
   * Парсить CSV дані для імпорту прайс-листа
   */
  static parseFromCsv(csvContent: string): Partial<PriceListItem>[] {
    const lines = csvContent.split('\n').filter((line) => line.trim());
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map((h) => h.replace(/"/g, '').trim());
    const items: Partial<PriceListItem>[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map((v) => v.replace(/"/g, '').trim());

      if (values.length >= headers.length) {
        const item: Partial<PriceListItem> = {
          itemNumber: values[0],
          name: values[1],
          basePrice: parseFloat(values[3]) || 0,
          isActive: values[5]?.toLowerCase() === 'так',
          description: values[6] || undefined,
        };

        items.push(item);
      }
    }

    return items;
  }
}
