import {
  WizardStep,
  WizardMode,
  WizardStatus,
  WizardContext,
  StepAvailability,
  WizardEventType,
  WizardDomainEvent,
} from '../types';

/**
 * Wizard State Entity
 * Спеціалізована entity для управління базовим станом wizard
 *
 * SOLID принципи:
 * - Single Responsibility: тільки стан wizard
 * - Open/Closed: легко розширюється новими властивостями стану
 * - Encapsulation: захищений доступ до стану
 */
export class WizardStateEntity {
  private readonly events: WizardDomainEvent[] = [];

  constructor(
    private readonly _id: string,
    private _currentStep: WizardStep,
    private _mode: WizardMode,
    private _status: WizardStatus,
    private _context: WizardContext,
    private _availability: StepAvailability,
    private _isItemWizardActive: boolean = false
  ) {
    this.validateInvariants();
  }

  // Геттери (Read-only доступ)
  get id(): string {
    return this._id;
  }

  get currentStep(): WizardStep {
    return this._currentStep;
  }

  get mode(): WizardMode {
    return this._mode;
  }

  get status(): WizardStatus {
    return this._status;
  }

  get context(): WizardContext {
    return { ...this._context };
  }

  get availability(): StepAvailability {
    return { ...this._availability };
  }

  get isItemWizardActive(): boolean {
    return this._isItemWizardActive;
  }

  // Методи оновлення стану
  updateCurrentStep(step: WizardStep): void {
    this._currentStep = step;
    this.emitEvent(WizardEventType.STEP_ENTERED, { step });
    this.validateInvariants();
  }

  updateMode(mode: WizardMode): void {
    const previousMode = this._mode;
    this._mode = mode;
    this.emitEvent(WizardEventType.WIZARD_STARTED, { mode, previousMode });
  }

  updateStatus(status: WizardStatus): void {
    this._status = status;
  }

  updateStepAvailability(step: WizardStep, isAvailable: boolean): void {
    this._availability = {
      ...this._availability,
      [step]: isAvailable,
    };
  }

  setItemWizardActive(isActive: boolean): void {
    this._isItemWizardActive = isActive;

    if (isActive) {
      this.emitEvent(WizardEventType.ITEM_WIZARD_STARTED, {
        parentStep: this._currentStep,
      });
    } else {
      this.emitEvent(WizardEventType.ITEM_WIZARD_COMPLETED, {});
    }
  }

  // Події
  getEvents(): readonly WizardDomainEvent[] {
    return [...this.events];
  }

  clearEvents(): void {
    this.events.length = 0;
  }

  // Валідація
  private validateInvariants(): void {
    if (!this._currentStep) {
      throw new Error('Поточний крок не може бути порожнім');
    }

    if (!this._availability[this._currentStep]) {
      throw new Error(`Поточний крок ${this._currentStep} недоступний`);
    }
  }

  private emitEvent(type: WizardEventType, payload: Record<string, unknown>): void {
    const event: WizardDomainEvent = {
      type,
      timestamp: Date.now(),
      step: this._currentStep,
      payload,
    };

    this.events.push(event);
  }
}
