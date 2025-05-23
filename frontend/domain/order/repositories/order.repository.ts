/**
 * Репозиторій для Order (Замовлення)
 * Реалізує інкапсуляцію доступу до даних згідно з DDD
 */

import {
  OrderManagementBasicOperationsService,
  OrderManagementFinancialService,
  OrderManagementSummaryAnalyticsService,
  type OrderDTO,
  type OrderDiscountRequest,
  type PaymentCalculationRequest,
  type OrderDetailedSummaryResponse,
} from '@/lib/api';

import { OrderAdapter } from '../utils';

import type {
  Order,
  OrderSearchParams,
  OrderOperationResult,
  FinancialOperationResponse,
} from '../types';

/**
 * Інтерфейс Order репозиторію
 */
export interface IOrderRepository {
  // === CRUD ОПЕРАЦІЇ ===
  findById(id: string): Promise<Order | null>;
  findByReceiptNumber(receiptNumber: string): Promise<Order | null>;
  findByTagNumber(tagNumber: string): Promise<Order | null>;
  create(order: Order): Promise<OrderOperationResult>;
  update(order: Order): Promise<OrderOperationResult>;
  delete(id: string): Promise<boolean>;

  // === ПОШУК ===
  search(params: OrderSearchParams): Promise<Order[]>;
  findByClient(clientId: string): Promise<Order[]>;
  findByBranch(branchId: string): Promise<Order[]>;
  findDrafts(): Promise<Order[]>;
  findActive(): Promise<Order[]>;

  // === СТАТИСТИКА ===
  count(): Promise<number>;
  countByStatus(): Promise<Record<string, number>>;
  getDetailedSummary(orderId: string): Promise<OrderDetailedSummaryResponse | null>;

  // === ФІНАНСОВІ ОПЕРАЦІЇ ===
  applyDiscount(
    orderId: string,
    discountRequest: OrderDiscountRequest
  ): Promise<FinancialOperationResponse | null>;
  removeDiscount(orderId: string): Promise<FinancialOperationResponse | null>;
  getOrderPayment(): Promise<FinancialOperationResponse | null>;
  calculatePayment(
    paymentRequest: PaymentCalculationRequest
  ): Promise<FinancialOperationResponse | null>;

  // === ЖИТТЄВИЙ ЦИКЛ ===
  completeOrder(orderId: string): Promise<Order | null>;
  convertDraftToOrder(orderId: string): Promise<Order | null>;
  cancelOrder(orderId: string): Promise<boolean>;
}

/**
 * Реалізація Order репозиторію
 */
export class OrderRepository implements IOrderRepository {
  /**
   * Знаходить замовлення за ID
   */
  async findById(id: string): Promise<Order | null> {
    try {
      const response = await OrderManagementBasicOperationsService.getOrderById({ id });
      return response ? OrderAdapter.fromApiDTO(response) : null;
    } catch (error) {
      console.error('Error finding order by ID:', error);
      return null;
    }
  }

  /**
   * Знаходить замовлення за номером квитанції
   */
  async findByReceiptNumber(receiptNumber: string): Promise<Order | null> {
    try {
      // TODO: Реалізувати пошук за номером квитанції через відповідний API endpoint
      const allOrders = await OrderManagementBasicOperationsService.getAllOrders();
      const foundOrder = allOrders.find((order: OrderDTO) => order.receiptNumber === receiptNumber);
      return foundOrder ? OrderAdapter.fromApiDTO(foundOrder) : null;
    } catch (error) {
      console.error('Error finding order by receipt number:', error);
      return null;
    }
  }

  /**
   * Знаходить замовлення за унікальною міткою
   */
  async findByTagNumber(tagNumber: string): Promise<Order | null> {
    try {
      // TODO: Реалізувати пошук за номером тегу через відповідний API endpoint
      const allOrders = await OrderManagementBasicOperationsService.getAllOrders();
      const foundOrder = allOrders.find((order: OrderDTO) => order.tagNumber === tagNumber);
      return foundOrder ? OrderAdapter.fromApiDTO(foundOrder) : null;
    } catch (error) {
      console.error('Error finding order by tag number:', error);
      return null;
    }
  }

