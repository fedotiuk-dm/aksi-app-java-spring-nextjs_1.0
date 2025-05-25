/**
 * @fileoverview Інтерфейси сервісів замовлень
 * @module domain/wizard/services/order/interfaces
 */

import type { BaseService, OperationResult, ValidationOperationResult } from '../interfaces';
import type {
  OrderDomain,
  CreateOrderDomainRequest,
  UpdateOrderDomainRequest,
  OrderSearchDomainParams,
  OrderSearchDomainResult,
  OrderStatsDomain,
  OrderStatus,
} from './order-domain.types';

/**
 * Інтерфейс сервісу створення замовлень
 */
export interface IOrderCreationService extends BaseService {
  createOrder(request: CreateOrderDomainRequest): Promise<OperationResult<OrderDomain>>;
  validateOrderRequest(
    request: CreateOrderDomainRequest
  ): ValidationOperationResult<CreateOrderDomainRequest>;
  generateReceiptNumber(): OperationResult<string>;
  calculateOrderTotal(request: CreateOrderDomainRequest): Promise<
    OperationResult<{
      totalAmount: number;
      discountAmount: number;
      expediteFee: number;
    }>
  >;
}

/**
 * Інтерфейс сервісу пошуку замовлень
 */
export interface IOrderSearchService extends BaseService {
  searchOrders(params: OrderSearchDomainParams): Promise<OperationResult<OrderSearchDomainResult>>;
  getOrderById(id: string): Promise<OperationResult<OrderDomain | null>>;
  getOrderByReceiptNumber(receiptNumber: string): Promise<OperationResult<OrderDomain | null>>;
  getOrdersByClient(clientId: string): Promise<OperationResult<OrderDomain[]>>;
  getRecentOrders(limit?: number): Promise<OperationResult<OrderDomain[]>>;
}

/**
 * Інтерфейс сервісу управління замовленнями
 */
export interface IOrderManagementService extends BaseService {
  updateOrder(id: string, request: UpdateOrderDomainRequest): Promise<OperationResult<OrderDomain>>;
  updateOrderStatus(id: string, status: OrderStatus): Promise<OperationResult<OrderDomain>>;
  cancelOrder(id: string, reason?: string): Promise<OperationResult<OrderDomain>>;
  completeOrder(id: string): Promise<OperationResult<OrderDomain>>;
  addPayment(id: string, amount: number): Promise<OperationResult<OrderDomain>>;
}

/**
 * Інтерфейс сервісу статистики замовлень
 */
export interface IOrderStatsService extends BaseService {
  getOrderStats(dateFrom?: Date, dateTo?: Date): Promise<OperationResult<OrderStatsDomain>>;
  getOrdersByStatus(): Promise<OperationResult<Record<OrderStatus, number>>>;
  getDailyStats(date: Date): Promise<
    OperationResult<{
      ordersCount: number;
      totalAmount: number;
      averageOrderValue: number;
    }>
  >;
  getTopServices(limit?: number): Promise<
    OperationResult<
      Array<{
        serviceId: string;
        serviceName: string;
        count: number;
        totalAmount: number;
      }>
    >
  >;
}

/**
 * Інтерфейс сервісу валідації замовлень
 */
export interface IOrderValidationService extends BaseService {
  validateOrderData(order: OrderDomain): ValidationOperationResult<OrderDomain>;
  validateOrderItems(
    items: CreateOrderDomainRequest['items']
  ): ValidationOperationResult<CreateOrderDomainRequest['items']>;
  validatePaymentData(
    totalAmount: number,
    paidAmount: number,
    paymentMethod: string
  ): ValidationOperationResult<{ totalAmount: number; paidAmount: number; paymentMethod: string }>;
  validateCompletionDate(date: Date, expediteType: string): ValidationOperationResult<Date>;
}

/**
 * Параметри пошуку замовлень
 */
export interface OrderSearchParams {
  query?: string;
  receiptNumber?: string;
  clientId?: string;
  branchId?: string;
  status?: OrderStatus;
  dateFrom?: Date;
  dateTo?: Date;
  page?: number;
  size?: number;
}
