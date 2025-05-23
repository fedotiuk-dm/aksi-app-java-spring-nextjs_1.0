import {
  WizardStep,
  StepValidationResult,
  IWizardValidationService,
  WizardContext,
  WizardMode,
} from '../types';
import { StepValidationService } from './step-validation.service';
import { TransitionValidationService } from './transition-validation.service';
import { WizardCompletionService } from './wizard-completion.service';

/**
 * Wizard Validation Service (Facade)
 * Композиційний сервіс що об'єднує всі типи валідації
 *
 * SOLID принципи:
 * - Single Responsibility: координація валідаційних сервісів
 * - Open/Closed: закритий для модифікації, відкритий для розширення
 * - Dependency Inversion: залежить від абстракцій, не конкретних класів
 * - Composition over Inheritance: використовує композицію сервісів
 */
export class WizardValidationService implements IWizardValidationService {
  constructor(
    private readonly stepValidator = new StepValidationService(),
    private readonly transitionValidator = new TransitionValidationService(),
    private readonly completionValidator = new WizardCompletionService()
  ) {}

  /**
   * Валідація конкретного кроку
   */
  validateStep(step: WizardStep, data?: unknown): StepValidationResult {
    return this.stepValidator.validateStep(step, data);
  }

  /**
   * Валідація переходу між кроками
   */
  validateTransition(from: WizardStep, to: WizardStep): StepValidationResult {
    return this.transitionValidator.validateTransition(from, to);
  }

  /**
   * Отримання списку обов'язкових кроків
   */
  getRequiredSteps(isItemWizard = false): WizardStep[] {
    if (isItemWizard) {
      return [
        WizardStep.ITEM_BASIC_INFO,
        WizardStep.ITEM_PROPERTIES,
        WizardStep.DEFECTS_STAINS,
        WizardStep.PRICE_CALCULATOR,
        WizardStep.PHOTO_DOCUMENTATION,
      ];
    }

    return [
      WizardStep.CLIENT_SELECTION,
      WizardStep.BRANCH_SELECTION,
      WizardStep.ITEM_MANAGER,
      WizardStep.ORDER_PARAMETERS,
      WizardStep.ORDER_CONFIRMATION,
    ];
  }

  /**
   * Перевірка чи крок завершений
   */
  isStepComplete(step: WizardStep, data?: unknown): boolean {
    return this.stepValidator.isStepComplete(step, data);
  }

  /**
   * Валідація контексту wizard
   */
  validateWizardContext(context: WizardContext): StepValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Перевіряємо режим
    if (!Object.values(WizardMode).includes(context.mode)) {
      errors.push(`Невірний режим wizard: ${context.mode}`);
    }

    // Перевіряємо наявність необхідних даних для режиму EDIT
    if (context.mode === WizardMode.EDIT && !context.orderId) {
      errors.push('Для режиму редагування необхідний orderId');
    }

    // Перевіряємо наявність клієнта
    if (context.mode !== WizardMode.VIEW && !context.customerId) {
      warnings.push('Не вказано customerId - потрібно буде вибрати клієнта');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      canProceed: errors.length === 0,
    };
  }

  /**
   * Валідація можливості завершення wizard
   */
  validateWizardCompletion(
    completedSteps: WizardStep[],
    _isItemWizard = false
  ): StepValidationResult {
    const completion = this.completionValidator.validateCompletion(completedSteps);

    return {
      isValid: completion.canComplete,
      errors: completion.canComplete ? [] : ["Не всі обов'язкові кроки завершені"],
      warnings: [],
      canProceed: completion.canComplete,
    };
  }

  /**
   * Додаткові методи через делегування
   */

  /**
   * Валідація доступу до кроку
   */
  validateStepAccess(step: WizardStep, mode: WizardMode): StepValidationResult {
    return this.stepValidator.validateStepAccess(step, mode);
  }

  /**
   * Перевірка готовності до завершення
   */
  isReadyForCompletion(completedSteps: WizardStep[], _isItemWizard?: boolean): boolean {
    return this.completionValidator.canCompleteWizard(completedSteps);
  }

  /**
   * Отримання відсотка завершення
   */
  getCompletionPercentage(completedSteps: WizardStep[], isItemWizard = false): number {
    return this.completionValidator.calculateCompletionProgress(completedSteps, isItemWizard);
  }

  /**
   * Перевірка чи крок належить Item Wizard
   */
  isItemWizardStep(step: WizardStep): boolean {
    const itemSteps = [
      WizardStep.ITEM_BASIC_INFO,
      WizardStep.ITEM_PROPERTIES,
      WizardStep.DEFECTS_STAINS,
      WizardStep.PRICE_CALCULATOR,
      WizardStep.PHOTO_DOCUMENTATION,
    ];
    return itemSteps.includes(step);
  }

  /**
   * Отримання пропущених кроків - заглушка для майбутньої реалізації
   */
  getSkippedSteps(_from: WizardStep, _to: WizardStep): WizardStep[] {
    // TODO: реалізувати логіку пошуку пропущених кроків
    return [];
  }
}