  /**
   * Створює нове замовлення
   */
  async create(order: Order): Promise<OrderOperationResult> {
    try {
      const createRequest = OrderAdapter.toApiDTO(order);
      const response = await OrderManagementBasicOperationsService.createOrder({
        requestBody: createRequest,
      });

      if (response) {
        const createdOrder = OrderAdapter.fromApiDTO(response);
        return {
          order: createdOrder,
          success: true,
          errors: null,
        };
      }

      return {
        order: null,
        success: false,
        errors: { general: 'Не вдалося створити замовлення' },
      };
    } catch (error: unknown) {
      console.error('Error creating order:', error);
      const errorMessage = error instanceof Error ? error.message : 'Помилка створення замовлення';
      return {
        order: null,
        success: false,
        errors: { general: errorMessage },
      };
    }
  }

  /**
   * Оновлює замовлення
   */
  async update(order: Order): Promise<OrderOperationResult> {
    try {
      if (!order.id) {
        return {
          order: null,
          success: false,
          errors: { general: 'ID замовлення відсутній' },
        };
      }

      // TODO: Знайти правильний метод для оновлення замовлення
      // Поки що використовуємо метод оновлення статусу як заглушку
      const statusLiteral = order.status as
        | 'DRAFT'
        | 'NEW'
        | 'IN_PROGRESS'
        | 'COMPLETED'
        | 'DELIVERED'
        | 'CANCELLED';
      const response = await OrderManagementBasicOperationsService.updateOrderStatus({
        id: order.id,
        status: statusLiteral,
      });

      if (response) {
        const updatedOrder = OrderAdapter.fromApiDTO(response);
        return {
          order: updatedOrder,
          success: true,
          errors: null,
        };
      }

      return {
        order: null,
        success: false,
        errors: { general: 'Не вдалося оновити замовлення' },
      };
    } catch (error: unknown) {
      console.error('Error updating order:', error);
      const errorMessage = error instanceof Error ? error.message : 'Помилка оновлення замовлення';
      return {
        order: null,
        success: false,
        errors: { general: errorMessage },
      };
    }
  }

  /**
   * Видаляє замовлення
   */
  async delete(id: string): Promise<boolean> {
    try {
      // TODO: Знайти правильний метод для видалення замовлення
      // Поки що використовуємо метод скасування як заглушку
      await OrderManagementBasicOperationsService.cancelOrder({ id });
      return true;
    } catch (error) {
      console.error('Error deleting order:', error);
      return false;
    }
  }

  /**
   * Пошук замовлень за параметрами
   */
  async search(params: OrderSearchParams): Promise<Order[]> {
    try {
      // TODO: Реалізувати фільтрацію через відповідний API endpoint
      const allOrders = await OrderManagementBasicOperationsService.getAllOrders();

      // Локальна фільтрація (тимчасове рішення)
      let filteredOrders = allOrders;

      if (params.keyword) {
        filteredOrders = filteredOrders.filter(
          (order: OrderDTO) =>
            order.receiptNumber?.includes(params.keyword || '') ||
            order.tagNumber?.includes(params.keyword || '')
        );
      }

      if (params.status && params.status.length > 0) {
        const statusStrings = params.status.map((status) => status.toString());
        filteredOrders = filteredOrders.filter((order: OrderDTO) =>
          order.status ? statusStrings.includes(order.status) : false
        );
      }

      return OrderAdapter.fromApiDTOList(filteredOrders);
    } catch (error) {
      console.error('Error searching orders:', error);
      return [];
    }
  }

  /**
   * Знаходить замовлення за клієнтом
   */
  async findByClient(clientId: string): Promise<Order[]> {
    try {
      const allOrders = await OrderManagementBasicOperationsService.getAllOrders();
      const clientOrders = allOrders.filter(
        (order: OrderDTO) => order.clientId?.toString() === clientId
      );
      return OrderAdapter.fromApiDTOList(clientOrders);
    } catch (error) {
      console.error('Error finding orders by client:', error);
      return [];
    }
  }

  /**
   * Знаходить замовлення за філією
   */
  async findByBranch(branchId: string): Promise<Order[]> {
    try {
      const allOrders = await OrderManagementBasicOperationsService.getAllOrders();
      const branchOrders = allOrders.filter(
        (order: OrderDTO) => order.branchLocationId?.toString() === branchId
      );
      return OrderAdapter.fromApiDTOList(branchOrders);
    } catch (error) {
      console.error('Error finding orders by branch:', error);
      return [];
    }
  }

  /**
   * Знаходить чернетки замовлень
   */
  async findDrafts(): Promise<Order[]> {
    try {
      const drafts = await OrderManagementBasicOperationsService.getDraftOrders();
      return OrderAdapter.fromApiDTOList(drafts);
    } catch (error) {
      console.error('Error finding draft orders:', error);
      return [];
    }
  }

