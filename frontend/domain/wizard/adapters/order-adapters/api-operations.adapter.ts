/**
 * @fileoverview Адаптер API операцій з замовленнями
 * @module domain/wizard/adapters/order-adapters
 */

import {
  OrderManagementBasicOperationsService,
  OrderManagementLifecycleService,
  OrderManagementFinancialService,
  OrderManagementDocumentsService,
} from '@/lib/api';

import { OrderMappingAdapter } from './mapping.adapter';

import type { OrderSummary, OrderStatus } from '../../types';
import type { CreateOrderRequest } from '@/lib/api';

/**
 * Адаптер для прямих API операцій з замовленнями
 *
 * Відповідальність:
 * - Виклики lib/api сервісів
 * - Інтеграція з OrderMappingAdapter
 * - Обробка API помилок
 */
export class OrderApiOperationsAdapter {
  // === ОСНОВНІ ОПЕРАЦІЇ ===

  /**
   * Отримання всіх замовлень через API
   */
  static async getAllOrders(): Promise<OrderSummary[]> {
    try {
      const apiResponse = await OrderManagementBasicOperationsService.getAllOrders();
      return OrderMappingAdapter.toDomainArray(apiResponse);
    } catch (error) {
      console.error('Помилка при отриманні всіх замовлень:', error);
      throw new Error(`Не вдалося отримати замовлення: ${error}`);
    }
  }

  /**
   * Отримання замовлення за ID через API
   */
  static async getById(id: string): Promise<OrderSummary> {
    try {
      const apiResponse = await OrderManagementBasicOperationsService.getOrderById({ id });
      return OrderMappingAdapter.fromOrderDTO(apiResponse);
    } catch (error) {
      console.error(`Помилка при отриманні замовлення ${id}:`, error);
      throw new Error(`Не вдалося отримати замовлення: ${error}`);
    }
  }

  /**
   * Створення нового замовлення через API
   */
  static async createOrder(domainData: Partial<OrderSummary>): Promise<OrderSummary> {
    try {
      const createRequest = OrderMappingAdapter.toCreateRequest(domainData);
      const apiResponse = await OrderManagementBasicOperationsService.createOrder({
        requestBody: createRequest,
      });

      return OrderMappingAdapter.fromOrderDTO(apiResponse);
    } catch (error) {
      console.error('Помилка при створенні замовлення:', error);
      throw new Error(`Не вдалося створити замовлення: ${error}`);
    }
  }

  /**
   * Збереження чернетки замовлення через API
   */
  static async saveOrderDraft(domainData: Partial<OrderSummary>): Promise<OrderSummary> {
    try {
      const createRequest = OrderMappingAdapter.toCreateRequest(domainData);
      const apiResponse = await OrderManagementBasicOperationsService.saveOrderDraft({
        requestBody: createRequest,
      });

      return OrderMappingAdapter.fromOrderDTO(apiResponse);
    } catch (error) {
      console.error('Помилка при збереженні чернетки замовлення:', error);
      throw new Error(`Не вдалося зберегти чернетку замовлення: ${error}`);
    }
  }

  // === ОПЕРАЦІЇ З ЧЕРНЕТКАМИ ===

  /**
   * Отримання всіх чернеток замовлень через API
   */
  static async getDraftOrders(): Promise<OrderSummary[]> {
    try {
      const apiResponse = await OrderManagementBasicOperationsService.getDraftOrders();
      return OrderMappingAdapter.toDomainArray(apiResponse);
    } catch (error) {
      console.error('Помилка при отриманні чернеток замовлень:', error);
      throw new Error(`Не вдалося отримати чернетки замовлень: ${error}`);
    }
  }

  /**
   * Перетворення чернетки в замовлення через API
   */
  static async convertDraftToOrder(id: string): Promise<OrderSummary> {
    try {
      const apiResponse = await OrderManagementBasicOperationsService.convertDraftToOrder({ id });
      return OrderMappingAdapter.fromOrderDTO(apiResponse);
    } catch (error) {
      console.error(`Помилка при перетворенні чернетки ${id} в замовлення:`, error);
      throw new Error(`Не вдалося перетворити чернетку в замовлення: ${error}`);
    }
  }

  // === ОПЕРАЦІЇ З АКТИВНИМИ ЗАМОВЛЕННЯМИ ===

  /**
   * Отримання всіх активних замовлень через API
   */
  static async getActiveOrders(): Promise<OrderSummary[]> {
    try {
      const apiResponse = await OrderManagementBasicOperationsService.getActiveOrders();
      return OrderMappingAdapter.toDomainArray(apiResponse);
    } catch (error) {
      console.error('Помилка при отриманні активних замовлень:', error);
      throw new Error(`Не вдалося отримати активні замовлення: ${error}`);
    }
  }

  // === ОПЕРАЦІЇ ЖИТТЄВОГО ЦИКЛУ ===

  /**
   * Оновлення статусу замовлення через API
   */
  static async updateOrderStatus(id: string, status: OrderStatus): Promise<OrderSummary> {
    try {
      const apiResponse = await OrderManagementBasicOperationsService.updateOrderStatus({
        id,
        status: status as 'DRAFT' | 'NEW' | 'IN_PROGRESS' | 'COMPLETED' | 'DELIVERED' | 'CANCELLED',
      });

      return OrderMappingAdapter.fromOrderDTO(apiResponse);
    } catch (error) {
      console.error(`Помилка при оновленні статусу замовлення ${id}:`, error);
      throw new Error(`Не вдалося оновити статус замовлення: ${error}`);
    }
  }

