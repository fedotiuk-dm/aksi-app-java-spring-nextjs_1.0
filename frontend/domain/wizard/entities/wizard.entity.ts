import {
  WizardStep,
  WizardMode,
  WizardStatus,
  WizardContext,
  StepHistoryEntry,
  StepAvailability,
  WizardDomainEvent,
  NavigationDirection,
} from '../types';
import { WizardItemEntity } from './wizard-item.entity';
import { WizardNavigationEntity } from './wizard-navigation.entity';
import { WizardStateEntity } from './wizard-state.entity';

/**
 * Wizard Entity - Aggregate Root (Композиційна)
 * Головна доменна entity що об'єднує спеціалізовані entities
 *
 * SOLID принципи:
 * - Single Responsibility: композиція та координація спеціалізованих entities
 * - Open/Closed: легко розширюється новими entities
 * - Composition over Inheritance: використовує композицію замість наслідування
 * - Dependency Inversion: залежить від абстракцій entities
 */
export class WizardEntity {
  private readonly stateEntity: WizardStateEntity;
  private readonly navigationEntity: WizardNavigationEntity;
  private readonly itemEntity: WizardItemEntity;

  constructor(
    id: string,
    currentStep: WizardStep,
    mode: WizardMode,
    status: WizardStatus,
    context: WizardContext,
    stepHistory: StepHistoryEntry[] = [],
    availability: StepAvailability,
    isItemWizardActive: boolean = false
  ) {
    // Створюємо спеціалізовані entities
    this.stateEntity = new WizardStateEntity(
      id,
      currentStep,
      mode,
      status,
      context,
      availability,
      isItemWizardActive
    );

    this.navigationEntity = new WizardNavigationEntity(this.stateEntity, stepHistory);

    this.itemEntity = new WizardItemEntity(this.stateEntity, this.navigationEntity);
  }

  // Делегування до WizardStateEntity
  get id(): string {
    return this.stateEntity.id;
  }

  get currentStep(): WizardStep {
    return this.stateEntity.currentStep;
  }

  get mode(): WizardMode {
    return this.stateEntity.mode;
  }

  get status(): WizardStatus {
    return this.stateEntity.status;
  }

  get context(): WizardContext {
    return this.stateEntity.context;
  }

  get availability(): StepAvailability {
    return this.stateEntity.availability;
  }

  get isItemWizardActive(): boolean {
    return this.stateEntity.isItemWizardActive;
  }

  // Делегування до WizardNavigationEntity
  get stepHistory(): readonly StepHistoryEntry[] {
    return this.navigationEntity.stepHistory;
  }

  get canGoBack(): boolean {
    return this.navigationEntity.canGoBack;
  }

  get canGoForward(): boolean {
    return this.navigationEntity.canGoForward;
  }

  get previousStep(): WizardStep | null {
    return this.navigationEntity.previousStep;
  }

  // Бізнес-методи (делегування)

  // Navigation methods
  navigateToStep(step: WizardStep): void {
    this.navigationEntity.navigateToStep(step);
  }

  goBack(): void {
    this.navigationEntity.goBack();
  }

  goForward(): void {
    this.navigationEntity.goForward();
  }

  // State methods
  updateStepAvailability(step: WizardStep, isAvailable: boolean): void {
    this.stateEntity.updateStepAvailability(step, isAvailable);
  }

  changeMode(mode: WizardMode): void {
    this.stateEntity.updateMode(mode);
  }

  updateStatus(status: WizardStatus): void {
    this.stateEntity.updateStatus(status);
  }

  // Item Wizard methods
  startItemWizard(): void {
    this.itemEntity.startItemWizard();
  }

  finishItemWizard(saveItem: boolean): void {
    this.itemEntity.finishItemWizard(saveItem);
  }

  // Reset method
  reset(): void {
    this.stateEntity.updateStatus(WizardStatus.IDLE);
    this.navigationEntity.reset();

    // Скидаємо доступність - тільки перший крок доступний
    const newAvailability: StepAvailability = {} as StepAvailability;
    Object.values(WizardStep).forEach((step) => {
      this.stateEntity.updateStepAvailability(step, step === WizardStep.CLIENT_SELECTION);
    });

    this.stateEntity.setItemWizardActive(false);
  }

  // Events methods
  getEvents(): readonly WizardDomainEvent[] {
    return this.stateEntity.getEvents();
  }

  clearEvents(): void {
    this.stateEntity.clearEvents();
  }
}