  /**
   * Знаходить активні замовлення
   */
  async findActive(): Promise<Order[]> {
    try {
      const active = await OrderManagementBasicOperationsService.getActiveOrders();
      return OrderAdapter.fromApiDTOList(active);
    } catch (error) {
      console.error('Error finding active orders:', error);
      return [];
    }
  }

  /**
   * Підраховує загальну кількість замовлень
   */
  async count(): Promise<number> {
    try {
      const allOrders = await OrderManagementBasicOperationsService.getAllOrders();
      return allOrders.length;
    } catch (error) {
      console.error('Error counting orders:', error);
      return 0;
    }
  }

  /**
   * Підраховує кількість замовлень за статусами
   */
  async countByStatus(): Promise<Record<string, number>> {
    try {
      const allOrders = await OrderManagementBasicOperationsService.getAllOrders();
      const counts: Record<string, number> = {};

      for (const order of allOrders) {
        const orderDto = order as OrderDTO;
        if (orderDto.status) {
          const status = orderDto.status;
          counts[status] = (counts[status] || 0) + 1;
        }
      }

      return counts;
    } catch (error) {
      console.error('Error counting orders by status:', error);
      return {};
    }
  }

  /**
   * Отримує детальний підсумок замовлення
   */
  async getDetailedSummary(orderId: string): Promise<OrderDetailedSummaryResponse | null> {
    try {
      return await OrderManagementSummaryAnalyticsService.getOrderDetailedSummary({ orderId });
    } catch (error) {
      console.error('Error getting detailed summary:', error);
      return null;
    }
  }

  /**
   * Застосовує знижку до замовлення
   */
  async applyDiscount(
    orderId: string,
    discountRequest: OrderDiscountRequest
  ): Promise<FinancialOperationResponse | null> {
    try {
      const response = await OrderManagementFinancialService.applyDiscount1({
        requestBody: discountRequest,
      });
      return {
        success: true,
        data: response as Record<string, unknown>,
      };
    } catch (error) {
      console.error('Error applying discount:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to apply discount',
      };
    }
  }

  /**
   * Видаляє знижку з замовлення
   */
  async removeDiscount(orderId: string): Promise<FinancialOperationResponse | null> {
    try {
      const response = await OrderManagementFinancialService.removeDiscount({ orderId });
      return {
        success: true,
        data: response as Record<string, unknown>,
      };
    } catch (error) {
      console.error('Error removing discount:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to remove discount',
      };
    }
  }

  /**
   * Отримує інформацію про оплату
   */
  async getOrderPayment(): Promise<FinancialOperationResponse | null> {
    try {
      const response = await OrderManagementFinancialService.getOrderPayment();
      return {
        success: true,
        data: response as Record<string, unknown>,
      };
    } catch (error) {
      console.error('Error getting payment info:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to get payment info',
      };
    }
  }

  /**
   * Розраховує оплату
   */
  async calculatePayment(
    paymentRequest: PaymentCalculationRequest
  ): Promise<FinancialOperationResponse | null> {
    try {
      const response = await OrderManagementFinancialService.calculatePayment({
        requestBody: paymentRequest,
      });
      return {
        success: true,
        data: response as Record<string, unknown>,
      };
    } catch (error) {
      console.error('Error calculating payment:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to calculate payment',
      };
    }
  }

  /**
   * Завершує замовлення
   */
  async completeOrder(orderId: string): Promise<Order | null> {
    try {
      const response = await OrderManagementBasicOperationsService.completeOrder({ id: orderId });
      return response ? OrderAdapter.fromApiDTO(response) : null;
    } catch (error) {
      console.error('Error completing order:', error);
      return null;
    }
  }

  /**
   * Конвертує чернетку в замовлення
   */
  async convertDraftToOrder(orderId: string): Promise<Order | null> {
    try {
      const response = await OrderManagementBasicOperationsService.convertDraftToOrder({
        id: orderId,
      });
      return response ? OrderAdapter.fromApiDTO(response) : null;
    } catch (error) {
      console.error('Error converting draft to order:', error);
      return null;
    }
  }

  /**
   * Скасовує замовлення
   */
  async cancelOrder(orderId: string): Promise<boolean> {
    try {
      await OrderManagementBasicOperationsService.cancelOrder({ id: orderId });
      return true;
    } catch (error) {
      console.error('Error canceling order:', error);
      return false;
    }
  }
}