  /**
   * Завершення замовлення через API
   */
  static async completeOrder(id: string): Promise<OrderSummary> {
    try {
      const apiResponse = await OrderManagementBasicOperationsService.completeOrder({
        id,
      });

      return OrderMappingAdapter.fromOrderDTO(apiResponse);
    } catch (error) {
      console.error(`Помилка при завершенні замовлення ${id}:`, error);
      throw new Error(`Не вдалося завершити замовлення: ${error}`);
    }
  }

  /**
   * Скасування замовлення через API
   */
  static async cancelOrder(id: string): Promise<void> {
    try {
      await OrderManagementBasicOperationsService.cancelOrder({
        id,
      });
    } catch (error) {
      console.error(`Помилка при скасуванні замовлення ${id}:`, error);
      throw new Error(`Не вдалося скасувати замовлення: ${error}`);
    }
  }

  // === ФІНАНСОВІ ОПЕРАЦІЇ ===

  /**
   * Застосування оплати до замовлення через API
   */
  static async applyPayment(paymentData: any): Promise<any> {
    try {
      return await OrderManagementFinancialService.applyPayment({
        requestBody: paymentData,
      });
    } catch (error) {
      console.error('Помилка при застосуванні оплати:', error);
      throw new Error(`Не вдалося застосувати оплату: ${error}`);
    }
  }

  /**
   * Розрахунок оплати замовлення через API
   */
  static async calculatePayment(paymentData: any): Promise<any> {
    try {
      return await OrderManagementFinancialService.calculatePayment({
        requestBody: paymentData,
      });
    } catch (error) {
      console.error('Помилка при розрахунку оплати:', error);
      throw new Error(`Не вдалося розрахувати оплату: ${error}`);
    }
  }

  /**
   * Застосування знижки до замовлення через API
   */
  static async applyDiscount(discountData: any): Promise<any> {
    try {
      return await OrderManagementFinancialService.applyDiscount1({
        requestBody: discountData,
      });
    } catch (error) {
      console.error('Помилка при застосуванні знижки:', error);
      throw new Error(`Не вдалося застосувати знижку: ${error}`);
    }
  }

  /**
   * Отримання інформації про знижку замовлення через API
   */
  static async getOrderDiscount(orderId: string): Promise<any> {
    try {
      return await OrderManagementFinancialService.getOrderDiscount({ orderId });
    } catch (error) {
      console.error(`Помилка при отриманні інформації про знижку замовлення ${orderId}:`, error);
      throw new Error(`Не вдалося отримати інформацію про знижку: ${error}`);
    }
  }

  /**
   * Видалення знижки з замовлення через API
   */
  static async removeDiscount(orderId: string): Promise<any> {
    try {
      return await OrderManagementFinancialService.removeDiscount({ orderId });
    } catch (error) {
      console.error(`Помилка при видаленні знижки з замовлення ${orderId}:`, error);
      throw new Error(`Не вдалося видалити знижку: ${error}`);
    }
  }

  // === ОПЕРАЦІЇ З ДОКУМЕНТАМИ ===

  /**
   * Генерування PDF квитанції через API
   */
  static async generatePdfReceipt(receiptData: any): Promise<any> {
    try {
      return await OrderManagementDocumentsService.generatePdfReceipt({
        requestBody: receiptData,
      });
    } catch (error) {
      console.error('Помилка при генеруванні PDF квитанції:', error);
      throw new Error(`Не вдалося згенерувати PDF квитанцію: ${error}`);
    }
  }

  /**
   * Відправлення квитанції на email через API
   */
  static async sendReceiptByEmail(emailData: any): Promise<any> {
    try {
      return await OrderManagementDocumentsService.sendReceiptByEmail({
        requestBody: emailData,
      });
    } catch (error) {
      console.error('Помилка при відправленні квитанції на email:', error);
      throw new Error(`Не вдалося відправити квитанцію на email: ${error}`);
    }
  }

  /**
   * Отримання даних для квитанції через API
   */
  static async getReceiptData(orderId: string): Promise<any> {
    try {
      return await OrderManagementDocumentsService.getReceiptData({ orderId });
    } catch (error) {
      console.error(`Помилка при отриманні даних для квитанції замовлення ${orderId}:`, error);
      throw new Error(`Не вдалося отримати дані для квитанції: ${error}`);
    }
  }

  // === УТИЛІТАРНІ МЕТОДИ ===

  /**
   * Перевірка існування замовлення
   */
  static async orderExists(id: string): Promise<boolean> {
    try {
      await this.getById(id);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Отримання кількості всіх замовлень
   */
  static async getOrderCount(): Promise<number> {
    try {
      const orders = await this.getAllOrders();
      return orders.length;
    } catch (error) {
      console.error('Помилка при отриманні кількості замовлень:', error);
      return 0;
    }
  }

  /**
   * Отримання кількості активних замовлень
   */
  static async getActiveOrderCount(): Promise<number> {
    try {
      const activeOrders = await this.getActiveOrders();
      return activeOrders.length;
    } catch (error) {
      console.error('Помилка при отриманні кількості активних замовлень:', error);
      return 0;
    }
  }

  /**
   * Отримання кількості чернеток замовлень
   */
  static async getDraftOrderCount(): Promise<number> {
    try {
      const draftOrders = await this.getDraftOrders();
      return draftOrders.length;
    } catch (error) {
      console.error('Помилка при отриманні кількості чернеток замовлень:', error);
      return 0;
    }
  }
}
