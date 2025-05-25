/**
 * @fileoverview API функції для основних операцій з замовленнями
 * @module domain/wizard/adapters/order
 */

import { OrderManagementBasicOperationsService } from '@/lib/api';

import {
  mapOrderDTOToDomain,
  mapOrderArrayToDomain,
  mapDomainToCreateRequest,
} from './order.mapper';

import type { OrderSummary, OrderStatus } from '../../types';

/**
 * Отримання всіх замовлень
 */
export async function getAllOrders(): Promise<OrderSummary[]> {
  try {
    const apiResponse = await OrderManagementBasicOperationsService.getAllOrders();
    return mapOrderArrayToDomain(apiResponse);
  } catch (error) {
    console.error('Помилка при отриманні всіх замовлень:', error);
    throw new Error(`Не вдалося отримати замовлення: ${error}`);
  }
}

/**
 * Отримання замовлення за ID
 */
export async function getOrderById(id: string): Promise<OrderSummary> {
  try {
    const apiResponse = await OrderManagementBasicOperationsService.getOrderById({ id });
    return mapOrderDTOToDomain(apiResponse);
  } catch (error) {
    console.error(`Помилка при отриманні замовлення ${id}:`, error);
    throw new Error(`Не вдалося отримати замовлення: ${error}`);
  }
}

/**
 * Створення нового замовлення
 */
export async function createOrder(domainData: Partial<OrderSummary>): Promise<OrderSummary> {
  try {
    const createRequest = mapDomainToCreateRequest(domainData);
    const apiResponse = await OrderManagementBasicOperationsService.createOrder({
      requestBody: createRequest,
    });
    return mapOrderDTOToDomain(apiResponse);
  } catch (error) {
    console.error('Помилка при створенні замовлення:', error);
    throw new Error(`Не вдалося створити замовлення: ${error}`);
  }
}

/**
 * Збереження чернетки замовлення
 */
export async function saveOrderDraft(domainData: Partial<OrderSummary>): Promise<OrderSummary> {
  try {
    const createRequest = mapDomainToCreateRequest(domainData);
    const apiResponse = await OrderManagementBasicOperationsService.saveOrderDraft({
      requestBody: createRequest,
    });
    return mapOrderDTOToDomain(apiResponse);
  } catch (error) {
    console.error('Помилка при збереженні чернетки замовлення:', error);
    throw new Error(`Не вдалося зберегти чернетку замовлення: ${error}`);
  }
}

/**
 * Отримання всіх чернеток замовлень
 */
export async function getDraftOrders(): Promise<OrderSummary[]> {
  try {
    const apiResponse = await OrderManagementBasicOperationsService.getDraftOrders();
    return mapOrderArrayToDomain(apiResponse);
  } catch (error) {
    console.error('Помилка при отриманні чернеток замовлень:', error);
    throw new Error(`Не вдалося отримати чернетки замовлень: ${error}`);
  }
}

/**
 * Перетворення чернетки в замовлення
 */
export async function convertDraftToOrder(id: string): Promise<OrderSummary> {
  try {
    const apiResponse = await OrderManagementBasicOperationsService.convertDraftToOrder({ id });
    return mapOrderDTOToDomain(apiResponse);
  } catch (error) {
    console.error(`Помилка при перетворенні чернетки ${id} в замовлення:`, error);
    throw new Error(`Не вдалося перетворити чернетку в замовлення: ${error}`);
  }
}

/**
 * Отримання всіх активних замовлень
 */
export async function getActiveOrders(): Promise<OrderSummary[]> {
  try {
    const apiResponse = await OrderManagementBasicOperationsService.getActiveOrders();
    return mapOrderArrayToDomain(apiResponse);
  } catch (error) {
    console.error('Помилка при отриманні активних замовлень:', error);
    throw new Error(`Не вдалося отримати активні замовлення: ${error}`);
  }
}

/**
 * Оновлення статусу замовлення
 */
export async function updateOrderStatus(id: string, status: OrderStatus): Promise<OrderSummary> {
  try {
    const apiResponse = await OrderManagementBasicOperationsService.updateOrderStatus({
      id,
      status: status as 'DRAFT' | 'NEW' | 'IN_PROGRESS' | 'COMPLETED' | 'DELIVERED' | 'CANCELLED',
    });
    return mapOrderDTOToDomain(apiResponse);
  } catch (error) {
    console.error(`Помилка при оновленні статусу замовлення ${id}:`, error);
    throw new Error(`Не вдалося оновити статус замовлення: ${error}`);
  }
}

/**
 * Завершення замовлення
 */
export async function completeOrder(id: string): Promise<OrderSummary> {
  try {
    const apiResponse = await OrderManagementBasicOperationsService.completeOrder({ id });
    return mapOrderDTOToDomain(apiResponse);
  } catch (error) {
    console.error(`Помилка при завершенні замовлення ${id}:`, error);
    throw new Error(`Не вдалося завершити замовлення: ${error}`);
  }
}

/**
 * Скасування замовлення
 */
export async function cancelOrder(id: string): Promise<void> {
  try {
    await OrderManagementBasicOperationsService.cancelOrder({ id });
  } catch (error) {
    console.error(`Помилка при скасуванні замовлення ${id}:`, error);
    throw new Error(`Не вдалося скасувати замовлення: ${error}`);
  }
}
