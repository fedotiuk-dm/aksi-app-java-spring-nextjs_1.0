/**
 * @fileoverview Сервіс для завантаження основної інформації про предмет
 * @module domain/wizard/services/stage-3-item-management/basic-info/services/basic-info-loader
 */

import {
  getPriceListItemById,
  getPriceListItemsByCategory,
  searchPriceListItems
} from '../../../../adapters/pricing/api';
import {
  getAllServiceCategories,
  getServiceCategoryByCode
} from '../../../../adapters/pricing/api';
import {
  WizardServiceCategory,
  WizardPriceListItem
} from '../../../../adapters/pricing/types';
import {
  IBasicInfoLoaderService
} from '../interfaces';
import {
  ServiceCategory,
  PriceListItem,
  BasicInfoOperationResult,
  BasicInfoFilters
} from '../types/basic-info.types';

/** Константа для невідомої помилки */
const UNKNOWN_ERROR = 'Невідома помилка при отриманні даних';

/** Константи для типів з обмеженими варіантами */
const DEFAULT_PROCESSING_DAYS = 3;
const DEFAULT_DELIVERY_DAYS = 3;

/**
 * Сервіс для завантаження даних основної інформації про предмет
 * @implements IBasicInfoLoaderService
 */
export class BasicInfoLoaderService implements IBasicInfoLoaderService {
  // Кеш для категорій
  private categoriesCache: ServiceCategory[] | null = null;
  // Кеш для прайс-листів за категоріями
  private priceListCache: Record<string, PriceListItem[]> = {};

  /**
   * Отримання списку категорій послуг
   */
  async loadServiceCategories(): Promise<BasicInfoOperationResult<ServiceCategory[]>> {
    try {
      // Повертаємо дані з кешу, якщо вони є
      if (this.categoriesCache) {
        return {
          success: true,
          data: this.categoriesCache
        };
      }

      // Отримуємо дані через адаптер
      const response = await getAllServiceCategories();

      if (!response.success || !response.data) {
        return {
          success: false,
          error: response.error || 'Не вдалося отримати категорії послуг'
        };
      }

      // Маппінг даних від API до доменної моделі
      const categories: ServiceCategory[] = response.data.map((cat: WizardServiceCategory) => ({
        id: cat.id || '',
        code: cat.code || '',
        name: cat.name || '',
        description: cat.description,
        active: cat.isActive,
        sortOrder: cat.sortOrder,
        standardProcessingDays: DEFAULT_PROCESSING_DAYS,
        unitOfMeasure: (cat.defaultUnit === 'kg' || cat.defaultUnit === 'KG') ? 'kg' : 'pieces',
        standardDeliveryDays: DEFAULT_DELIVERY_DAYS
      }));

      // Зберігаємо в кеш
      this.categoriesCache = categories;

      return {
        success: true,
        data: categories
      };
    } catch (error) {
      console.error('Помилка при завантаженні категорій:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : UNKNOWN_ERROR
      };
    }
  }

  /**
   * Отримання прайс-листа для вибраної категорії
   * @param categoryId Ідентифікатор категорії
   */
  async loadPriceListByCategory(categoryId: string): Promise<BasicInfoOperationResult<PriceListItem[]>> {
    try {
      // Повертаємо дані з кешу, якщо вони є
      if (this.priceListCache[categoryId]) {
        return {
          success: true,
          data: this.priceListCache[categoryId]
        };
      }

      // Отримуємо категорію для отримання коду категорії
      let categoryCode = '';
      if (this.categoriesCache) {
        const category = this.categoriesCache.find(cat => cat.id === categoryId);
        categoryCode = category?.code || '';
      } else {
        const categoriesResult = await this.loadServiceCategories();
        if (categoriesResult.success && categoriesResult.data) {
          const category = categoriesResult.data.find(cat => cat.id === categoryId);
          categoryCode = category?.code || '';
        }
      }

      if (!categoryCode) {
        return {
          success: false,
          error: `Категорію з ID ${categoryId} не знайдено`
        };
      }

      // Отримуємо дані через адаптер
      const response = await getPriceListItemsByCategory(categoryCode);

      if (!response.success || !response.data) {
        return {
          success: false,
          error: response.error || 'Не вдалося отримати прайс-лист'
        };
      }

      // Маппінг даних від API до доменної моделі
      const priceList: PriceListItem[] = response.data.map((item: WizardPriceListItem) => ({
        id: item.id || '',
        categoryId: item.categoryId || '',
        catalogNumber: Number(item.itemNumber) || undefined,
        name: item.name || '',
        unitOfMeasure: item.unitOfMeasure || 'pieces',
        basePrice: item.basePrice || 0,
        priceBlack: item.basePrice, // Використовуємо basePrice якщо немає окремої ціни
        priceColor: item.basePrice, // Використовуємо basePrice якщо немає окремої ціни
        active: item.isActive || false,
        categoryCode: item.categoryCode || ''
      }));

      // Зберігаємо в кеш
      this.priceListCache[categoryId] = priceList;

      return {
        success: true,
        data: priceList
      };
    } catch (error) {
      console.error('Помилка при завантаженні прайс-листа:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : UNKNOWN_ERROR
      };
    }
  }

