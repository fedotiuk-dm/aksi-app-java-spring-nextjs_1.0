/**
 * @fileoverview Сервіс операцій з основною інформацією про предмет
 * @module domain/wizard/services/stage-3-item-management/basic-info/services/basic-info-operations
 */

import { OrderItemService } from '@/domain/wizard/adapters/order/api';
import { PriceCalculationService } from '@/domain/wizard/adapters/pricing/api';
import { PriceListService } from '@/domain/wizard/adapters/pricing/api';

import { IBasicInfoOperationsService } from '../interfaces';

import type {
  BasicInfoOperationResult,
  CreateBasicItemData,
  UpdateBasicInfoData
} from '../types/basic-info.types';
import type { OrderItem } from '@/domain/wizard/types';


const UNKNOWN_ERROR = 'Невідома помилка при операції з предметом';

/**
 * Сервіс операцій з основною інформацією про предмет
 * @implements IBasicInfoOperationsService
 */
export class BasicInfoOperationsService implements IBasicInfoOperationsService {
  private orderItemAdapter: OrderItemService;
  private priceCalculationAdapter: PriceCalculationService;
  private priceListAdapter: PriceListService;

  /**
   * Конструктор сервісу операцій
   * @param orderId Ідентифікатор замовлення
   */
  constructor(orderId?: string) {
    this.orderItemAdapter = new OrderItemService(orderId);
    this.priceCalculationAdapter = new PriceCalculationService();
    this.priceListAdapter = new PriceListService();
  }

  /**
   * Встановлення ID замовлення
   * @param orderId ID замовлення
   */
  setOrderId(orderId: string): void {
    this.orderItemAdapter.setOrderId(orderId);
  }

  /**
   * Створення нового предмета з базовою інформацією
   * @param data Дані для створення
   */
  async createBasicItem(data: CreateBasicItemData): Promise<BasicInfoOperationResult<OrderItem>> {
    try {
      // Отримуємо деталі про послугу
      const priceListItemResult = await this.priceListAdapter.getPriceListItem(data.priceListItemId);

      if (!priceListItemResult.success) {
        return {
          success: false,
          error: `Не вдалося отримати інформацію про послугу: ${priceListItemResult.error}`
        };
      }

      // Розрахунок базової ціни
      const basePriceResult = await this.calculateBasePrice(data.priceListItemId, data.quantity);

      if (!basePriceResult.success) {
        return {
          success: false,
          error: `Не вдалося розрахувати базову ціну: ${basePriceResult.error}`
        };
      }

      // Формуємо дані для створення предмета
      const itemData = {
        categoryId: data.categoryId,
        priceListItemId: data.priceListItemId,
        quantity: data.quantity,
        name: data.customName || priceListItemResult.data?.name || '',
        basePrice: basePriceResult.data || 0,
        totalPrice: basePriceResult.data || 0 // Без модифікаторів поки що
      };

      // Викликаємо адаптер для створення предмета
      const result = await this.orderItemAdapter.addOrderItem(itemData);

      if (!result.success) {
        return {
          success: false,
          error: `Не вдалося створити предмет: ${result.error}`
        };
      }

      return {
        success: true,
        data: result.data
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : UNKNOWN_ERROR
      };
    }
  }

  /**
   * Оновлення основної інформації існуючого предмета
   * @param itemId Ідентифікатор предмета
   * @param data Дані для оновлення
   */
  async updateBasicInfo(
    itemId: string,
    data: UpdateBasicInfoData
  ): Promise<BasicInfoOperationResult<OrderItem>> {
    try {
      // Спочатку отримуємо поточний предмет
      const currentItemResult = await this.orderItemAdapter.getOrderItem(itemId);

      if (!currentItemResult.success || !currentItemResult.data) {
        return {
          success: false,
          error: `Не вдалося отримати поточний предмет: ${currentItemResult.error}`
        };
      }

      const currentItem = currentItemResult.data;

      // Підготовка даних для оновлення
      const updateData: any = {};

      if (data.categoryId !== undefined) {
        updateData.categoryId = data.categoryId;
      }

      if (data.priceListItemId !== undefined) {
        updateData.priceListItemId = data.priceListItemId;
      }

      if (data.quantity !== undefined) {
        updateData.quantity = data.quantity;
      }

      if (data.customName !== undefined) {
        updateData.name = data.customName;
      }

      // Якщо змінилася ціна або кількість, розраховуємо нову ціну
      if (data.priceListItemId !== undefined || data.quantity !== undefined) {
        const priceListId = data.priceListItemId || currentItem.priceListItemId;
        const quantity = data.quantity || currentItem.quantity;

        const basePriceResult = await this.calculateBasePrice(priceListId, quantity);

        if (!basePriceResult.success) {
          return {
            success: false,
            error: `Не вдалося розрахувати нову ціну: ${basePriceResult.error}`
          };
        }

        updateData.basePrice = basePriceResult.data;
        // Тут ми встановлюємо totalPrice рівним basePrice, але в реальному сценарії
        // потрібно було б перерахувати з усіма модифікаторами
        updateData.totalPrice = basePriceResult.data;
      }

      // Викликаємо адаптер для оновлення предмета
      const result = await this.orderItemAdapter.updateOrderItem(itemId, updateData);

      if (!result.success) {
        return {
          success: false,
          error: `Не вдалося оновити предмет: ${result.error}`
        };
      }

      return {
        success: true,
        data: result.data
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : UNKNOWN_ERROR
      };
    }
  }

  /**
   * Розрахунок базової ціни для предмета
   * @param priceListItemId Ідентифікатор елемента прайс-листа
   * @param quantity Кількість
   */
  async calculateBasePrice(
    priceListItemId: string,
    quantity: number
  ): Promise<BasicInfoOperationResult<number>> {
    try {
      // Отримуємо деталі про послугу
      const priceListItemResult = await this.priceListAdapter.getPriceListItem(priceListItemId);

      if (!priceListItemResult.success || !priceListItemResult.data) {
        return {
          success: false,
          error: `Не вдалося отримати інформацію про послугу: ${priceListItemResult.error}`
        };
      }

      // Розрахунок базової ціни через адаптер
      const basePriceRequest = {
        priceListItemId,
        quantity
      };

      const calculationResult = await this.priceCalculationAdapter.calculateBasePrice(basePriceRequest);

      if (!calculationResult.success) {
        return {
          success: false,
          error: `Помилка розрахунку базової ціни: ${calculationResult.error}`
        };
      }

      return {
        success: true,
        data: calculationResult.data
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : UNKNOWN_ERROR
      };
    }
  }

  /**
   * Отримання дати виконання для категорії
   * @param categoryId Ідентифікатор категорії
   * @param isExpedited Чи потрібне термінове виконання
   */
  async getCompletionDate(
    categoryId: string,
    isExpedited: boolean
  ): Promise<BasicInfoOperationResult<Date>> {
    try {
      // Розрахунок дати виконання через адаптер
      const request = {
        categoryId,
        isExpedited
      };

      const result = await this.priceCalculationAdapter.getEstimatedCompletionDate(request);

      if (!result.success) {
        return {
          success: false,
          error: `Не вдалося розрахувати дату виконання: ${result.error}`
        };
      }

      return {
        success: true,
        data: result.data
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : UNKNOWN_ERROR
      };
    }
  }
}

// Єдиний екземпляр сервісу для використання в додатку
export const basicInfoOperationsService = new BasicInfoOperationsService();
