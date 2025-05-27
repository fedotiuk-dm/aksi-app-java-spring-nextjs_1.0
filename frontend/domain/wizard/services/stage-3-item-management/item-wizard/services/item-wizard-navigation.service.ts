/**
 * @fileoverview Сервіс для навігації між етапами додавання предметів
 * @module domain/wizard/services/stage-3-item-management/item-wizard/services/item-wizard-navigation
 */

import { IItemWizardNavigationService } from '../interfaces/item-wizard.interfaces';
import {
  ItemWizardStep,
  ItemWizardNavigationResult,
  ItemStepDirection
} from '../types/item-wizard.types';

/**
 * Сервіс для навігації між етапами додавання предметів
 * @implements IItemWizardNavigationService
 */
export class ItemWizardNavigationService implements IItemWizardNavigationService {
  // Послідовність кроків додавання предмета
  private readonly steps: ItemWizardStep[] = [
    ItemWizardStep.BASIC_INFO,
    ItemWizardStep.DEFECTS_AND_RISKS,
    ItemWizardStep.ITEM_CHARACTERISTICS,
    ItemWizardStep.PRICE_CALCULATION,
    ItemWizardStep.PHOTO_MANAGEMENT,
    ItemWizardStep.SUMMARY
  ];

  /**
   * Отримання першого кроку
   */
  getFirstStep(): ItemWizardStep {
    return this.steps[0];
  }

  /**
   * Отримання останнього кроку
   */
  getLastStep(): ItemWizardStep {
    return this.steps[this.steps.length - 1];
  }

  /**
   * Перевірка, чи є крок першим
   * @param step Поточний крок
   */
  isFirstStep(step: ItemWizardStep): boolean {
    return step === this.getFirstStep();
  }

  /**
   * Перевірка, чи є крок останнім
   * @param step Поточний крок
   */
  isLastStep(step: ItemWizardStep): boolean {
    return step === this.getLastStep();
  }

  /**
   * Перевірка можливості переходу до наступного етапу
   */
  canGoToNextStep(): boolean {
    const currentIndex = this.steps.indexOf(this.getCurrentStep());
    return currentIndex < this.steps.length - 1;
  }

  /**
   * Перевірка можливості переходу до попереднього етапу
   */
  canGoToPreviousStep(): boolean {
    const currentIndex = this.steps.indexOf(this.getCurrentStep());
    return currentIndex > 0;
  }

  /**
   * Перевірка можливості переходу до конкретного етапу
   * @param step Етап для перевірки
   */
  canGoToStep(step: ItemWizardStep): boolean {
    return this.steps.includes(step);
  }

  /**
   * Перехід до наступного етапу
   */
  goToNextStep(): ItemWizardStep {
    if (!this.canGoToNextStep()) {
      return this.getCurrentStep();
    }

    const currentIndex = this.steps.indexOf(this.getCurrentStep());
    return this.steps[currentIndex + 1];
  }

  /**
   * Перехід до попереднього етапу
   */
  goToPreviousStep(): ItemWizardStep {
    if (!this.canGoToPreviousStep()) {
      return this.getCurrentStep();
    }

    const currentIndex = this.steps.indexOf(this.getCurrentStep());
    return this.steps[currentIndex - 1];
  }

  /**
   * Перехід до конкретного етапу
   * @param step Етап для переходу
   */
  goToStep(step: ItemWizardStep): ItemWizardStep {
    if (!this.canGoToStep(step)) {
      return this.getCurrentStep();
    }

    return step;
  }

  /**
   * Отримання поточного етапу
   */
  getCurrentStep(): ItemWizardStep {
    // Ця функція буде перевизначена в реальній реалізації
    return ItemWizardStep.BASIC_INFO;
  }

  /**
   * Перевірка, чи завершено поточний етап
   */
  isCurrentStepCompleted(): boolean {
    // Ця функція буде перевизначена в реальній реалізації
    return false;
  }

  /**
   * Отримання наступного кроку
   * @param currentStep Поточний крок
   */
  getNextStep(currentStep: ItemWizardStep): ItemWizardNavigationResult {
    const currentIndex = this.steps.indexOf(currentStep);

    // Якщо поточний крок не знайдено або це останній крок
    if (currentIndex === -1 || currentIndex === this.steps.length - 1) {
      return {
        success: false,
        error: 'Неможливо перейти до наступного кроку',
        currentStep
      };
    }

    const nextStep = this.steps[currentIndex + 1];

    return {
      success: true,
      currentStep: nextStep,
      direction: ItemStepDirection.NEXT
    };
  }

  /**
   * Отримання попереднього кроку
   * @param currentStep Поточний крок
   */
  getPreviousStep(currentStep: ItemWizardStep): ItemWizardNavigationResult {
    const currentIndex = this.steps.indexOf(currentStep);

    // Якщо поточний крок не знайдено або це перший крок
    if (currentIndex === -1 || currentIndex === 0) {
      return {
        success: false,
        error: 'Неможливо перейти до попереднього кроку'
      };
    }

    const previousStep = this.steps[currentIndex - 1];

    return {
      success: true,
      currentStep: previousStep,
      direction: ItemStepDirection.PREVIOUS
    };
  }

  /**
   * Отримання конкретного кроку за індексом
   * @param index Індекс кроку
   */
  getStepByIndex(index: number): ItemWizardNavigationResult {
    // Перевірка на валідність індексу
    if (index < 0 || index >= this.steps.length) {
      return {
        success: false,
        error: 'Недійсний індекс кроку',
        currentStep: this.getFirstStep()
      };
    }

    return {
      success: true,
      currentStep: this.steps[index],
      direction: ItemStepDirection.SPECIFIC
    };
  }

  /**
   * Отримання індексу поточного кроку
   * @param step Поточний крок
   */
  getStepIndex(step: ItemWizardStep): number {
    const index = this.steps.indexOf(step);
    return index !== -1 ? index : 0;
  }

  /**
   * Отримання конкретного кроку
   * @param step Крок для отримання
   */
  getSpecificStep(step: ItemWizardStep): ItemWizardNavigationResult {
    // Перевірка, чи існує вказаний крок
    if (!this.steps.includes(step)) {
      return {
        success: false,
        error: `Крок ${step} не знайдено в списку кроків`
      };
    }

    return {
      success: true,
      currentStep: step,
      direction: ItemStepDirection.SPECIFIC
    };
  }

  /**
   * Обробка переходу між кроками
   * @param currentStep Поточний крок
   * @param targetStep Цільовий крок
   * @param transitionType Тип переходу ('forward', 'backward', 'direct')
   */
  handleStepTransition(currentStep: ItemWizardStep, targetStep: ItemWizardStep, transitionType: ItemStepDirection): ItemWizardNavigationResult {
    let direction: ItemStepDirection;
    
    // Транзишн-тип уже є напрямком, оскільки тепер ми використовуємо enum ItemStepDirection
    direction = transitionType;

    // Виклик відповідного методу в залежності від напрямку
    switch (direction) {
      case ItemStepDirection.NEXT:
        return this.getNextStep(currentStep);
      case ItemStepDirection.PREVIOUS:
        return this.getPreviousStep(currentStep);
      case ItemStepDirection.SPECIFIC:
        return this.getSpecificStep(targetStep);
      default:
        return {
          success: false,
          error: `Невідомий напрямок: ${direction}`
        };
    }
  }

  /**
   * Отримання загальної кількості кроків
   */
  getTotalSteps(): number {
    return this.steps.length;
  }

  /**
   * Отримання всіх доступних кроків
   */
  getAllSteps(): ItemWizardStep[] {
    return [...this.steps];
  }
}
