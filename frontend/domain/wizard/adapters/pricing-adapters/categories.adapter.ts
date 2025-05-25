/**
 * @fileoverview Адаптер операцій з категоріями послуг
 * @module domain/wizard/adapters/pricing-adapters
 */

import {
  PricingCategoriesService,
  PricingPriceListService,
  PricingOrderWizardSupportService,
} from '@/lib/api';

import { PricingMappingAdapter } from './mapping.adapter';

import type { ServiceCategory, PriceListItem } from './mapping.adapter';

/**
 * Адаптер для операцій з категоріями послуг
 *
 * Відповідальність:
 * - Отримання категорій послуг
 * - Робота з прайс-листом
 * - Отримання матеріалів для категорій
 * - Кешування даних категорій
 */
export class PricingCategoriesAdapter {
  /**
   * Отримує всі категорії послуг
   */
  static async getAllCategories(): Promise<ServiceCategory[]> {
    try {
      const apiCategories = await PricingCategoriesService.getAllCategories();
      return PricingMappingAdapter.serviceCategoriesToDomain(apiCategories);
    } catch (error) {
      console.error('Помилка при отриманні категорій послуг:', error);
      return [];
    }
  }

  /**
   * Отримує активні категорії послуг
   */
  static async getActiveCategories(): Promise<ServiceCategory[]> {
    try {
      const apiCategories = await PricingCategoriesService.getActiveCategories();
      return PricingMappingAdapter.serviceCategoriesToDomain(apiCategories);
    } catch (error) {
      console.error('Помилка при отриманні активних категорій:', error);
      return [];
    }
  }

  /**
   * Отримує категорію за кодом
   */
  static async getCategoryByCode(code: string): Promise<ServiceCategory | null> {
    try {
      const apiCategory = await PricingCategoriesService.getCategoryByCode({ code });
      return PricingMappingAdapter.serviceCategoryToDomain(apiCategory);
    } catch (error) {
      console.error(`Помилка при отриманні категорії ${code}:`, error);
      return null;
    }
  }

  /**
   * Отримує категорію за ID
   */
  static async getCategoryById(id: string): Promise<ServiceCategory | null> {
    try {
      const apiCategory = await PricingCategoriesService.getCategoryById({ id });
      return PricingMappingAdapter.serviceCategoryToDomain(apiCategory);
    } catch (error) {
      console.error(`Помилка при отриманні категорії з ID ${id}:`, error);
      return null;
    }
  }

  /**
   * Отримує елементи прайс-листа для категорії
   */
  static async getPriceListItemsForCategory(categoryCode: string): Promise<PriceListItem[]> {
    try {
      const apiItems = await PricingPriceListService.getItemsByCategoryCode({ categoryCode });
      return apiItems.map(PricingMappingAdapter.priceListItemToDomain);
    } catch (error) {
      console.error(`Помилка при отриманні прайс-листа для категорії ${categoryCode}:`, error);
      return [];
    }
  }

  /**
   * Отримує активні елементи прайс-листа для категорії
   */
  static async getActivePriceListItemsForCategory(categoryCode: string): Promise<PriceListItem[]> {
    try {
      const apiItems = await PricingPriceListService.getItemsByCategoryCode({ categoryCode });
      // Фільтруємо активні на клієнті
      return apiItems
        .map(PricingMappingAdapter.priceListItemToDomain)
        .filter((item) => item.active);
    } catch (error) {
      console.error(
        `Помилка при отриманні активного прайс-листа для категорії ${categoryCode}:`,
        error
      );
      return [];
    }
  }

  /**
   * Отримує елемент прайс-листа за ID
   */
  static async getPriceListItemById(itemId: string): Promise<PriceListItem | null> {
    try {
      const apiItem = await PricingPriceListService.getItemById({ itemId });
      return PricingMappingAdapter.priceListItemToDomain(apiItem);
    } catch (error) {
      console.error(`Помилка при отриманні елемента прайс-листа ${itemId}:`, error);
      return null;
    }
  }

