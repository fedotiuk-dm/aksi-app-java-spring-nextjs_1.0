/**
 * Типи подій wizard для XState - відповідальність за структури подій state machine
 */

import { WizardStep, ItemWizardStep } from '../common/wizard-steps.types';

/**
 * Базова подія wizard
 */
export interface BaseWizardEvent {
  type: string;
  timestamp?: Date;
  source?: string;
  correlationId?: string;
}

/**
 * Навігаційні події
 */
export interface NavigationEvent extends BaseWizardEvent {
  type: 'NEXT' | 'PREV' | 'GOTO_STEP' | 'GOTO_ITEM_STEP';
  targetStep?: WizardStep;
  targetItemStep?: ItemWizardStep;
  skipValidation?: boolean;
}

/**
 * Події валідації
 */
export interface ValidationEvent extends BaseWizardEvent {
  type: 'VALIDATE_STEP' | 'VALIDATION_SUCCESS' | 'VALIDATION_ERROR' | 'CLEAR_VALIDATION';
  step?: WizardStep;
  fields?: string[];
  errors?: string[];
  warnings?: string[];
  isBlocking?: boolean;
}

/**
 * Події збереження
 */
export interface SaveEvent extends BaseWizardEvent {
  type: 'SAVE_DRAFT' | 'AUTO_SAVE' | 'SAVE_SUCCESS' | 'SAVE_ERROR' | 'RESTORE_BACKUP';
  data?: unknown;
  error?: string;
  isDraft?: boolean;
  forceOverwrite?: boolean;
}

/**
 * Події управління lifecycle
 */
export interface ControlEvent extends BaseWizardEvent {
  type: 'RESET' | 'INITIALIZE' | 'COMPLETE' | 'CANCEL' | 'PAUSE' | 'RESUME';
  context?: unknown;
  reason?: string;
  preserveData?: boolean;
}

/**
 * Події Item Wizard
 */
export interface ItemWizardEvent extends BaseWizardEvent {
  type: 'START_ITEM_WIZARD' | 'COMPLETE_ITEM_WIZARD' | 'CANCEL_ITEM_WIZARD' | 'UPDATE_ITEM';
  itemId?: string;
  itemData?: unknown;
  editMode?: boolean;
}

/**
 * Події синхронізації
 */
export interface SyncEvent extends BaseWizardEvent {
  type: 'SYNC_START' | 'SYNC_SUCCESS' | 'SYNC_ERROR' | 'CONNECTION_LOST' | 'CONNECTION_RESTORED';
  conflictResolution?: 'server' | 'client' | 'merge';
  retryCount?: number;
}

/**
 * Об'єднаний тип всіх подій
 */
export type WizardEvent =
  | NavigationEvent
  | ValidationEvent
  | SaveEvent
  | ControlEvent
  | ItemWizardEvent
  | SyncEvent;

/**
 * Типи подій (для зручності використання)
 */
export type WizardEventType = WizardEvent['type'];

/**
 * Конкретні події для XState machine
 */
export type XStateWizardEvent =
  | { type: 'NEXT'; skipValidation?: boolean }
  | { type: 'PREV' }
  | { type: 'GOTO_STEP'; targetStep: WizardStep; skipValidation?: boolean }
  | { type: 'GOTO_ITEM_STEP'; targetItemStep: ItemWizardStep }
  | { type: 'VALIDATE_STEP'; step: WizardStep; fields?: string[] }
  | { type: 'VALIDATION_SUCCESS' }
  | { type: 'VALIDATION_ERROR'; errors: string[]; isBlocking?: boolean }
  | { type: 'CLEAR_VALIDATION'; step?: WizardStep }
  | { type: 'SAVE_DRAFT'; data?: unknown; isDraft?: boolean }
  | { type: 'AUTO_SAVE' }
  | { type: 'SAVE_SUCCESS' }
  | { type: 'SAVE_ERROR'; error: string }
  | { type: 'RESTORE_BACKUP' }
  | { type: 'RESET'; preserveData?: boolean }
  | { type: 'INITIALIZE'; context: unknown }
  | { type: 'COMPLETE' }
  | { type: 'CANCEL'; reason?: string }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'START_ITEM_WIZARD'; itemId?: string; editMode?: boolean }
  | { type: 'COMPLETE_ITEM_WIZARD'; itemData: unknown }
  | { type: 'CANCEL_ITEM_WIZARD' }
  | { type: 'UPDATE_ITEM'; itemId: string; itemData: unknown }
  | { type: 'SYNC_START' }
  | { type: 'SYNC_SUCCESS' }
  | { type: 'SYNC_ERROR'; retryCount?: number }
  | { type: 'CONNECTION_LOST' }
  | { type: 'CONNECTION_RESTORED' };
