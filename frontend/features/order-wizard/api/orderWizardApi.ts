import { OrderService } from '../types/order-wizard.types';

/**
 * API для роботи з OrderWizard
 */
export const orderWizardApi = {
  /**
   * Створити нове замовлення
   */
  async createOrder(orderData: {
    clientId: string;
    services: {
      serviceCategoryId: string;
      priceListItemId: string;
      quantity: number;
      params?: Record<string, string | number | boolean>;
      notes?: string;
    }[];
    receptionPoint: string;
    expectedCompletionDate: string;
    urgencyType: string;
    discountType: string;
    customDiscountPercentage?: number;
    paymentMethod: string;
    amountPaid: number;
    notes?: string;
    clientRequirements?: string;
    uniqueTag?: string; 
  }) {
    try {
      const response = await fetch('/api/order-wizard/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Помилка при створенні замовлення');
      }

      return response.json();
    } catch (error) {
      console.error('Помилка при створенні замовлення:', error);
      throw error;
    }
  },

  /**
   * Розрахувати вартість послуг
   */
  async calculateServicesPrice(services: OrderService[]) {
    try {
      const response = await fetch('/api/order-wizard/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ services }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Помилка при розрахунку вартості послуг');
      }

      return response.json();
    } catch (error) {
      console.error('Помилка при розрахунку вартості послуг:', error);
      throw error;
    }
  },
  
  /**
   * Отримати доступні типи знижок
   */
  async getDiscountTypes() {
    try {
      const response = await fetch('/api/order-wizard/discount-types');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Помилка при отриманні типів знижок');
      }
      
      return response.json();
    } catch (error) {
      console.error('Помилка при отриманні типів знижок:', error);
      throw error;
    }
  },
  
  /**
   * Отримати типи терміновості
   */
  async getUrgencyTypes() {
    try {
      const response = await fetch('/api/order-wizard/urgency-types');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Помилка при отриманні типів терміновості');
      }
      
      return response.json();
    } catch (error) {
      console.error('Помилка при отриманні типів терміновості:', error);
      throw error;
    }
  }
};
