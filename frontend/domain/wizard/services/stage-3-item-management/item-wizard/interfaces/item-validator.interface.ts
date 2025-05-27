/**
 * @fileoverview Інтерфейс для валідації предметів
 * @module domain/wizard/services/stage-3-item-management/item-wizard/interfaces/item-validator
 */

import type { WizardOrderItem, WizardOrderItemDetailed } from '../../../../schemas';
import type { ItemValidationResult } from '../types/item-operation-result.types';
import type { ItemWizardStep } from '../types/item-wizard-steps.types';

/**
 * Інтерфейс для валідації предметів
 */
export interface IItemValidatorService {
  /**
   * Валідація базової інформації предмета
   */
  validateBasicInfo(itemData: Partial<WizardOrderItem>): ItemValidationResult;

  /**
   * Валідація характеристик предмета
   */
  validateCharacteristics(itemData: Partial<WizardOrderItemDetailed>): ItemValidationResult;

  /**
   * Валідація дефектів та ризиків
   */
  validateDefectsAndRisks(itemData: Partial<WizardOrderItemDetailed>): ItemValidationResult;

  /**
   * Валідація фотографій
   */
  validatePhotos(photos: string[]): ItemValidationResult;

  /**
   * Повна валідація предмета
   */
  validateItem(itemData: Partial<WizardOrderItemDetailed>): ItemValidationResult;

  /**
   * Валідація поточного кроку
   */
  validateCurrentStep(
    step: ItemWizardStep,
    itemData: Partial<WizardOrderItemDetailed>
  ): ItemValidationResult;
}