  /**
   * Пошук елементів прайс-листа за назвою
   */
  static async searchPriceListItems(
    query: string,
    categoryCode?: string
  ): Promise<PriceListItem[]> {
    try {
      // Отримуємо всі елементи для категорії і фільтруємо на клієнті
      if (categoryCode) {
        const apiItems = await PricingPriceListService.getItemsByCategoryCode({ categoryCode });
        return apiItems
          .map(PricingMappingAdapter.priceListItemToDomain)
          .filter((item) => item.name.toLowerCase().includes(query.toLowerCase()));
      }

      // Якщо немає категорії, повертаємо порожній масив
      return [];
    } catch (error) {
      console.error('Помилка при пошуку елементів прайс-листа:', error);
      return [];
    }
  }

  /**
   * Отримує доступні матеріали для категорії
   */
  static async getMaterialsForCategory(categoryCode: string): Promise<string[]> {
    try {
      return await PricingOrderWizardSupportService.getMaterialsForCategory({ categoryCode });
    } catch (error) {
      console.error(`Помилка при отриманні матеріалів для категорії ${categoryCode}:`, error);
      return [];
    }
  }

  /**
   * Отримує доступні кольори для категорії (заглушка)
   */
  static async getColorsForCategory(categoryCode: string): Promise<string[]> {
    try {
      // TODO: Реалізувати коли API буде доступне
      console.warn(`getColorsForCategory не реалізовано для категорії ${categoryCode}`);
      return ['Чорний', 'Білий', 'Сірий', 'Коричневий', 'Інший'];
    } catch (error) {
      console.error(`Помилка при отриманні кольорів для категорії ${categoryCode}:`, error);
      return [];
    }
  }

  /**
   * Отримує рекомендовану одиницю виміру для предмета (заглушка)
   */
  static async getRecommendedUnitOfMeasure(
    categoryId: string,
    itemName: string
  ): Promise<'шт' | 'кг'> {
    try {
      // TODO: Реалізувати коли API буде доступне
      console.warn(`getRecommendedUnitOfMeasure не реалізовано для ${categoryId}/${itemName}`);
      return 'шт'; // За замовчуванням
    } catch (error) {
      console.error('Помилка при отриманні рекомендованої одиниці виміру:', error);
      return 'шт';
    }
  }

  /**
   * Фільтрує категорії за активністю
   */
  static filterActiveCategories(categories: ServiceCategory[]): ServiceCategory[] {
    return categories.filter((category) => category.active);
  }

  /**
   * Сортує категорії за порядком сортування
   */
  static sortCategoriesByOrder(categories: ServiceCategory[]): ServiceCategory[] {
    return [...categories].sort((a, b) => a.sortOrder - b.sortOrder);
  }

  /**
   * Фільтрує елементи прайс-листа за активністю
   */
  static filterActivePriceListItems(items: PriceListItem[]): PriceListItem[] {
    return items.filter((item) => item.active);
  }

  /**
   * Сортує елементи прайс-листа за номером каталогу
   */
  static sortPriceListItemsByOrder(items: PriceListItem[]): PriceListItem[] {
    return [...items].sort((a, b) => a.catalogNumber - b.catalogNumber);
  }

  /**
   * Групує елементи прайс-листа за категоріями
   */
  static groupPriceListItemsByCategory(items: PriceListItem[]): Record<string, PriceListItem[]> {
    return items.reduce(
      (groups, item) => {
        const categoryId = item.categoryId;
        if (!groups[categoryId]) {
          groups[categoryId] = [];
        }
        groups[categoryId].push(item);
        return groups;
      },
      {} as Record<string, PriceListItem[]>
    );
  }

  /**
   * Знаходить найдешевший елемент у категорії
   */
  static findCheapestItemInCategory(items: PriceListItem[]): PriceListItem | null {
    if (items.length === 0) return null;
    return items.reduce((cheapest, current) =>
      current.basePrice < cheapest.basePrice ? current : cheapest
    );
  }

  /**
   * Знаходить найдорожчий елемент у категорії
   */
  static findMostExpensiveItemInCategory(items: PriceListItem[]): PriceListItem | null {
    if (items.length === 0) return null;
    return items.reduce((expensive, current) =>
      current.basePrice > expensive.basePrice ? current : expensive
    );
  }

  /**
   * Обчислює середню ціну в категорії
   */
  static calculateAveragePriceInCategory(items: PriceListItem[]): number {
    if (items.length === 0) return 0;
    const total = items.reduce((sum, item) => sum + item.basePrice, 0);
    return total / items.length;
  }
}
