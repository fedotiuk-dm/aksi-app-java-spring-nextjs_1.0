import { WizardStep, StepValidationResult, WizardMode } from '../types';

/**
 * Step Validation Service
 * Спеціалізований сервіс для валідації окремих кроків wizard
 *
 * SOLID принципи:
 * - Single Responsibility: тільки валідація окремих кроків
 * - Open/Closed: легко додавати нові типи валідації
 * - Interface Segregation: мінімальний інтерфейс
 */
export class StepValidationService {
  /**
   * Валідація конкретного кроку з даними
   */
  validateStep(step: WizardStep, data?: unknown): StepValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      // Базова валідація кроку
      if (!this.isValidStep(step)) {
        errors.push(`Невірний крок wizard: ${step}`);
        return { isValid: false, errors, warnings, canProceed: false };
      }

      // Специфічна валідація для кроку
      const stepErrors = this.validateStepData(step, data);
      errors.push(...stepErrors);
    } catch (error) {
      errors.push(
        `Помилка валідації кроку: ${error instanceof Error ? error.message : 'Невідома помилка'}`
      );
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      canProceed: errors.length === 0,
    };
  }

  /**
   * Перевірка завершеності кроку
   */
  isStepComplete(step: WizardStep, data?: unknown): boolean {
    // Спочатку валідуємо крок
    const validation = this.validateStep(step, data);
    if (!validation.isValid) {
      return false;
    }

    // Перевіряємо специфічну завершеність
    return this.checkCompleteness(step, data);
  }

  /**
   * Валідація доступу до кроку в режимі
   */
  validateStepAccess(step: WizardStep, mode: WizardMode): StepValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (mode === WizardMode.VIEW) {
      // У режимі перегляду деякі кроки read-only
      const readOnlySteps = [WizardStep.ORDER_CONFIRMATION];
      if (readOnlySteps.includes(step)) {
        warnings.push(`Крок ${step} доступний тільки для перегляду`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      canProceed: errors.length === 0,
    };
  }

  // Приватні методи

  private isValidStep(step: WizardStep): boolean {
    return Object.values(WizardStep).includes(step);
  }

  private validateStepData(step: WizardStep, data?: unknown): string[] {
    const errors: string[] = [];

    if (!data) {
      return errors; // Немає даних для валідації
    }

    if (typeof data !== 'object' || data === null) {
      errors.push("Дані кроку мають бути об'єктом");
      return errors;
    }

    // Валідація залежно від кроку
    switch (step) {
      case WizardStep.CLIENT_SELECTION:
        errors.push(...this.validateClientSelection(data));
        break;
      case WizardStep.BRANCH_SELECTION:
        errors.push(...this.validateBranchSelection(data));
        break;
      case WizardStep.ORDER_PARAMETERS:
        errors.push(...this.validateOrderParameters(data));
        break;
      case WizardStep.ITEM_MANAGER:
        errors.push(...this.validateItemManager(data));
        break;
      default:
        // Для інших кроків базова валідація
        break;
    }

    return errors;
  }

  private validateClientSelection(data: object): string[] {
    const errors: string[] = [];

    if ('customerId' in data && !data.customerId) {
      errors.push('Необхідно вибрати клієнта');
    }

    return errors;
  }

  private validateBranchSelection(data: object): string[] {
    const errors: string[] = [];

    if ('branchId' in data && !data.branchId) {
      errors.push('Необхідно вибрати філію');
    }

    return errors;
  }

  private validateOrderParameters(data: object): string[] {
    const errors: string[] = [];

    // Валідація основних параметрів замовлення (включаючи basic info)
    if ('orderDate' in data && !data.orderDate) {
      errors.push('Необхідно вказати дату замовлення');
    }

    if ('dueDate' in data && !data.dueDate) {
      errors.push('Необхідно вказати дату готовності');
    }

    return errors;
  }

  private validateItemManager(data: object): string[] {
    const errors: string[] = [];

    if ('items' in data) {
      if (!Array.isArray(data.items)) {
        errors.push('Список предметів має бути масивом');
      } else if (data.items.length === 0) {
        errors.push('Необхідно додати хоча б один предмет');
      }
    }

    return errors;
  }

  private checkCompleteness(step: WizardStep, data?: unknown): boolean {
    if (!data || typeof data !== 'object' || data === null) {
      return false;
    }

    switch (step) {
      case WizardStep.CLIENT_SELECTION:
        return 'customerId' in data && Boolean(data.customerId);

      case WizardStep.BRANCH_SELECTION:
        return 'branchId' in data && Boolean(data.branchId);

      case WizardStep.ORDER_PARAMETERS:
        return (
          'orderDate' in data &&
          Boolean(data.orderDate) &&
          'dueDate' in data &&
          Boolean(data.dueDate)
        );

      case WizardStep.ITEM_MANAGER:
        return 'items' in data && Array.isArray(data.items) && data.items.length > 0;

      default:
        return Boolean(data);
    }
  }
}
