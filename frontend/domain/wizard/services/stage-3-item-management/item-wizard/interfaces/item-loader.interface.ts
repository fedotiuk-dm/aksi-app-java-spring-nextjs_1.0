/**
 * @fileoverview Інтерфейс сервісу завантаження предметів
 * @module domain/wizard/services/stage-3-item-management/item-wizard/interfaces/item-loader
 */

import type { WizardOrderItem, WizardOrderItemDetailed } from '../../../../schemas';
import type { ItemOperationResult } from '../types/item-operation-result.types';

/**
 * Інтерфейс для завантаження предметів
 */
export interface IItemLoaderService {
  /**
   * Завантаження всіх предметів замовлення
   */
  loadAllItems(orderId: string): Promise<ItemOperationResult<WizardOrderItem[]>>;

  /**
   * Завантаження предмета за ID
   */
  loadItemById(
    orderId: string,
    itemId: string
  ): Promise<ItemOperationResult<WizardOrderItemDetailed>>;

  /**
   * Очищення кешу
   */
  clearCache(): void;

  /**
   * Примусове оновлення даних
   */
  forceReload(orderId: string): Promise<ItemOperationResult<WizardOrderItem[]>>;
}
