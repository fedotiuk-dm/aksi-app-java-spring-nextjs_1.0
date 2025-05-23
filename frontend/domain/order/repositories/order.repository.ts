/**
 * Репозиторій для Order (Замовлення)
 * Реалізує інкапсуляцію доступу до даних згідно з DDD
 */

import { ordersApi } from '@/lib/api';

import { OrderAdapter } from '../utils';

import type { Order, OrderSearchParams, OrderOperationResult } from '../types';

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
      const response = await ordersApi.getOrderById(parseInt(id));
      return response.data ? OrderAdapter.fromApiDTO(response.data) : null;
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
      // Припустимо, що API підтримує пошук за номером квитанції
      const response = await ordersApi.getAllOrders({
        receiptNumber,
        page: 0,
        size: 1,
      });

      const orders = response.data?.content || [];
      return orders.length > 0 ? OrderAdapter.fromApiDTO(orders[0]) : null;
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
      const response = await ordersApi.getAllOrders({
        tagNumber,
        page: 0,
        size: 1,
      });

      const orders = response.data?.content || [];
      return orders.length > 0 ? OrderAdapter.fromApiDTO(orders[0]) : null;
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
      const response = await ordersApi.createOrder(createRequest);

      if (response.data) {
        const createdOrder = OrderAdapter.fromApiDTO(response.data);
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
    } catch (error: any) {
      console.error('Error creating order:', error);
      return {
        order: null,
        success: false,
        errors: { general: error.message || 'Помилка створення замовлення' },
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

      const updateRequest = OrderAdapter.toApiDTO(order);
      const response = await ordersApi.updateOrder(parseInt(order.id), updateRequest);

      if (response.data) {
        const updatedOrder = OrderAdapter.fromApiDTO(response.data);
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
    } catch (error: any) {
      console.error('Error updating order:', error);
      return {
        order: null,
        success: false,
        errors: { general: error.message || 'Помилка оновлення замовлення' },
      };
    }
  }

  /**
   * Видаляє замовлення
   */
  async delete(id: string): Promise<boolean> {
    try {
      await ordersApi.deleteOrder(parseInt(id));
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
      const response = await ordersApi.getAllOrders({
        keyword: params.keyword,
        status: params.status?.join(','),
        dateFrom: params.dateFrom?.toISOString(),
        dateTo: params.dateTo?.toISOString(),
        branchId: params.branchId ? parseInt(params.branchId) : undefined,
        clientId: params.clientId ? parseInt(params.clientId) : undefined,
        minAmount: params.minAmount,
        maxAmount: params.maxAmount,
        page: 0,
        size: 100, // TODO: додати пагінацію
      });

      const orders = response.data?.content || [];
      return OrderAdapter.fromApiDTOList(orders);
    } catch (error) {
      console.error('Error searching orders:', error);
      return [];
    }
  }

  /**
   * Знаходить замовлення за клієнтом
   */
  async findByClient(clientId: string): Promise<Order[]> {
    return this.search({ clientId });
  }

  /**
   * Знаходить замовлення за філією
   */
  async findByBranch(branchId: string): Promise<Order[]> {
    return this.search({ branchId });
  }

  /**
   * Знаходить чернетки замовлень
   */
  async findDrafts(): Promise<Order[]> {
    return this.search({ status: ['DRAFT'] });
  }

  /**
   * Знаходить активні замовлення
   */
  async findActive(): Promise<Order[]> {
    return this.search({ status: ['NEW', 'IN_PROGRESS'] });
  }

  /**
   * Підраховує загальну кількість замовлень
   */
  async count(): Promise<number> {
    try {
      const response = await ordersApi.getAllOrders({
        page: 0,
        size: 1,
      });
      return response.data?.totalElements || 0;
    } catch (error) {
      console.error('Error counting orders:', error);
      return 0;
    }
  }

  /**
   * Підраховує замовлення за статусами
   */
  async countByStatus(): Promise<Record<string, number>> {
    try {
      // TODO: реалізувати API endpoint для статистики
      const orders = await this.search({});
      const counts: Record<string, number> = {};

      orders.forEach((order) => {
        counts[order.status] = (counts[order.status] || 0) + 1;
      });

      return counts;
    } catch (error) {
      console.error('Error counting orders by status:', error);
      return {};
    }
  }
}
