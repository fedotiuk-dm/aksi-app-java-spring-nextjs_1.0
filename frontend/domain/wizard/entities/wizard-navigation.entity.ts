import { WizardStep, StepHistoryEntry, NavigationDirection } from '../types';
import { WizardStateEntity } from './wizard-state.entity';

/**
 * Wizard Navigation Entity
 * Спеціалізована entity для управління навігацією wizard
 *
 * SOLID принципи:
 * - Single Responsibility: тільки навігаційна логіка
 * - Open/Closed: легко розширюється новими методами навігації
 * - Dependency Inversion: залежить від WizardStateEntity абстракції
 */
export class WizardNavigationEntity {
  constructor(
    private state: WizardStateEntity,
    private _stepHistory: StepHistoryEntry[] = []
  ) {
    this.validateInvariants();
  }

  // Геттери
  get stepHistory(): readonly StepHistoryEntry[] {
    return [...this._stepHistory];
  }

  get canGoBack(): boolean {
    return this._stepHistory.length > 1 && !this.state.isItemWizardActive;
  }

  get canGoForward(): boolean {
    const nextStep = this.getNextStep();

    if (nextStep === null) {
      return false;
    }

    // Для Item Wizard дозволяємо перехід навіть якщо крок ще не активований
    // (активація відбудеться в goForward)
    if (this.state.isItemWizardActive) {
      return true;
    }

    // Для основного wizard перевіряємо доступність
    const result = this.state.availability[nextStep];
    console.log('WizardNavigationEntity: canGoForward (main wizard)', {
      currentStep: this.state.currentStep,
      nextStep,
      nextStepAvailable: result,
    });
    return result;
  }

  get previousStep(): WizardStep | null {
    if (this._stepHistory.length <= 1) return null;
    return this._stepHistory[this._stepHistory.length - 2].step;
  }

  // Навігаційні методи
  navigateToStep(step: WizardStep): void {
    this.validateStepTransition(this.state.currentStep, step);

    const previousStep = this.state.currentStep;
    this.state.updateCurrentStep(step);

    console.log('WizardNavigationEntity: navigateToStep', {
      previousStep,
      currentStep: step,
      isItemWizardActive: this.state.isItemWizardActive,
    });

    const historyEntry: StepHistoryEntry = {
      step,
      timestamp: Date.now(),
      direction: this.determineDirection(previousStep, step),
      metadata: { previousStep },
    };

    this._stepHistory.push(historyEntry);
  }

  goBack(): void {
    if (!this.canGoBack) {
      throw new Error('Неможливо повернутися назад');
    }

    const previousEntry = this._stepHistory[this._stepHistory.length - 2];
    this.state.updateCurrentStep(previousEntry.step);
    this._stepHistory = this._stepHistory.slice(0, -1);
  }

  goForward(): void {
    const nextStep = this.getNextStep();
    console.log('WizardNavigationEntity: goForward', {
      currentStep: this.state.currentStep,
      nextStep,
      isItemWizardActive: this.state.isItemWizardActive,
      availability: this.state.availability,
    });

    if (nextStep === null) {
      console.error('WizardNavigationEntity: Немає наступного кроку');
      throw new Error('Неможливо перейти до наступного кроку');
    }

    // Для Item Wizard автоматично активуємо наступний крок перед переходом
    if (this.state.isItemWizardActive && !this.state.availability[nextStep]) {
      console.log('WizardNavigationEntity: Активуємо наступний крок перед переходом:', nextStep);
      this.state.updateStepAvailability(nextStep, true);
    }

    // Тепер перевіряємо доступність після можливої активації
    if (!this.state.availability[nextStep]) {
      console.error('WizardNavigationEntity: Крок недоступний для переходу', {
        nextStep,
        available: this.state.availability[nextStep],
      });
      throw new Error('Неможливо перейти до наступного кроку');
    }

    this.navigateToStep(nextStep);
  }

  reset(): void {
    this.state.updateCurrentStep(WizardStep.CLIENT_SELECTION);
    this._stepHistory = [
      {
        step: WizardStep.CLIENT_SELECTION,
        timestamp: Date.now(),
        direction: NavigationDirection.JUMP,
      },
    ];
  }

  // Приватні методи
  private validateStepTransition(from: WizardStep, to: WizardStep): void {
    if (from === to) {
      return; // Дозволяємо залишатися на тому ж кроці
    }

    // Для Item Wizard пропускаємо перевірку доступності
    // (доступність управляється у goForward)
    if (this.state.isItemWizardActive) {
      return;
    }

    // Для основного wizard перевіряємо доступність
    if (!this.state.availability[to]) {
      throw new Error(`Крок ${to} недоступний для переходу`);
    }
  }

  private determineDirection(from: WizardStep, to: WizardStep): NavigationDirection {
    if (from === to) return NavigationDirection.JUMP;

    const stepOrder = Object.values(WizardStep);
    const fromIndex = stepOrder.indexOf(from);
    const toIndex = stepOrder.indexOf(to);

    if (toIndex > fromIndex) return NavigationDirection.FORWARD;
    if (toIndex < fromIndex) return NavigationDirection.BACKWARD;

    return NavigationDirection.JUMP;
  }

  private getNextStep(): WizardStep | null {
    const stepOrder: WizardStep[] = [
      WizardStep.CLIENT_SELECTION,
      WizardStep.BRANCH_SELECTION,
      WizardStep.ITEM_MANAGER,
      WizardStep.ORDER_PARAMETERS,
      WizardStep.ORDER_CONFIRMATION,
    ];

    const itemWizardOrder: WizardStep[] = [
      WizardStep.ITEM_BASIC_INFO,
      WizardStep.ITEM_PROPERTIES,
      WizardStep.DEFECTS_STAINS,
      WizardStep.PRICE_CALCULATOR,
      WizardStep.PHOTO_DOCUMENTATION,
    ];

    const currentOrder = this.state.isItemWizardActive ? itemWizardOrder : stepOrder;
    const currentIndex = currentOrder.indexOf(this.state.currentStep);

    if (currentIndex === -1 || currentIndex === currentOrder.length - 1) {
      return null;
    }

    return currentOrder[currentIndex + 1];
  }

  private validateInvariants(): void {
    if (this._stepHistory.length === 0) {
      throw new Error('Історія кроків не може бути порожньою');
    }
  }
}
