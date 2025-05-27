/**
 * @fileoverview Основний інтерфейс item wizard сервісу
 * @module domain/wizard/services/stage-3-item-management/item-wizard/interfaces/item-wizard-main
 */

import type { WizardOrderItem, WizardOrderItemDetailed } from '../../../../schemas';
import type { ItemOperationResult } from '../types/item-operation-result.types';
import type { ItemWizardStep } from '../types/item-wizard-steps.types';
import type { ItemWizardState } from '../types/item-wizard-state.types';

/**
 * Основний інтерфейс item wizard сервісу
 */
export interface IItemWizardService {
  /**
   * Встановлення ID замовлення
   */
  setOrderId(orderId: string): void;

  /**
   * Отримання поточного стану
   */
  getState(): ItemWizardState;

  /**
   * Початок додавання нового предмета
   */
  startNewItem(): Promise<ItemOperationResult<void>>;

  /**
   * Перехід до наступного кроку
   */
  goToNextStep(): Promise<ItemOperationResult<ItemWizardStep>>;

  /**
   * Перехід до попереднього кроку
   */
  goToPreviousStep(): Promise<ItemOperationResult<ItemWizardStep>>;

  /**
   * Перехід до конкретного кроку
   */
  goToStep(step: ItemWizardStep): Promise<ItemOperationResult<ItemWizardStep>>;

  /**
   * Збереження поточного предмета
   */
  saveCurrentItem(): Promise<ItemOperationResult<WizardOrderItem>>;

  /**
   * Скасування поточного предмета
   */
  cancelCurrentItem(): Promise<ItemOperationResult<void>>;

  /**
   * Оновлення поточного предмета
   */
  updateCurrentItem(
    updates: Partial<WizardOrderItemDetailed>
  ): Promise<ItemOperationResult<WizardOrderItem>>;

  /**
   * Отримання всіх предметів
   */
  getAllItems(): WizardOrderItem[];

  /**
   * Завантаження всіх предметів
   */
  loadAllItems(): Promise<ItemOperationResult<WizardOrderItem[]>>;

  /**
   * Отримання деталей предмета
   */
  getItemDetails(itemId: string): Promise<ItemOperationResult<WizardOrderItemDetailed>>;

  /**
   * Редагування існуючого предмета
   */
  editItem(itemId: string): Promise<ItemOperationResult<void>>;

  /**
   * Видалення предмета
   */
  removeItem(itemId: string): Promise<ItemOperationResult<void>>;

  /**
   * Розрахунок загальної ціни
   */
  calculateTotalPrice(): number;
}
