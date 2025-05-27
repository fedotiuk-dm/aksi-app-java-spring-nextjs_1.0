/**
 * @fileoverview Сервіс для операцій з предметами у Item Wizard
 * @module domain/wizard/services/stage-3-item-management/item-wizard/services/item-wizard-operations
 */

import { ItemWizardApiService } from './item-wizard-api.service';
import { ItemWizardStateService } from './item-wizard-state.service';
import { WizardOrderItem, WizardOrderItemDetailed } from '../../../../adapters/order/types';
import { IItemWizardValidationService } from '../interfaces/item-wizard.interfaces';
import { ItemOperationResult } from '../types/item-wizard.types';

/** Константа для невідомої помилки */
const UNKNOWN_ERROR = 'Невідома помилка';

/**
 * Сервіс для операцій з предметами
 */
export class ItemWizardOperationsService {
  /**
   * Конструктор сервісу
   * @param stateService Сервіс для управління станом
   * @param apiService Сервіс для API взаємодії
   * @param validationService Сервіс для валідації даних
   */
  constructor(
    private stateService: ItemWizardStateService,
    private apiService: ItemWizardApiService,
    private validationService: IItemWizardValidationService
  ) {}

  /**
   * Збереження поточного предмета
   */
  async saveCurrentItem(): Promise<ItemOperationResult<WizardOrderItem>> {
    try {
      const currentItem = this.stateService.getCurrentItem();
      
      if (!currentItem) {
        return {
          success: false,
          error: 'Немає поточного предмета для збереження'
        };
      }

      // Валідація всіх етапів
      const validationResult = await this.validationService.validateAllSteps(this.stateService.getState());
      
      if (!validationResult.success) {
        return {
          success: false,
          error: validationResult.error,
          validationErrors: validationResult.validationErrors
        };
      }

      // Встановлюємо прапорець завантаження
      this.stateService.setLoading(true);

      // Зберігаємо предмет через API
      let response;
      if (currentItem.id) {
        response = await this.apiService.updateItem(currentItem.id, currentItem);
      } else {
        response = await this.apiService.addItem(currentItem);
      }

      // Знімаємо прапорець завантаження
      this.stateService.setLoading(false);

      if (!response.success) {
        this.stateService.setError(response.error);
        return {
          success: false,
          error: response.error
        };
      }

      // Додаємо предмет до списку, якщо він є
      if (!response.data) {
        return {
          success: false,
          error: 'Не вдалося отримати дані предмета'
        };
      }
      
      this.stateService.addItem(response.data);
      
      // Скидаємо стан до початкового
      this.stateService.resetState();
      
      // Встановлюємо список предметів
      this.stateService.setItems(this.stateService.getItems());

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      this.stateService.setLoading(false);
      this.stateService.setError(error instanceof Error ? error.message : UNKNOWN_ERROR);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : UNKNOWN_ERROR
      };
    }
  }

  /**
   * Скасування додавання поточного предмета
   */
  async cancelCurrentItem(): Promise<ItemOperationResult<void>> {
    try {
      // Скидаємо стан до початкового
      this.stateService.resetState();
      
      // Встановлюємо список предметів
      this.stateService.setItems(this.stateService.getItems());

      return {
        success: true
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : UNKNOWN_ERROR
      };
    }
  }

  /**
   * Завантаження всіх предметів
   */
  async loadAllItems(): Promise<ItemOperationResult<WizardOrderItem[]>> {
    try {
      this.stateService.setLoading(true);
      
      // Отримуємо предмети через API
      const response = await this.apiService.getAllItems();
      
      this.stateService.setLoading(false);
      
      if (!response.success) {
        return {
          success: false,
          error: response.error
        };
      }

      // Встановлюємо список предметів
      this.stateService.setItems(response.data || []);

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      this.stateService.setLoading(false);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : UNKNOWN_ERROR
      };
    }
  }

  /**
   * Отримання детальної інформації про предмет за його ID
   * @param itemId ID предмета
   */
  async getItemDetails(itemId: string): Promise<ItemOperationResult<WizardOrderItemDetailed>> {
    try {
      this.stateService.setLoading(true);
      
      const response = await this.apiService.getItemById(itemId);
      
      this.stateService.setLoading(false);
      
      if (!response.success) {
        return {
          success: false,
          error: response.error
        };
      }

      // Для демонстрації; у реальному проекті мав би бути API-запит для отримання детальної інформації
      return {
        success: true,
        data: response.data as unknown as WizardOrderItemDetailed
      };
    } catch (error) {
      this.stateService.setLoading(false);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : UNKNOWN_ERROR
      };
    }
  }

  /**
   * Редагування існуючого предмета
   * @param itemId ID предмета
   */
  async editItem(itemId: string): Promise<ItemOperationResult<void>> {
    try {
      this.stateService.setLoading(true);
      
      // Отримуємо предмет через API
      const response = await this.apiService.getItemById(itemId);
      
      this.stateService.setLoading(false);
      
      if (!response.success) {
        return {
          success: false,
          error: response.error
        };
      }

      // Скидаємо стан до початкового
      this.stateService.resetState();
      
      // Встановлюємо поточний предмет
      this.stateService.setCurrentItem(response.data);
      
      return {
        success: true
      };
    } catch (error) {
      this.stateService.setLoading(false);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : UNKNOWN_ERROR
      };
    }
  }

  /**
   * Видалення предмета зі списку
   * @param itemId ID предмета
   */
  async removeItem(itemId: string): Promise<ItemOperationResult<void>> {
    try {
      this.stateService.setLoading(true);
      
      // Видаляємо предмет через API
      const response = await this.apiService.deleteItem(itemId);
      
      this.stateService.setLoading(false);
      
      if (!response.success) {
        return {
          success: false,
          error: response.error
        };
      }

      // Видаляємо предмет зі списку
      this.stateService.removeItem(itemId);

      return {
        success: true
      };
    } catch (error) {
      this.stateService.setLoading(false);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : UNKNOWN_ERROR
      };
    }
  }

  /**
   * Розрахунок загальної вартості всіх предметів
   */
  calculateTotalPrice(): number {
    const items = this.stateService.getItems();
    return items.reduce((total, item) => total + (item.finalPrice || 0) * (item.quantity || 1), 0);
  }

  /**
   * Оновлення даних поточного предмета
   * @param updates Часткові оновлення для предмета
   */
  async updateCurrentItem(updates: Partial<WizardOrderItem>): Promise<ItemOperationResult<WizardOrderItem>> {
    try {
      const currentItem = this.stateService.getCurrentItem();
      
      if (!currentItem) {
        return {
          success: false,
          error: 'Немає поточного предмета для оновлення'
        };
      }

      // Оновлюємо дані предмета
      const updatedItem = {
        ...currentItem,
        ...updates
      };

      // Якщо змінилася категорія або кількість, перераховуємо ціну
      if (
        (updates.categoryName && updates.categoryName !== currentItem.categoryName) ||
        (updates.quantity && updates.quantity !== currentItem.quantity)
      ) {
        // Розрахунок ціни через API
        const priceResponse = await this.apiService.calculatePrice(updatedItem);
        
        if (priceResponse.success && priceResponse.data !== undefined) {
          updatedItem.finalPrice = priceResponse.data;
        }
      }

      // Встановлюємо оновлений предмет
      this.stateService.setCurrentItem(updatedItem);

      return {
        success: true,
        data: updatedItem
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : UNKNOWN_ERROR
      };
    }
  }
}
