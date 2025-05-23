import { WizardStep, StepValidationResult } from '../types';

/**
 * Transition Validation Service
 * Сервіс для валідації переходів між кроками wizard
 *
 * SOLID принципи:
 * - Single Responsibility: тільки валідація переходів
 * - Open/Closed: легко додавати нові правила переходів
 */
export class TransitionValidationService {
  /**
   * Основний порядок кроків хімчистки (5 етапів)
   */
  private readonly mainStepsOrder: WizardStep[] = [
    WizardStep.CLIENT_SELECTION, // 1. Вибір клієнта
    WizardStep.BRANCH_SELECTION, // 2. Вибір філії
    WizardStep.ITEM_MANAGER, // 3. Управління предметами (таблиця)
    WizardStep.ORDER_PARAMETERS, // 4. Параметри замовлення
    WizardStep.ORDER_CONFIRMATION, // 5. Підтвердження замовлення
  ];

  /**
   * Порядок кроків Item Wizard (5 підетапів конфігурації речі)
   */
  private readonly itemStepsOrder: WizardStep[] = [
    WizardStep.ITEM_BASIC_INFO, // 1. Базова інформація про річ
    WizardStep.ITEM_PROPERTIES, // 2. Властивості речі (тип тканини, колір)
    WizardStep.DEFECTS_STAINS, // 3. Дефекти та плями
    WizardStep.PRICE_CALCULATOR, // 4. Розрахунок вартості
    WizardStep.PHOTO_DOCUMENTATION, // 5. Фотодокументація
  ];

  /**
   * Валідація переходу між кроками
   */
  validateTransition(from: WizardStep, to: WizardStep): StepValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Перевіряємо чи кроки валідні
    if (!this.isValidStep(from)) {
      errors.push(`Невірний початковий крок: ${from}`);
    }

    if (!this.isValidStep(to)) {
      errors.push(`Невірний цільовий крок: ${to}`);
    }

    // Перевіряємо логіку переходу
    if (!this.isValidTransition(from, to)) {
      errors.push(`Неможливий перехід з ${from} до ${to}`);
    }

    // Перевіряємо спеціальні правила
    const specialValidation = this.validateSpecialTransitions(from, to);
    errors.push(...specialValidation.errors);
    warnings.push(...specialValidation.warnings);

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      canProceed: errors.length === 0,
    };
  }

  /**
   * Перевірка чи можна перейти до кроку
   */
  canTransitionTo(from: WizardStep, to: WizardStep): boolean {
    return this.validateTransition(from, to).canProceed;
  }

  /**
   * Перевірка чи крок валідний
   */
  private isValidStep(step: WizardStep): boolean {
    return Object.values(WizardStep).includes(step);
  }

  /**
   * Перевірка чи перехід між кроками логічний
   */
  private isValidTransition(from: WizardStep, to: WizardStep): boolean {
    const fromIsMain = this.mainStepsOrder.includes(from);
    const toIsMain = this.mainStepsOrder.includes(to);
    const fromIsItem = this.itemStepsOrder.includes(from);
    const toIsItem = this.itemStepsOrder.includes(to);

    // Можна переходити в межах одного типу wizard
    if ((fromIsMain && toIsMain) || (fromIsItem && toIsItem)) {
      return true;
    }

    // Спеціальні переходи між типами wizard
    return (
      (from === WizardStep.ITEM_MANAGER && to === WizardStep.ITEM_BASIC_INFO) || // Початок Item Wizard
      (fromIsItem && to === WizardStep.ITEM_MANAGER) // Повернення з Item Wizard
    );
  }

  /**
   * Спеціальні правила валідації
   */
  private validateSpecialTransitions(
    from: WizardStep,
    to: WizardStep
  ): { errors: string[]; warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Перехід до ORDER_CONFIRMATION можливий тільки коли все готове
    if (to === WizardStep.ORDER_CONFIRMATION) {
      warnings.push('Переконайтеся що всі попередні кроки завершені');
    }

    // Початок Item Wizard
    if (from === WizardStep.ITEM_MANAGER && to === WizardStep.ITEM_BASIC_INFO) {
      warnings.push('Розпочинається процес додавання предмету');
    }

    return { errors, warnings };
  }
}
