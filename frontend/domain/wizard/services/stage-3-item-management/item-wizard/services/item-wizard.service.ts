/**
 * @fileoverview Основний сервіс для управління процесом додавання предметів у Order Wizard
 * @module domain/wizard/services/stage-3-item-management/item-wizard/services/item-wizard
 */

import { ItemWizardApiService } from './item-wizard-api.service';
import { ItemWizardOperationsService } from './item-wizard-operations.service';
import { ItemWizardStateService } from './item-wizard-state.service';
import { WizardOrderItem, WizardOrderItemDetailed } from '../../../../adapters/order/types';
import {
  IItemWizardService,
  IItemWizardNavigationService,
  IItemWizardValidationService
} from '../interfaces/item-wizard.interfaces';
import {
  ItemWizardStep,
  ItemWizardStepStatus,
  ItemOperationResult
} from '../types/item-wizard.types';

import type { ItemWizardState } from '../types/item-wizard.types';

/**
 * Константа для відображення невідомої помилки
 */
const UNKNOWN_ERROR = 'Невідома помилка';

/**
 * Основний сервіс для управління процесом додавання предметів
 * @implements IItemWizardService
 */
export class ItemWizardService implements IItemWizardService {
  private stateService: ItemWizardStateService;
  private apiService: ItemWizardApiService;
  private operationsService: ItemWizardOperationsService;

  /**
   * Конструктор сервісу
   * @param navigationService Сервіс для навігації між етапами
   * @param validationService Сервіс для валідації даних
   * @param orderId ID замовлення (опційно)
   */
  constructor(
    private navigationService: IItemWizardNavigationService,
    private validationService: IItemWizardValidationService,
    orderId?: string
  ) {
    this.stateService = new ItemWizardStateService();
    this.apiService = new ItemWizardApiService(orderId);
    this.operationsService = new ItemWizardOperationsService(
      this.stateService,
      this.apiService,
      this.validationService
    );
  }

  /**
   * Встановлення ID замовлення
   * @param orderId ID замовлення
   */
  setOrderId(orderId: string): void {
    this.apiService.setOrderId(orderId);
  }

  /**
   * Отримання поточного стану Item Wizard
   */
  getState(): ItemWizardState {
    return this.stateService.getState();
  }

  /**
   * Ініціалізація нового процесу додавання предмета
   */
  async startNewItem(): Promise<ItemOperationResult<void>> {
    try {
      if (!this.apiService.getOrderId()) {
        return {
          success: false,
          error: 'ID замовлення не встановлено'
        };
      }

      // Скидаємо стан до початкового
      this.stateService.resetState();

      // Встановлюємо початковий етап
      const initialStep = this.navigationService.getFirstStep();
      this.stateService.setCurrentStep(initialStep);

      // Оновлюємо статус початкового етапу
      this.stateService.updateStepStatus(
        initialStep,
        ItemWizardStepStatus.IN_PROGRESS,
        true,
        false
      );

      return {
        success: true
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : UNKNOWN_ERROR
      };
    }
  }

  /**
   * Перехід до наступного етапу додавання предмета
   */
  async goToNextStep(): Promise<ItemOperationResult<ItemWizardStep>> {
    try {
      // Валідація поточного етапу
      const currentState = this.stateService.getState();
      const validationResult = await this.validationService.validateCurrentStep(currentState);

      if (!validationResult.success) {
        return {
          success: false,
          error: validationResult.error,
          validationErrors: validationResult.validationErrors
        };
      }

      // Отримуємо поточний та наступний етапи
      const currentStep = this.stateService.getCurrentStep();
      const nextStepResult = this.navigationService.getNextStep(currentStep);

      if (!nextStepResult.success || !nextStepResult.currentStep) {
        return {
          success: false,
          error: nextStepResult.error || 'Не вдалося перейти до наступного етапу'
        };
      }

      const nextStep = nextStepResult.currentStep;

      // Позначаємо поточний етап як завершений
      this.stateService.updateStepStatus(
        currentStep,
        ItemWizardStepStatus.COMPLETED,
        true,
        true
      );

      // Активуємо наступний етап
      this.stateService.updateStepStatus(
        nextStep,
        ItemWizardStepStatus.IN_PROGRESS,
        true,
        false
      );

      // Оновлюємо поточний етап
      this.stateService.setCurrentStep(nextStep);

      return {
        success: true,
        data: nextStep
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : UNKNOWN_ERROR
      };
    }
  }

