import { WizardStep } from '../types';
import { WizardNavigationEntity } from './wizard-navigation.entity';
import { WizardStateEntity } from './wizard-state.entity';

/**
 * Wizard Item Entity
 * Спеціалізована entity для управління Item Wizard функціональністю
 *
 * SOLID принципи:
 * - Single Responsibility: тільки Item Wizard логіка
 * - Open/Closed: легко розширюється новими Item операціями
 * - Dependency Inversion: залежить від композицій entities
 */
export class WizardItemEntity {
  constructor(
    private state: WizardStateEntity,
    private navigation: WizardNavigationEntity
  ) {}

  // Геттери
  get isItemWizardActive(): boolean {
    return this.state.isItemWizardActive;
  }

  get canStartItemWizard(): boolean {
    return this.state.currentStep === WizardStep.ITEM_MANAGER;
  }

  // Item Wizard методи
  startItemWizard(): void {
    if (!this.canStartItemWizard) {
      throw new Error('Item Wizard можна запустити тільки з ITEM_MANAGER кроку');
    }

    this.state.setItemWizardActive(true);
    this.state.updateCurrentStep(WizardStep.ITEM_BASIC_INFO);

    // Очищаємо історію для Item Wizard
    this.navigation.reset();
    this.navigation.navigateToStep(WizardStep.ITEM_BASIC_INFO);

    // Активуємо перший крок Item Wizard
    this.state.updateStepAvailability(WizardStep.ITEM_BASIC_INFO, true);
    // Активуємо наступний крок для можливості переходу
    this.state.updateStepAvailability(WizardStep.ITEM_PROPERTIES, true);
    // Інші кроки залишаються недоступними до поступового переходу
    this.resetRemainingItemWizardAvailability();

    console.log('WizardItemEntity: Item Wizard запущено');
  }

  finishItemWizard(saveItem: boolean): void {
    if (!this.isItemWizardActive) {
      throw new Error('Item Wizard не активний');
    }

    console.log('WizardItemEntity: завершення Item Wizard', { saveItem });

    this.state.setItemWizardActive(false);
    this.state.updateCurrentStep(WizardStep.ITEM_MANAGER);

    // Відновлюємо історію основного wizard
    this.navigation.reset();
    this.navigation.navigateToStep(WizardStep.ITEM_MANAGER);

    console.log('WizardItemEntity: Item Wizard завершено, повернення до ITEM_MANAGER');
  }

  // Приватні методи
  private resetItemWizardAvailability(): void {
    const itemSteps = [
      WizardStep.ITEM_PROPERTIES,
      WizardStep.DEFECTS_STAINS,
      WizardStep.PRICE_CALCULATOR,
      WizardStep.PHOTO_DOCUMENTATION,
    ];

    itemSteps.forEach((step) => {
      this.state.updateStepAvailability(step, false);
    });
  }

  private resetRemainingItemWizardAvailability(): void {
    const itemSteps = [
      WizardStep.DEFECTS_STAINS,
      WizardStep.PRICE_CALCULATOR,
      WizardStep.PHOTO_DOCUMENTATION,
    ];

    itemSteps.forEach((step) => {
      this.state.updateStepAvailability(step, false);
    });
  }
}
