import { ServiceCategory, PriceListItem } from '../types';

/**
 * API для роботи з прайс-листом
 */
export const priceListApi = {
  /**
   * Отримати всі категорії прайс-листа
   */
  async getCategories(): Promise<ServiceCategory[]> {
    const response = await fetch('/api/price-list');
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Помилка завантаження прайс-листа');
    }
    
    const data = await response.json();
    
    // Логуємо отримані дані для аналізу
    console.log('PriceList API response data structure:', data);
    
    // Якщо є категорії з елементами, логуємо перший елемент для перевірки структури
    if (data && Array.isArray(data) && data.length > 0) {
      if (data[0].items && data[0].items.length > 0) {
        console.log('First price list item structure:', data[0].items[0]);
      }
    }
    
    return data;
  },
  
  /**
   * Отримати категорію прайс-листа за ID
   */
  async getCategoryById(categoryId: string): Promise<ServiceCategory> {
    const response = await fetch(`/api/price-list/${categoryId}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Помилка завантаження категорії прайс-листа');
    }
    
    return response.json();
  },
  
  /**
   * Створити нову категорію послуг
   */
  async createCategory(category: Partial<ServiceCategory>): Promise<ServiceCategory> {
    const response = await fetch('/api/price-list/category', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(category),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Помилка при створенні категорії');
    }

    return response.json();
  },
  
  /**
   * Оновити категорію послуг
   */
  async updateCategory(categoryId: string, category: Partial<ServiceCategory>): Promise<ServiceCategory> {
    const response = await fetch(`/api/price-list/category/${categoryId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(category),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Помилка при оновленні категорії');
    }

    return response.json();
  },
  
  /**
   * Створити новий елемент прайс-листа
   */
  async createPriceListItem(categoryId: string, item: Partial<PriceListItem>): Promise<PriceListItem> {
    const response = await fetch(`/api/price-list/${categoryId}/item`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Помилка при створенні елемента прайс-листа');
    }

    return response.json();
  },
  
  /**
   * Оновити елемент прайс-листа
   */
  async updatePriceListItem(itemId: string, item: Partial<PriceListItem>): Promise<PriceListItem> {
    const response = await fetch(`/api/price-list/item/${itemId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Помилка при оновленні елемента прайс-листа');
    }

    return response.json();
  }
};
