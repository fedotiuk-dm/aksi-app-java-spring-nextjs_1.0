import { WizardStep } from '../types';

/**
 * Wizard Completion Service
 * Сервіс для перевірки завершеності wizard та його кроків
 *
 * SOLID принципи:
 * - Single Responsibility: тільки логіка завершеності
 * - Open/Closed: легко розширюється новими типами перевірок
 */
export class WizardCompletionService {
  /**
   * 5 основних етапів замовлення хімчистки
   */
  private readonly requiredMainSteps: WizardStep[] = [
    WizardStep.CLIENT_SELECTION, // 1. Вибір клієнта
    WizardStep.BRANCH_SELECTION, // 2. Вибір філії
    WizardStep.ITEM_MANAGER, // 3. Управління предметами (таблиця)
    WizardStep.ORDER_PARAMETERS, // 4. Параметри замовлення
    WizardStep.ORDER_CONFIRMATION, // 5. Підтвердження замовлення
  ];

  /**
   * 5 підетапів конфігурації кожної речі (Item Wizard)
   * Виконується для кожного предмету окремо
   */
  private readonly requiredItemSteps: WizardStep[] = [
    WizardStep.ITEM_BASIC_INFO, // 1. Базова інформація про річ
    WizardStep.ITEM_PROPERTIES, // 2. Властивості речі
    WizardStep.DEFECTS_STAINS, // 3. Дефекти та плями
    WizardStep.PRICE_CALCULATOR, // 4. Розрахунок вартості
    WizardStep.PHOTO_DOCUMENTATION, // 5. Фотодокументація
  ];

  /**
   * Перевірка чи основний wizard завершений
   */
  isMainWizardComplete(completedSteps: WizardStep[]): boolean {
    return this.requiredMainSteps.every((step) => completedSteps.includes(step));
  }

  /**
   * Перевірка чи Item Wizard завершений (для конкретної речі)
   */
  isItemWizardComplete(completedSteps: WizardStep[]): boolean {
    return this.requiredItemSteps.every((step) => completedSteps.includes(step));
  }

  /**
   * Перевірка чи конкретний крок завершений
   */
  isStepComplete(step: WizardStep, completedSteps: WizardStep[]): boolean {
    return completedSteps.includes(step);
  }

  /**
   * Отримання наступного незавершеного кроку
   */
  getNextIncompleteStep(completedSteps: WizardStep[], isItemWizard = false): WizardStep | null {
    const requiredSteps = isItemWizard ? this.requiredItemSteps : this.requiredMainSteps;

    for (const step of requiredSteps) {
      if (!completedSteps.includes(step)) {
        return step;
      }
    }

    return null; // Всі кроки завершені
  }

  /**
   * Обчислення прогресу завершення у відсотках
   */
  calculateCompletionProgress(completedSteps: WizardStep[], isItemWizard = false): number {
    const requiredSteps = isItemWizard ? this.requiredItemSteps : this.requiredMainSteps;
    const completedCount = requiredSteps.filter((step) => completedSteps.includes(step)).length;

    return Math.round((completedCount / requiredSteps.length) * 100);
  }

  /**
   * Отримання списку незавершених кроків
   */
  getIncompleteSteps(completedSteps: WizardStep[], isItemWizard = false): WizardStep[] {
    const requiredSteps = isItemWizard ? this.requiredItemSteps : this.requiredMainSteps;

    return requiredSteps.filter((step) => !completedSteps.includes(step));
  }

  /**
   * Перевірка чи можна завершити wizard
   */
  canCompleteWizard(completedSteps: WizardStep[]): boolean {
    const mainWizardComplete = this.isMainWizardComplete(completedSteps);

    // Перевіряємо чи є хоча б один завершений Item Wizard
    const hasItemWizard = this.requiredItemSteps.some((step) => completedSteps.includes(step));

    if (hasItemWizard) {
      // Якщо є Item Wizard, перевіряємо його завершеність
      const itemWizardComplete = this.isItemWizardComplete(completedSteps);
      return mainWizardComplete && itemWizardComplete;
    }

    // Якщо немає Item Wizard, достатньо основного wizard
    return mainWizardComplete;
  }

  /**
   * Валідація завершеності з детальним звітом
   */
  validateCompletion(completedSteps: WizardStep[]): {
    canComplete: boolean;
    mainWizardComplete: boolean;
    itemWizardComplete: boolean;
    missingSteps: WizardStep[];
    progress: number;
  } {
    const mainWizardComplete = this.isMainWizardComplete(completedSteps);
    const itemWizardComplete = this.isItemWizardComplete(completedSteps);
    const canComplete = this.canCompleteWizard(completedSteps);

    const missingMainSteps = this.getIncompleteSteps(completedSteps, false);
    const missingItemSteps = this.getIncompleteSteps(completedSteps, true);

    return {
      canComplete,
      mainWizardComplete,
      itemWizardComplete,
      missingSteps: [...missingMainSteps, ...missingItemSteps],
      progress: this.calculateCompletionProgress(completedSteps, false),
    };
  }

  /**
   * Перевірка чи Item Wizard розпочат
   */
  isItemWizardStarted(completedSteps: WizardStep[]): boolean {
    return completedSteps.includes(WizardStep.ITEM_BASIC_INFO);
  }

  /**
   * Валідація готовності до Item Wizard
   * Можна додавати речі тільки після завершення BRANCH_SELECTION
   */
  canStartItemWizard(completedSteps: WizardStep[]): boolean {
    // Потрібно завершити принаймні BRANCH_SELECTION для додавання речей
    return completedSteps.includes(WizardStep.BRANCH_SELECTION);
  }
}
