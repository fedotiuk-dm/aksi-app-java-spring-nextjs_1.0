/**
 * @fileoverview Інтерфейси для сервісів ініціалізації замовлення
 * @module domain/wizard/services/stage-1-client-and-order-info/order-initialization/interfaces
 */

import {
  type OrderInitializationData,
  type Branch,
  type GenerateReceiptNumberRequest,
  type ValidateUniqueLabelRequest,
  type OrderInitializationResult
} from '../types/order-initialization.types';

import type { OperationResult } from '../../../shared/types/base.types';

/**
 * Інтерфейс сервісу ініціалізації замовлення
 */
export interface IOrderInitializationService {
  /**
   * Генерація номера квитанції
   * @param request Параметри для генерації
   */
  generateReceiptNumber(
    request?: GenerateReceiptNumberRequest
  ): Promise<OperationResult<string>>;

  /**
   * Валідація формату унікальної мітки
   * @param label Унікальна мітка для валідації
   */
  validateUniqueLabelFormat(label: string): OperationResult<boolean>;

  /**
   * Перевірка унікальності мітки
   * @param request Параметри для перевірки
   */
  validateUniqueLabel(
    request: ValidateUniqueLabelRequest
  ): Promise<OperationResult<boolean>>;

  /**
   * Отримання списку філій
   */
  loadBranches(): Promise<OperationResult<Branch[]>>;

  /**
   * Валідація даних для ініціалізації замовлення
   * @param data Дані для валідації
   */
  validateOrderInitializationData(
    data: Partial<OrderInitializationData>
  ): OperationResult<OrderInitializationData> & {
    isValid: boolean;
    validationErrors: Record<string, string>;
  };

  /**
   * Ініціалізація нового замовлення
   * @param data Дані для ініціалізації
   */
  initializeOrder(data: OrderInitializationData): Promise<OrderInitializationResult>;
}