  /**
   * Отримання елемента прайс-листа за ідентифікатором
   * @param itemId Ідентифікатор елемента прайс-листа
   */
  async getPriceListItem(itemId: string): Promise<BasicInfoOperationResult<PriceListItem>> {
    try {
      // Спочатку перевіряємо наявність елемента в кеші
      for (const categoryId in this.priceListCache) {
        const item = this.priceListCache[categoryId].find(item => item.id === itemId);
        if (item) {
          return {
            success: true,
            data: item
          };
        }
      }

      // Якщо елемент не знайдено в кеші, отримуємо його через адаптер
      const response = await getPriceListItemById(itemId);

      if (!response.success || !response.data) {
        return {
          success: false,
          error: `Елемент прайс-листа з ID ${itemId} не знайдено`
        };
      }

      // Якщо категорія не вказана, отримуємо її за categoryCode
      let categoryId = response.data.categoryId || '';

      // Якщо categoryId все ще не отримано, спробуємо отримати через categoryCode
      if (!categoryId && response.data.categoryCode) {
        const categoryResponse = await getServiceCategoryByCode(response.data.categoryCode);
        if (categoryResponse.success && categoryResponse.data) {
          categoryId = categoryResponse.data.id;
        }
      }

      // Маппінг даних від API до доменної моделі
      const priceListItem: PriceListItem = {
        id: response.data.id || '',
        categoryId: categoryId,
        catalogNumber: Number(response.data.itemNumber) || undefined,
        name: response.data.name || '',
        unitOfMeasure: response.data.unitOfMeasure || 'pieces',
        basePrice: response.data.basePrice || 0,
        priceBlack: response.data.basePrice, // Використовуємо basePrice якщо немає окремої ціни
        priceColor: response.data.basePrice, // Використовуємо basePrice якщо немає окремої ціни
        active: response.data.isActive || false,
        categoryCode: response.data.categoryCode || ''
      };

      return {
        success: true,
        data: priceListItem
      };
    } catch (error) {
      console.error('Помилка при отриманні елемента прайс-листа:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : UNKNOWN_ERROR
      };
    }
  }

  /**
   * Пошук елементів прайс-листа за фільтрами
   * @param filters Фільтри для пошуку
   */
  async searchPriceList(filters: BasicInfoFilters): Promise<BasicInfoOperationResult<PriceListItem[]>> {
    try {
      // Якщо вказано categoryCode, шукаємо в кеші за цією категорією
      if (filters.categoryCode && this.priceListCache[filters.categoryCode]) {
        const cachedItems = this.priceListCache[filters.categoryCode];
        const filteredItems = this.filterPriceListItems(cachedItems, filters);

        return {
          success: true,
          data: filteredItems
        };
      }

      // Якщо не знайдено в кеші або не вказано categoryCode, виконуємо пошук через API
      const apiFilters: Record<string, any> = {};

      if (filters.categoryCode) {
        apiFilters.categoryCode = filters.categoryCode;
      }

      if (filters.searchTerm) {
        apiFilters.searchTerm = filters.searchTerm;
      }

      if (filters.unitOfMeasure) {
        apiFilters.unitOfMeasure = filters.unitOfMeasure.toUpperCase();
      }

      if (filters.priceRange && typeof filters.priceRange.min === 'number' && typeof filters.priceRange.max === 'number') {
        apiFilters.minPrice = filters.priceRange.min;
        apiFilters.maxPrice = filters.priceRange.max;
      }

      // Виконуємо пошук через адаптер
      const response = await searchPriceListItems(apiFilters);

      if (!response.success || !response.data) {
        return {
          success: false,
          error: response.error || 'Не вдалося виконати пошук у прайс-листі'
        };
      }

      // Маппінг даних від API до доменної моделі
      const priceList: PriceListItem[] = response.data.items.map((item: WizardPriceListItem) => ({
        id: item.id || '',
        categoryId: item.categoryId || '',
        catalogNumber: Number(item.itemNumber) || undefined,
        name: item.name || '',
        unitOfMeasure: item.unitOfMeasure || 'pieces',
        basePrice: item.basePrice || 0,
        priceBlack: item.basePrice, // Використовуємо basePrice якщо немає окремої ціни
        priceColor: item.basePrice, // Використовуємо basePrice якщо немає окремої ціни
        active: item.isActive || false,
        categoryCode: item.categoryCode || ''
      }));

      return {
        success: true,
        data: priceList
      };
    } catch (error) {
      console.error('Помилка при пошуку в прайс-листі:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : UNKNOWN_ERROR
      };
    }
  }

  /**
   * Допоміжний метод для фільтрації елементів прайс-листа
   * @param items Елементи прайс-листа
   * @param filters Фільтри для пошуку
   */
  private filterPriceListItems(items: PriceListItem[], filters: BasicInfoFilters): PriceListItem[] {
    let filteredItems = [...items];

    // Фільтрація за пошуковим терміном
    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
      filteredItems = filteredItems.filter(item =>
        item.name.toLowerCase().includes(searchTerm) ||
        (item.catalogNumber?.toString() || '').includes(searchTerm)
      );
    }

    // Фільтрація за одиницею виміру
    if (filters.unitOfMeasure) {
      filteredItems = filteredItems.filter(item =>
        item.unitOfMeasure === filters.unitOfMeasure
      );
    }

    // Фільтрація за ціновим діапазоном
    if (filters.priceRange && typeof filters.priceRange.min === 'number' && typeof filters.priceRange.max === 'number') {
      filteredItems = filteredItems.filter(item =>
        item.basePrice >= filters.priceRange!.min &&
        item.basePrice <= filters.priceRange!.max
      );
    }

    return filteredItems;
  }
}