  /**
   * Перехід до попереднього етапу додавання предмета
   */
  async goToPreviousStep(): Promise<ItemOperationResult<ItemWizardStep>> {
    try {
      // Отримуємо поточний та попередній етапи
      const currentStep = this.stateService.getCurrentStep();
      const prevStepResult = this.navigationService.getPreviousStep(currentStep);

      if (!prevStepResult.success || !prevStepResult.currentStep) {
        return {
          success: false,
          error: prevStepResult.error || 'Не вдалося перейти до попереднього етапу'
        };
      }

      const prevStep = prevStepResult.currentStep;

      // Позначаємо поточний етап як неактивний
      this.stateService.updateStepStatus(
        currentStep,
        ItemWizardStepStatus.NOT_STARTED,
        true,
        this.stateService.isStepCompleted(currentStep)
      );

      // Активуємо попередній етап
      this.stateService.updateStepStatus(
        prevStep,
        ItemWizardStepStatus.IN_PROGRESS,
        true,
        this.stateService.isStepCompleted(prevStep)
      );

      // Оновлюємо поточний етап
      this.stateService.setCurrentStep(prevStep);

      return {
        success: true,
        data: prevStep
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : UNKNOWN_ERROR
      };
    }
  }

  /**
   * Перехід до конкретного етапу додавання предмета
   * @param step Етап для переходу
   */
  async goToStep(step: ItemWizardStep): Promise<ItemOperationResult<ItemWizardStep>> {
    try {
      // Перевіряємо доступність етапу
      if (!this.stateService.isStepAvailable(step)) {
        return {
          success: false,
          error: 'Вказаний етап недоступний для переходу'
        };
      }

      // Отримання деталів про етап
      const stepResult = this.navigationService.getSpecificStep(step);

      if (!stepResult.success || !stepResult.currentStep) {
        return {
          success: false,
          error: stepResult.error || 'Не вдалося перейти до вказаного етапу'
        };
      }

      const currentStep = this.stateService.getCurrentStep();

      // Позначаємо поточний етап як неактивний
      this.stateService.updateStepStatus(
        currentStep,
        ItemWizardStepStatus.NOT_STARTED,
        true,
        this.stateService.isStepCompleted(currentStep)
      );

      // Активуємо вказаний етап
      this.stateService.updateStepStatus(
        step,
        ItemWizardStepStatus.IN_PROGRESS,
        true,
        this.stateService.isStepCompleted(step)
      );

      // Оновлюємо поточний етап
      this.stateService.setCurrentStep(step);

      return {
        success: true,
        data: step
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : UNKNOWN_ERROR
      };
    }
  }

  // Делегування методів до operationsService

  saveCurrentItem(): Promise<ItemOperationResult<WizardOrderItem>> {
    return this.operationsService.saveCurrentItem();
  }

  cancelCurrentItem(): Promise<ItemOperationResult<void>> {
    return this.operationsService.cancelCurrentItem();
  }

  getAllItems(): WizardOrderItem[] {
    return this.stateService.getItems();
  }

  loadAllItems(): Promise<ItemOperationResult<WizardOrderItem[]>> {
    return this.operationsService.loadAllItems();
  }

  getItemDetails(itemId: string): Promise<ItemOperationResult<WizardOrderItemDetailed>> {
    return this.operationsService.getItemDetails(itemId);
  }

  editItem(itemId: string): Promise<ItemOperationResult<void>> {
    return this.operationsService.editItem(itemId);
  }

  removeItem(itemId: string): Promise<ItemOperationResult<void>> {
    return this.operationsService.removeItem(itemId);
  }

  calculateTotalPrice(): number {
    return this.operationsService.calculateTotalPrice();
  }

  updateCurrentItem(updates: Partial<WizardOrderItem>): Promise<ItemOperationResult<WizardOrderItem>> {
    return this.operationsService.updateCurrentItem(updates);
  }
}
