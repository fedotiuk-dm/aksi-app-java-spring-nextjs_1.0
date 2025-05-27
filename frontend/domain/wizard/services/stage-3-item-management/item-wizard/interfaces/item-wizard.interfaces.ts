/**
 * @fileoverview Інтерфейси для сервісів менеджера предметів Order Wizard
 * @module domain/wizard/services/stage-3-item-management/item-wizard/interfaces
 */

import {
  WizardOrderItem,
  WizardOrderItemDetailed
} from '../../../../adapters/order/types';
import {
  ItemOperationResult,
  ItemWizardState,
  ItemWizardStep,
  ItemWizardNavigationResult
} from '../types';


/**
 * Інтерфейс для основного сервісу управління циклічним процесом додавання предметів
 */
export interface IItemWizardService {
  /**
   * Отримання поточного стану Item Wizard
   */
  getState(): ItemWizardState;

  /**
   * Ініціалізація нового процесу додавання предмета
   */
  startNewItem(): Promise<ItemOperationResult<void>>;

  /**
   * Перехід до наступного етапу додавання предмета
   */
  goToNextStep(): Promise<ItemOperationResult<ItemWizardStep>>;

  /**
   * Перехід до попереднього етапу додавання предмета
   */
  goToPreviousStep(): Promise<ItemOperationResult<ItemWizardStep>>;

  /**
   * Перехід до конкретного етапу додавання предмета
   * @param step Етап для переходу
   */
  goToStep(step: ItemWizardStep): Promise<ItemOperationResult<ItemWizardStep>>;

  /**
   * Збереження поточного предмета і додавання його до списку предметів замовлення
   */
  saveCurrentItem(): Promise<ItemOperationResult<WizardOrderItem>>;

  /**
   * Скасування додавання поточного предмета
   */
  cancelCurrentItem(): Promise<ItemOperationResult<void>>;

  /**
   * Отримання списку всіх доданих предметів
   */
  getAllItems(): WizardOrderItem[];

  /**
   * Отримання детальної інформації про предмет за його ID
   * @param itemId ID предмета
   */
  getItemDetails(itemId: string): Promise<ItemOperationResult<WizardOrderItemDetailed>>;

  /**
   * Редагування існуючого предмета
   * @param itemId ID предмета
   */
  editItem(itemId: string): Promise<ItemOperationResult<void>>;

  /**
   * Видалення предмета зі списку
   * @param itemId ID предмета
   */
  removeItem(itemId: string): Promise<ItemOperationResult<void>>;

  /**
   * Розрахунок загальної вартості всіх предметів
   */
  calculateTotalPrice(): number;
}

/**
 * Інтерфейс для сервісу навігації між етапами додавання предмета
 */
export interface IItemWizardNavigationService {
  /**
   * Отримання першого етапу
   */
  getFirstStep(): ItemWizardStep;

  /**
   * Перевірка можливості переходу до наступного етапу
   */
  canGoToNextStep(): boolean;

  /**
   * Перевірка можливості переходу до попереднього етапу
   */
  canGoToPreviousStep(): boolean;

  /**
   * Перевірка можливості переходу до конкретного етапу
   * @param step Етап для перевірки
   */
  canGoToStep(step: ItemWizardStep): boolean;

  /**
   * Перехід до наступного етапу
   */
  goToNextStep(): ItemWizardStep;

  /**
   * Перехід до попереднього етапу
   */
  goToPreviousStep(): ItemWizardStep;

  /**
   * Перехід до конкретного етапу
   * @param step Етап для переходу
   */
  goToStep(step: ItemWizardStep): ItemWizardStep;

  /**
   * Отримання поточного етапу
   */
  getCurrentStep(): ItemWizardStep;

  /**
   * Перевірка, чи завершено поточний етап
   */
  isCurrentStepCompleted(): boolean;

  /**
   * Отримання наступного етапу
   * @param currentStep Поточний етап
   */
  getNextStep(currentStep: ItemWizardStep): ItemWizardNavigationResult;

  /**
   * Отримання попереднього етапу
   * @param currentStep Поточний етап
   */
  getPreviousStep(currentStep: ItemWizardStep): ItemWizardNavigationResult;

  /**
   * Отримання конкретного етапу
   * @param step Етап для отримання
   */
  getSpecificStep(step: ItemWizardStep): ItemWizardNavigationResult;
}

/**
 * Інтерфейс для сервісу валідації етапів та даних предмета
 */
export interface IItemWizardValidationService {
  /**
   * Валідація даних поточного етапу
   * @param state Поточний стан візарда
   */
  validateCurrentStep(state: ItemWizardState): Promise<ItemOperationResult<boolean>>;

  /**
   * Валідація всіх даних предмета перед збереженням
   * @param state Поточний стан візарда
   */
  validateAllSteps(state: ItemWizardState): Promise<ItemOperationResult<boolean>>;

  /**
   * Перевірка готовності предмета до збереження
   * @param state Поточний стан візарда
   */
  isItemReadyToSave(state: ItemWizardState): boolean;
}
