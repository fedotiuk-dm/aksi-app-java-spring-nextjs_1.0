/**
 * XState події для Order Wizard
 * Типізовані події для state machine
 */

import { WizardStep, ItemWizardStep } from './wizard-common.types';

// Базова подія
export interface BaseWizardEvent {
  type: string;
  timestamp?: Date;
  source?: string;
}

// Навігаційні події
export interface NavigationEvent extends BaseWizardEvent {
  type: 'NEXT' | 'PREV' | 'GOTO_STEP' | 'GOTO_ITEM_STEP';
  targetStep?: WizardStep;
  targetItemStep?: ItemWizardStep;
}

// Події валідації
export interface ValidationEvent extends BaseWizardEvent {
  type: 'VALIDATE_STEP' | 'VALIDATION_SUCCESS' | 'VALIDATION_ERROR';
  step?: WizardStep;
  errors?: string[];
  warnings?: string[];
}

// Події збереження
export interface SaveEvent extends BaseWizardEvent {
  type: 'SAVE_DRAFT' | 'AUTO_SAVE' | 'SAVE_SUCCESS' | 'SAVE_ERROR';
  data?: unknown;
  error?: string;
}

// Події управління
export interface ControlEvent extends BaseWizardEvent {
  type: 'RESET' | 'INITIALIZE' | 'COMPLETE' | 'CANCEL';
  context?: unknown;
}

// Події Item Wizard
export interface ItemWizardEvent extends BaseWizardEvent {
  type: 'START_ITEM_WIZARD' | 'COMPLETE_ITEM_WIZARD' | 'CANCEL_ITEM_WIZARD';
  itemId?: string;
  itemData?: unknown;
}

// Об'єднаний тип всіх подій
export type WizardEvent =
  | NavigationEvent
  | ValidationEvent
  | SaveEvent
  | ControlEvent
  | ItemWizardEvent;

// Типи подій (для зручності)
export type WizardEventType = WizardEvent['type'];

// Конкретні події для XState
export type XStateWizardEvent =
  | { type: 'NEXT' }
  | { type: 'PREV' }
  | { type: 'GOTO_STEP'; targetStep: WizardStep }
  | { type: 'GOTO_ITEM_STEP'; targetItemStep: ItemWizardStep }
  | { type: 'VALIDATE_STEP'; step: WizardStep }
  | { type: 'VALIDATION_SUCCESS' }
  | { type: 'VALIDATION_ERROR'; errors: string[] }
  | { type: 'SAVE_DRAFT'; data?: unknown }
  | { type: 'AUTO_SAVE' }
  | { type: 'RESET' }
  | { type: 'INITIALIZE'; context: unknown }
  | { type: 'COMPLETE' }
  | { type: 'CANCEL' }
  | { type: 'START_ITEM_WIZARD'; itemId?: string }
  | { type: 'COMPLETE_ITEM_WIZARD'; itemData: unknown }
  | { type: 'CANCEL_ITEM_WIZARD' };
