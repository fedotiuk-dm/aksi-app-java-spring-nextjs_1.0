/**
 * @fileoverview Сервіс CRUD операцій з предметами замовлення
 * @module domain/wizard/services/stage-3-item-management/item-wizard/services/item-operations
 */

import {
  addOrderItem,
  updateOrderItem,
  deleteOrderItem,
  getOrderItemById,
} from '../../../../adapters/order/api';
import {
  wizardOrderItemSchema,
  wizardOrderItemCreateSchema,
  wizardOrderItemUpdateSchema,
  type WizardOrderItem,
  type WizardOrderItemCreate,
  type WizardOrderItemUpdate,
} from '../../../../schemas';
import { ITEM_OPERATIONS_ERRORS } from '../constants/item-operations.errors';

import type { IItemOperationsService } from '../interfaces/item-operations.interface';
import type { ItemOperationResult } from '../types/item-operation-result.types';

/**
 * Сервіс для CRUD операцій з предметами замовлення
 */
export class ItemOperationsService implements IItemOperationsService {
  /**
   * Створення нового предмета
   */
  async createItem(
    orderId: string,
    itemData: WizardOrderItemCreate
  ): Promise<ItemOperationResult<WizardOrderItem>> {
    try {
      const validationResult = this.validateCreateInput(orderId, itemData);
      if (!validationResult.success) {
        return validationResult;
      }

      const adapterResult = await addOrderItem(orderId, itemData);
      return this.processApiResult(adapterResult, ITEM_OPERATIONS_ERRORS.CREATE_FAILED);
    } catch (error) {
      return this.handleError(error, ITEM_OPERATIONS_ERRORS.CREATE_FAILED);
    }
  }

  /**
   * Оновлення предмета
   */
  async updateItem(
    orderId: string,
    itemId: string,
    itemData: WizardOrderItemUpdate
  ): Promise<ItemOperationResult<WizardOrderItem>> {
    try {
      const validationResult = this.validateUpdateInput(orderId, itemId, itemData);
      if (!validationResult.success) {
        return validationResult;
      }

      const adapterResult = await updateOrderItem(orderId, itemId, itemData);
      return this.processApiResult(adapterResult, ITEM_OPERATIONS_ERRORS.UPDATE_FAILED);
    } catch (error) {
      return this.handleError(error, ITEM_OPERATIONS_ERRORS.UPDATE_FAILED);
    }
  }

  /**
   * Видалення предмета
   */
  async deleteItem(orderId: string, itemId: string): Promise<ItemOperationResult<void>> {
    try {
      const validationResult = this.validateDeleteInput(orderId, itemId);
      if (!validationResult.success) {
        return validationResult;
      }

      const adapterResult = await deleteOrderItem(orderId, itemId);

      if (!adapterResult.success) {
        return {
          success: false,
          error: adapterResult.error || ITEM_OPERATIONS_ERRORS.DELETE_FAILED,
        };
      }

      return { success: true };
    } catch (error) {
      return this.handleError(error, ITEM_OPERATIONS_ERRORS.DELETE_FAILED);
    }
  }

  /**
   * Дублювання предмета
   */
  async duplicateItem(
    orderId: string,
    itemId: string
  ): Promise<ItemOperationResult<WizardOrderItem>> {
    try {
      const validationResult = this.validateDeleteInput(orderId, itemId);
      if (!validationResult.success) {
        return validationResult;
      }

      const originalItemResult = await getOrderItemById(orderId, itemId);

      if (!originalItemResult.success || !originalItemResult.data) {
        return {
          success: false,
          error: originalItemResult.error || ITEM_OPERATIONS_ERRORS.ITEM_NOT_FOUND,
        };
      }

      const duplicateData = this.prepareDuplicateData(originalItemResult.data);
      return this.createItem(orderId, duplicateData);
    } catch (error) {
      return this.handleError(error, ITEM_OPERATIONS_ERRORS.DUPLICATE_FAILED);
    }
  }

  /**
   * Приватні методи валідації
   */
  private validateCreateInput(
    orderId: string,
    itemData: WizardOrderItemCreate
  ): { success: boolean; error?: string; validationErrors?: string[] } {
    if (!this.isValidOrderId(orderId)) {
      return { success: false, error: ITEM_OPERATIONS_ERRORS.INVALID_ORDER_ID };
    }

    const validationResult = wizardOrderItemCreateSchema.safeParse(itemData);
    if (!validationResult.success) {
      return {
        success: false,
        error: ITEM_OPERATIONS_ERRORS.VALIDATION_FAILED,
        validationErrors: validationResult.error.errors.map((err) => err.message),
      };
    }

    return { success: true };
  }

  private validateUpdateInput(
    orderId: string,
    itemId: string,
    itemData: WizardOrderItemUpdate
  ): { success: boolean; error?: string; validationErrors?: string[] } {
    if (!this.isValidOrderId(orderId)) {
      return { success: false, error: ITEM_OPERATIONS_ERRORS.INVALID_ORDER_ID };
    }

    if (!this.isValidItemId(itemId)) {
      return { success: false, error: ITEM_OPERATIONS_ERRORS.INVALID_ITEM_ID };
    }

    const validationResult = wizardOrderItemUpdateSchema.safeParse(itemData);
    if (!validationResult.success) {
      return {
        success: false,
        error: ITEM_OPERATIONS_ERRORS.VALIDATION_FAILED,
        validationErrors: validationResult.error.errors.map((err) => err.message),
      };
    }

    return { success: true };
  }

  private validateDeleteInput(
    orderId: string,
    itemId: string
  ): { success: boolean; error?: string } {
    if (!this.isValidOrderId(orderId)) {
      return { success: false, error: ITEM_OPERATIONS_ERRORS.INVALID_ORDER_ID };
    }

    if (!this.isValidItemId(itemId)) {
      return { success: false, error: ITEM_OPERATIONS_ERRORS.INVALID_ITEM_ID };
    }

    return { success: true };
  }

  private isValidOrderId(orderId: string): boolean {
    return Boolean(orderId && typeof orderId === 'string');
  }

  private isValidItemId(itemId: string): boolean {
    return Boolean(itemId && typeof itemId === 'string');
  }

  private processApiResult(
    adapterResult: any,
    defaultError: string
  ): ItemOperationResult<WizardOrderItem> {
    if (!adapterResult.success || !adapterResult.data) {
      return { success: false, error: adapterResult.error || defaultError };
    }

    const validationResult = wizardOrderItemSchema.safeParse(adapterResult.data);
    if (!validationResult.success) {
      console.error('Помилка валідації результату:', validationResult.error);
      return { success: false, error: ITEM_OPERATIONS_ERRORS.VALIDATION_FAILED };
    }

    return { success: true, data: validationResult.data };
  }

  private prepareDuplicateData(originalData: any): WizardOrderItemCreate {
    const { id, basePrice, finalPrice, ...itemDataToDuplicate } = originalData;

    return {
      ...itemDataToDuplicate,
      itemName: `${itemDataToDuplicate.itemName} (копія)`,
    };
  }

  private handleError(error: unknown, defaultMessage: string): ItemOperationResult<any> {
    const errorMessage = error instanceof Error ? error.message : defaultMessage;
    console.error('Помилка операції з предметом:', error);
    return { success: false, error: errorMessage };
  }
}

// Експортуємо singleton екземпляр
export const itemOperationsService = new ItemOperationsService();
