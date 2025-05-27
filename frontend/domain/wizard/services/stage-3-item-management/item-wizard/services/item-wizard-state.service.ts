/**
 * @fileoverview Сервіс для управління станом процесу додавання предметів
 * @module domain/wizard/services/stage-3-item-management/item-wizard/services/item-wizard-state
 */

import { WizardOrderItem } from '../../../../adapters/order/types';
import {
  ItemWizardState,
  ItemWizardStep,
  ItemWizardStepStatus
} from '../types/item-wizard.types';

/**
 * Сервіс для управління станом процесу додавання предметів
 */
export class ItemWizardStateService {
  // Поточний стан візарда
  private state: ItemWizardState;

  constructor() {
    this.state = this.createInitialState();
  }

  /**
   * Створення початкового стану
   */
  private createInitialState(): ItemWizardState {
    const initialStep = ItemWizardStep.BASIC_INFO;

    // Ініціалізація статусів усіх етапів
    const steps: Record<ItemWizardStep, { status: ItemWizardStepStatus, isAvailable: boolean, isCompleted: boolean }> = {
      [ItemWizardStep.BASIC_INFO]: {
        status: ItemWizardStepStatus.NOT_STARTED,
        isAvailable: true,
        isCompleted: false
      },
      [ItemWizardStep.ITEM_CHARACTERISTICS]: {
        status: ItemWizardStepStatus.NOT_STARTED,
        isAvailable: false,
        isCompleted: false
      },
      [ItemWizardStep.DEFECTS_AND_RISKS]: {
        status: ItemWizardStepStatus.NOT_STARTED,
        isAvailable: false,
        isCompleted: false
      },
      [ItemWizardStep.PRICE_CALCULATION]: {
        status: ItemWizardStepStatus.NOT_STARTED,
        isAvailable: false,
        isCompleted: false
      },
      [ItemWizardStep.PHOTO_MANAGEMENT]: {
        status: ItemWizardStepStatus.NOT_STARTED,
        isAvailable: false,
        isCompleted: false
      },
      [ItemWizardStep.SUMMARY]: {
        status: ItemWizardStepStatus.NOT_STARTED,
        isAvailable: false,
        isCompleted: false
      }
    };

    return {
      currentStep: initialStep,
      steps,
      items: [],
      loading: false
    };
  }

  /**
   * Отримання поточного стану
   */
  getState(): ItemWizardState {
    return { ...this.state };
  }

  /**
   * Скидання стану до початкового
   */
  resetState(): void {
    this.state = this.createInitialState();
  }

  /**
   * Оновлення стану
   * @param updatedState Новий стан
   */
  updateState(updatedState: Partial<ItemWizardState>): void {
    this.state = {
      ...this.state,
      ...updatedState
    };
  }

  /**
   * Встановлення поточного етапу
   * @param step Етап
   */
  setCurrentStep(step: ItemWizardStep): void {
    this.state.currentStep = step;
  }

  /**
   * Отримання поточного етапу
   */
  getCurrentStep(): ItemWizardStep {
    return this.state.currentStep;
  }

  /**
   * Оновлення статусу етапу
   * @param step Етап
   * @param status Статус
   * @param isAvailable Доступність
   * @param isCompleted Завершеність
   */
  updateStepStatus(
    step: ItemWizardStep,
    status: ItemWizardStepStatus,
    isAvailable: boolean,
    isCompleted: boolean
  ): void {
    this.state.steps[step] = {
      status,
      isAvailable,
      isCompleted
    };
  }

  /**
   * Встановлення поточного предмета
   * @param item Предмет
   */
  setCurrentItem(item?: WizardOrderItem): void {
    this.state.currentItem = item;
  }

  /**
   * Отримання поточного предмета
   */
  getCurrentItem(): WizardOrderItem | undefined {
    return this.state.currentItem;
  }

  /**
   * Додавання предмета до списку
   * @param item Предмет
   */
  addItem(item: WizardOrderItem): void {
    const updatedItems = [...this.state.items];
    const existingItemIndex = updatedItems.findIndex(i => i.id === item.id);

    if (existingItemIndex >= 0) {
      updatedItems[existingItemIndex] = item;
    } else {
      updatedItems.push(item);
    }

    this.state.items = updatedItems;
  }

  /**
   * Видалення предмета зі списку
   * @param itemId ID предмета
   */
  removeItem(itemId: string): void {
    this.state.items = this.state.items.filter(item => item.id !== itemId);
  }

  /**
   * Встановлення списку предметів
   * @param items Список предметів
   */
  setItems(items: WizardOrderItem[]): void {
    this.state.items = items;
  }

  /**
   * Отримання списку предметів
   */
  getItems(): WizardOrderItem[] {
    return [...this.state.items];
  }

  /**
   * Встановлення стану завантаження
   * @param loading Стан завантаження
   */
  setLoading(loading: boolean): void {
    this.state.loading = loading;
  }

  /**
   * Отримання стану завантаження
   */
  isLoading(): boolean {
    return this.state.loading;
  }

  /**
   * Встановлення помилки
   * @param error Помилка
   */
  setError(error?: string): void {
    this.state.error = error;
  }

  /**
   * Отримання помилки
   */
  getError(): string | undefined {
    return this.state.error;
  }

  /**
   * Перевірка, чи доступний етап
   * @param step Етап
   */
  isStepAvailable(step: ItemWizardStep): boolean {
    return this.state.steps[step].isAvailable;
  }

  /**
   * Перевірка, чи завершений етап
   * @param step Етап
   */
  isStepCompleted(step: ItemWizardStep): boolean {
    return this.state.steps[step].isCompleted;
  }
}
