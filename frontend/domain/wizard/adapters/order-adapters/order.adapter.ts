/**
 * @fileoverview Композиційний адаптер замовлень (зворотна сумісність)
 * @module domain/wizard/adapters/order-adapters
 */

import { OrderApiOperationsAdapter } from './api-operations.adapter';
import { OrderMappingAdapter } from './mapping.adapter';

import type { OrderSummary, OrderStatus } from '../../types';
import type {
  OrderDTO,
  OrderDetailedSummaryResponse,
  CreateOrderRequest,
  OrderSummaryDTO,
} from '@/lib/api';

/**
 * Композиційний адаптер замовлень для зворотної сумісності
 *
 * Відповідальність:
 * - Делегування до спеціалізованих адаптерів
 * - Збереження існуючого API
 * - Уніфікований доступ до функціональності
 */
export class OrderAdapter {
  // === ДЕЛЕГУВАННЯ ДО MAPPING ADAPTER ===

  /**
   * Перетворює OrderDTO у доменний OrderSummary
   */
  static fromOrderDTO(apiOrder: OrderDTO): OrderSummary {
    return OrderMappingAdapter.fromOrderDTO(apiOrder);
  }

  /**
   * Перетворює OrderDetailedSummaryResponse у доменний OrderSummary
   */
  static fromDetailedSummary(apiOrder: OrderDetailedSummaryResponse): OrderSummary {
    return OrderMappingAdapter.fromDetailedSummary(apiOrder);
  }

  /**
   * Універсальний метод для будь-якого типу Order API
   */
  static toDomain(apiOrder: OrderDTO | OrderDetailedSummaryResponse): OrderSummary {
    return OrderMappingAdapter.toDomain(apiOrder);
  }

  /**
   * Перетворює OrderSummaryDTO у спрощений доменний OrderSummary
   */
  static fromSummaryDTO(apiOrder: OrderSummaryDTO): OrderSummary {
    return OrderMappingAdapter.fromSummaryDTO(apiOrder);
  }

  /**
   * Перетворює доменний тип у CreateOrderRequest для створення замовлення
   */
  static toCreateRequest(domainOrder: Partial<OrderSummary>): CreateOrderRequest {
    return OrderMappingAdapter.toCreateRequest(domainOrder);
  }

  // === ДЕЛЕГУВАННЯ ДО API OPERATIONS ADAPTER ===

  /**
   * Отримання всіх замовлень через API
   */
  static async getAllOrders(): Promise<OrderSummary[]> {
    return OrderApiOperationsAdapter.getAllOrders();
  }

  /**
   * Отримання замовлення за ID через API
   */
  static async getById(id: string): Promise<OrderSummary> {
    return OrderApiOperationsAdapter.getById(id);
  }

  /**
   * Створення нового замовлення через API
   */
  static async createOrder(domainData: Partial<OrderSummary>): Promise<OrderSummary> {
    return OrderApiOperationsAdapter.createOrder(domainData);
  }

  /**
   * Збереження чернетки замовлення через API
   */
  static async saveOrderDraft(domainData: Partial<OrderSummary>): Promise<OrderSummary> {
    return OrderApiOperationsAdapter.saveOrderDraft(domainData);
  }

  /**
   * Отримання всіх чернеток замовлень через API
   */
  static async getDraftOrders(): Promise<OrderSummary[]> {
    return OrderApiOperationsAdapter.getDraftOrders();
  }

  /**
   * Перетворення чернетки в замовлення через API
   */
  static async convertDraftToOrder(id: string): Promise<OrderSummary> {
    return OrderApiOperationsAdapter.convertDraftToOrder(id);
  }

  /**
   * Отримання всіх активних замовлень через API
   */
  static async getActiveOrders(): Promise<OrderSummary[]> {
    return OrderApiOperationsAdapter.getActiveOrders();
  }

  /**
   * Оновлення статусу замовлення через API
   */
  static async updateOrderStatus(id: string, status: OrderStatus): Promise<OrderSummary> {
    return OrderApiOperationsAdapter.updateOrderStatus(id, status);
  }

  /**
   * Завершення замовлення через API
   */
  static async completeOrder(id: string): Promise<OrderSummary> {
    return OrderApiOperationsAdapter.completeOrder(id);
  }

  /**
   * Скасування замовлення через API
   */
  static async cancelOrder(id: string): Promise<void> {
    return OrderApiOperationsAdapter.cancelOrder(id);
  }

  /**
   * Застосування оплати до замовлення через API
   */
  static async applyPayment(paymentData: any): Promise<any> {
    return OrderApiOperationsAdapter.applyPayment(paymentData);
  }

  /**
   * Розрахунок оплати замовлення через API
   */
  static async calculatePayment(paymentData: any): Promise<any> {
    return OrderApiOperationsAdapter.calculatePayment(paymentData);
  }

  /**
   * Застосування знижки до замовлення через API
   */
  static async applyDiscount(discountData: any): Promise<any> {
    return OrderApiOperationsAdapter.applyDiscount(discountData);
  }

  /**
   * Отримання інформації про знижку замовлення через API
   */
  static async getOrderDiscount(orderId: string): Promise<any> {
    return OrderApiOperationsAdapter.getOrderDiscount(orderId);
  }

  /**
   * Видалення знижки з замовлення через API
   */
  static async removeDiscount(orderId: string): Promise<any> {
    return OrderApiOperationsAdapter.removeDiscount(orderId);
  }

  /**
   * Генерування PDF квитанції через API
   */
  static async generatePdfReceipt(receiptData: any): Promise<any> {
    return OrderApiOperationsAdapter.generatePdfReceipt(receiptData);
  }

  /**
   * Відправлення квитанції на email через API
   */
  static async sendReceiptByEmail(emailData: any): Promise<any> {
    return OrderApiOperationsAdapter.sendReceiptByEmail(emailData);
  }

  /**
   * Отримання даних для квитанції через API
   */
  static async getReceiptData(orderId: string): Promise<any> {
    return OrderApiOperationsAdapter.getReceiptData(orderId);
  }
}
