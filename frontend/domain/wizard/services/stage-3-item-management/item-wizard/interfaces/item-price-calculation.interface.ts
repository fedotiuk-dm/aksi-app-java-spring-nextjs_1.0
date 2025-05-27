/**
 * @fileoverview Інтерфейс для розрахунку цін предметів
 * @module domain/wizard/services/stage-3-item-management/item-wizard/interfaces/item-price-calculation
 */

import type { WizardOrderItem, WizardOrderItemDetailed } from '../../../../schemas';
import type { ItemOperationResult } from '../types/item-operation-result.types';

/**
 * Інтерфейс для розрахунку цін
 */
export interface IItemPriceCalculationService {
  /**
   * Розрахунок базової ціни предмета
   */
  calculateBasePrice(categoryName: string, itemName: string): Promise<ItemOperationResult<number>>;

  /**
   * Розрахунок фінальної ціни з модифікаторами
   */
  calculateFinalPrice(
    itemData: Partial<WizardOrderItemDetailed>
  ): Promise<ItemOperationResult<number>>;

  /**
   * Розрахунок загальної вартості всіх предметів
   */
  calculateTotalPrice(items: WizardOrderItem[]): number;

  /**
   * Отримання детального розрахунку ціни
   */
  getDetailedPriceCalculation(
    itemData: Partial<WizardOrderItemDetailed>
  ): Promise<ItemOperationResult<any>>;
}
