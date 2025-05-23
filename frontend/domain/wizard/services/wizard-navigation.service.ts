import {
  WizardStep,
  StepValidationResult,
  IWizardNavigationService,
  StepAvailability,
} from '../types';

/**
 * Wizard Navigation Service
 * Доменний сервіс для управління навігацією між кроками wizard
 *
 * DDD принципи:
 * - Domain Service: інкапсулює складну бізнес-логіку навігації
 * - Single Responsibility: відповідає тільки за навігаційну логіку
 * - Stateless: не зберігає стан, працює з переданими параметрами
 * - Pure Functions: предсказувані результати для тих самих входів
 */
export class WizardNavigationService implements IWizardNavigationService {
  /**
   * Конфігурація порядку кроків для основного wizard хімчистки (5 етапів)
   */
  private readonly mainWizardOrder: WizardStep[] = [
    WizardStep.CLIENT_SELECTION, // 1. Вибір клієнта
    WizardStep.BRANCH_SELECTION, // 2. Вибір філії
    WizardStep.ITEM_MANAGER, // 3. Управління предметами (таблиця)
    WizardStep.ORDER_PARAMETERS, // 4. Параметри замовлення
    WizardStep.ORDER_CONFIRMATION, // 5. Підтвердження замовлення
  ];

  /**
   * Конфігурація порядку кроків для Item Wizard (5 підетапів конфігурації речі)
   */
  private readonly itemWizardOrder: WizardStep[] = [
    WizardStep.ITEM_BASIC_INFO, // 1. Базова інформація про річ
    WizardStep.ITEM_PROPERTIES, // 2. Властивості речі (тип тканини, колір)
    WizardStep.DEFECTS_STAINS, // 3. Дефекти та плями
    WizardStep.PRICE_CALCULATOR, // 4. Розрахунок вартості
    WizardStep.PHOTO_DOCUMENTATION, // 5. Фотодокументація
  ];

  /**
   * Мапа залежностей кроків (які кроки повинні бути завершені перед цим)
   */
  private readonly stepDependencies: Record<WizardStep, WizardStep[]> = {
    [WizardStep.CLIENT_SELECTION]: [],
    [WizardStep.BRANCH_SELECTION]: [WizardStep.CLIENT_SELECTION],
    [WizardStep.ITEM_MANAGER]: [WizardStep.BRANCH_SELECTION],
    [WizardStep.ORDER_PARAMETERS]: [WizardStep.ITEM_MANAGER],
    [WizardStep.ORDER_CONFIRMATION]: [WizardStep.ORDER_PARAMETERS],

    // Item Wizard кроки
    [WizardStep.ITEM_BASIC_INFO]: [],
    [WizardStep.ITEM_PROPERTIES]: [WizardStep.ITEM_BASIC_INFO],
    [WizardStep.DEFECTS_STAINS]: [WizardStep.ITEM_PROPERTIES],
    [WizardStep.PRICE_CALCULATOR]: [WizardStep.DEFECTS_STAINS],
    [WizardStep.PHOTO_DOCUMENTATION]: [WizardStep.PRICE_CALCULATOR],
  };

  /**
   * Перевіряє чи можна перейти до конкретного кроку
   */
  canNavigateToStep(
    step: WizardStep,
    availability: StepAvailability = {} as StepAvailability
  ): boolean {
    // Перевіряємо базову доступність
    if (availability[step] === false) {
      return false;
    }

    // Перевіряємо залежності
    const dependencies = this.stepDependencies[step] || [];
    return dependencies.every((dep) => availability[dep] === true);
  }

  /**
   * Валідація переходу між кроками
   */
  validateNavigation(from: WizardStep, to: WizardStep): StepValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Перевіряємо чи це дійсні кроки
    if (!this.isValidStep(from)) {
      errors.push(`Невірний початковий крок: ${from}`);
    }

    if (!this.isValidStep(to)) {
      errors.push(`Невірний цільовий крок: ${to}`);
    }

    // Перевіряємо логіку переходів
    if (!this.isValidTransition(from, to)) {
      errors.push(`Неможливий перехід з ${from} до ${to}`);
    }

    // Перевіряємо чи не пропускаємо обов'язкові кроки
    const skippedSteps = this.getSkippedRequiredSteps(from, to);
    if (skippedSteps.length > 0) {
      warnings.push(`Пропущено обов'язкові кроки: ${skippedSteps.join(', ')}`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      canProceed: errors.length === 0,
    };
  }

