/**
 * @fileoverview Типи стану item wizard
 * @module domain/wizard/services/stage-3-item-management/item-wizard/types/item-wizard-state
 */

import type { ItemWizardStep, ItemWizardStepInfo } from './item-wizard-steps.types';
import type { WizardOrderItem, WizardOrderItemDetailed } from '../../../../schemas';

/**
 * Стан item wizard
 */
export interface ItemWizardState {
  // Поточний стан
  currentStep: ItemWizardStep;
  isLoading: boolean;
  error?: string;

  // Інформація про кроки
  steps: Record<ItemWizardStep, ItemWizardStepInfo>;

  // Дані предмета
  currentItem: Partial<WizardOrderItemDetailed>;
  allItems: WizardOrderItem[];

  // Розрахунки
  totalPrice: number;

  // Налаштування
  orderId?: string;
  isEditing: boolean;
  editingItemId?: string;
}

/**
 * Стан сервісу завантаження предметів
 */
export interface ItemLoaderServiceState {
  items: WizardOrderItem[];
  loading: boolean;
  error?: string;
  lastLoadTime: number;
  orderId?: string;
}
