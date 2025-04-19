import { ServiceCategory } from '../types';

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
    
    return response.json();
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
  }
};