  /**
   * Отримання наступного кроку
   */
  getNextStep(currentStep: WizardStep, isItemWizardActive = false): WizardStep | null {
    const order = isItemWizardActive ? this.itemWizardOrder : this.mainWizardOrder;
    const currentIndex = order.indexOf(currentStep);

    if (currentIndex === -1 || currentIndex === order.length - 1) {
      return null;
    }

    return order[currentIndex + 1];
  }

  /**
   * Отримання попереднього кроку
   */
  getPreviousStep(currentStep: WizardStep, isItemWizardActive = false): WizardStep | null {
    const order = isItemWizardActive ? this.itemWizardOrder : this.mainWizardOrder;
    const currentIndex = order.indexOf(currentStep);

    if (currentIndex <= 0) {
      return null;
    }

    return order[currentIndex - 1];
  }

  /**
   * Отримання кроків в порядку виконання
   */
  getStepsByOrder(isItemWizardActive = false): WizardStep[] {
    return isItemWizardActive ? [...this.itemWizardOrder] : [...this.mainWizardOrder];
  }

  /**
   * Обчислення початкової доступності кроків
   */
  calculateInitialAvailability(): StepAvailability {
    const availability: StepAvailability = {} as StepAvailability;

    // Всі кроки спочатку недоступні
    Object.values(WizardStep).forEach((step) => {
      availability[step] = false;
    });

    // Тільки перший крок доступний
    availability[WizardStep.CLIENT_SELECTION] = true;

    return availability;
  }

  /**
   * Оновлення доступності кроків на основі поточного прогресу
   */
  updateAvailabilityBasedOnProgress(
    currentStep: WizardStep,
    completedSteps: WizardStep[],
    isItemWizardActive = false
  ): StepAvailability {
    const availability = this.calculateInitialAvailability();
    const order = isItemWizardActive ? this.itemWizardOrder : this.mainWizardOrder;

    // Позначаємо завершені кроки як доступні
    completedSteps.forEach((step) => {
      availability[step] = true;
    });

    // Поточний крок завжди доступний
    availability[currentStep] = true;

    // Наступний крок після поточного може стати доступним
    const currentIndex = order.indexOf(currentStep);
    if (currentIndex !== -1 && currentIndex < order.length - 1) {
      const nextStep = order[currentIndex + 1];

      // Перевіряємо залежності для наступного кроку
      const dependencies = this.stepDependencies[nextStep] || [];
      const allDependenciesMet = dependencies.every((dep) => completedSteps.includes(dep));

      if (allDependenciesMet) {
        availability[nextStep] = true;
      }
    }

    return availability;
  }

  /**
   * Перевірка чи крок належить до Item Wizard
   */
  isItemWizardStep(step: WizardStep): boolean {
    return this.itemWizardOrder.includes(step);
  }

  /**
   * Перевірка чи крок належить до основного wizard
   */
  isMainWizardStep(step: WizardStep): boolean {
    return this.mainWizardOrder.includes(step);
  }

  /**
   * Отримання індексу кроку в послідовності
   */
  getStepIndex(step: WizardStep, isItemWizardActive = false): number {
    const order = isItemWizardActive ? this.itemWizardOrder : this.mainWizardOrder;
    return order.indexOf(step);
  }

  /**
   * Обчислення прогресу wizard (у відсотках)
   */
  calculateProgress(currentStep: WizardStep, isItemWizardActive = false): number {
    const order = isItemWizardActive ? this.itemWizardOrder : this.mainWizardOrder;
    const currentIndex = order.indexOf(currentStep);

    if (currentIndex === -1) return 0;

    return Math.round(((currentIndex + 1) / order.length) * 100);
  }

  /**
   * Перевірка чи крок є валідним
   */
  private isValidStep(step: WizardStep): boolean {
    return Object.values(WizardStep).includes(step);
  }

  /**
   * Перевірка чи перехід між кроками є валідним
   */
  private isValidTransition(from: WizardStep, to: WizardStep): boolean {
    // Основна логіка валідації переходів
    // Можна розширити додатковими правилами
    return this.isValidStep(from) && this.isValidStep(to);
  }

  /**
   * Отримання пропущених обов'язкових кроків при переході
   */
  private getSkippedRequiredSteps(_from: WizardStep, _to: WizardStep): WizardStep[] {
    // Логіка визначення пропущених кроків
    // На майбутнє для розширеної валідації
    return [];
  }
}
