/**
 * @fileoverview Інтерфейс для CRUD операцій з предметами
 * @module domain/wizard/services/stage-3-item-management/item-wizard/interfaces/item-operations
 */

import type {
  WizardOrderItem,
  WizardOrderItemCreate,
  WizardOrderItemUpdate,
} from '../../../../schemas';
import type { ItemOperationResult } from '../types/item-operation-result.types';

/**
 * Інтерфейс для операцій з предметами
 */
export interface IItemOperationsService {
  /**
   * Створення нового предмета
   */
  createItem(
    orderId: string,
    itemData: WizardOrderItemCreate
  ): Promise<ItemOperationResult<WizardOrderItem>>;

  /**
   * Оновлення предмета
   */
  updateItem(
    orderId: string,
    itemId: string,
    itemData: WizardOrderItemUpdate
  ): Promise<ItemOperationResult<WizardOrderItem>>;

  /**
   * Видалення предмета
   */
  deleteItem(orderId: string, itemId: string): Promise<ItemOperationResult<void>>;

  /**
   * Дублювання предмета
   */
  duplicateItem(orderId: string, itemId: string): Promise<ItemOperationResult<WizardOrderItem>>;
}
