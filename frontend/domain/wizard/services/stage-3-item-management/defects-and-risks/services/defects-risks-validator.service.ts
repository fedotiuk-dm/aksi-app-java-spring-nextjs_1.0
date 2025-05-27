/**
 * @fileoverview Сервіс для валідації дефектів та ризиків
 * @module domain/wizard/services/stage-3-item-management/defects-and-risks/services/defects-risks-validator.service
 */

import { IDefectsRisksValidator } from '../interfaces';
import {
  DefectsRisksValidationResult,
  ItemDefect,
  ItemDefectsAndRisks,
  ItemRisk,
  ItemStain
} from '../types';

/**
 * Сервіс валідації дефектів та ризиків
 */
export class DefectsRisksValidatorService implements IDefectsRisksValidator {
  /**
   * Валідувати пляму
   * @param stain Пляма для валідації
   * @returns Результат валідації
   */
  validateStain(stain: ItemStain): DefectsRisksValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const fieldErrors: Record<string, string[]> = {};

    // Перевірка наявності типу плями
    if (!stain.stainTypeId) {
      errors.push('Тип плями є обов\'язковим');
      fieldErrors['stainTypeId'] = ['Виберіть тип плями'];
    }

    // Перевірка кастомного опису для типу "Інше"
    if (stain.stainTypeId === 'other' && !stain.customStainDescription?.trim()) {
      errors.push('Опис плями обов\'язковий для типу "Інше"');
      fieldErrors['customStainDescription'] = ['Введіть опис плями'];
    }

    // Перевірка довжини опису
    if (stain.description && stain.description.length > 500) {
      warnings.push('Опис плями занадто довгий');
      if (!fieldErrors['description']) fieldErrors['description'] = [];
      fieldErrors['description'].push('Опис має бути не більше 500 символів');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      fieldErrors
    };
  }

  /**
   * Валідувати дефект
   * @param defect Дефект для валідації
   * @returns Результат валідації
   */
  validateDefect(defect: ItemDefect): DefectsRisksValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const fieldErrors: Record<string, string[]> = {};

    // Перевірка наявності типу дефекту
    if (!defect.defectTypeId) {
      errors.push('Тип дефекту є обов\'язковим');
      fieldErrors['defectTypeId'] = ['Виберіть тип дефекту'];
    }

    // Перевірка довжини опису
    if (defect.description && defect.description.length > 500) {
      warnings.push('Опис дефекту занадто довгий');
      if (!fieldErrors['description']) fieldErrors['description'] = [];
      fieldErrors['description'].push('Опис має бути не більше 500 символів');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      fieldErrors
    };
  }

  /**
   * Валідувати ризик
   * @param risk Ризик для валідації
   * @returns Результат валідації
   */
  validateRisk(risk: ItemRisk): DefectsRisksValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const fieldErrors: Record<string, string[]> = {};

    // Перевірка наявності типу ризику
    if (!risk.riskTypeId) {
      errors.push('Тип ризику є обов\'язковим');
      fieldErrors['riskTypeId'] = ['Виберіть тип ризику'];
    }

    // Перевірка довжини опису
    if (risk.description && risk.description.length > 500) {
      warnings.push('Опис ризику занадто довгий');
      if (!fieldErrors['description']) fieldErrors['description'] = [];
      fieldErrors['description'].push('Опис має бути не більше 500 символів');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      fieldErrors
    };
  }

  /**
   * Валідувати всі дефекти та ризики
   * @param defectsAndRisks Дефекти та ризики для валідації
   * @returns Результат валідації
   */
  validateAll(defectsAndRisks: ItemDefectsAndRisks): DefectsRisksValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const fieldErrors: Record<string, string[]> = {};

    // Валідація плям
    if (defectsAndRisks.stains && defectsAndRisks.stains.length > 0) {
      for (const [index, stain] of defectsAndRisks.stains.entries()) {
        const stainValidation = this.validateStain(stain);

        if (!stainValidation.isValid) {
          errors.push(`Пляма #${index + 1} містить помилки`);

          // Додавання помилок полів з префіксом
          Object.entries(stainValidation.fieldErrors).forEach(([field, fieldErrors]) => {
            const prefixedField = `stains[${index}].${field}`;
            fieldErrors[prefixedField] = fieldErrors;
          });
        }

        if (stainValidation.warnings.length > 0) {
          warnings.push(...stainValidation.warnings.map(w => `Пляма #${index + 1}: ${w}`));
        }
      }
    }

    // Валідація дефектів
    if (defectsAndRisks.defects && defectsAndRisks.defects.length > 0) {
      for (const [index, defect] of defectsAndRisks.defects.entries()) {
        const defectValidation = this.validateDefect(defect);

        if (!defectValidation.isValid) {
          errors.push(`Дефект #${index + 1} містить помилки`);

          // Додавання помилок полів з префіксом
          Object.entries(defectValidation.fieldErrors).forEach(([field, fieldErrors]) => {
            const prefixedField = `defects[${index}].${field}`;
            fieldErrors[prefixedField] = fieldErrors;
          });
        }

        if (defectValidation.warnings.length > 0) {
          warnings.push(...defectValidation.warnings.map(w => `Дефект #${index + 1}: ${w}`));
        }
      }
    }

    // Валідація ризиків
    if (defectsAndRisks.risks && defectsAndRisks.risks.length > 0) {
      for (const [index, risk] of defectsAndRisks.risks.entries()) {
        const riskValidation = this.validateRisk(risk);

        if (!riskValidation.isValid) {
          errors.push(`Ризик #${index + 1} містить помилки`);

          // Додавання помилок полів з префіксом
          Object.entries(riskValidation.fieldErrors).forEach(([field, fieldErrors]) => {
            const prefixedField = `risks[${index}].${field}`;
            fieldErrors[prefixedField] = fieldErrors;
          });
        }

        if (riskValidation.warnings.length > 0) {
          warnings.push(...riskValidation.warnings.map(w => `Ризик #${index + 1}: ${w}`));
        }
      }
    }

    // Валідація відсутності гарантій
    if (defectsAndRisks.noGuarantees && !defectsAndRisks.noGuaranteesReason?.trim()) {
      errors.push('Необхідно вказати причину відсутності гарантій');
      fieldErrors['noGuaranteesReason'] = ['Вкажіть причину відсутності гарантій'];
    }

    // Валідація приміток
    if (defectsAndRisks.notes && defectsAndRisks.notes.length > 1000) {
      warnings.push('Примітки занадто довгі');
      fieldErrors['notes'] = ['Примітки мають бути не більше 1000 символів'];
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      fieldErrors
    };
  }
}
