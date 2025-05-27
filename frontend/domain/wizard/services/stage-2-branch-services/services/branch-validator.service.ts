/**
 * @fileoverview Сервіс валідації філій для Order Wizard
 * @module domain/wizard/services/stage-2-branch-services/services/branch-validator
 */

import {
  WizardBranch,
  WizardBranchCreateData,
  WizardBranchUpdateData,
  wizardBranchSchema,
  wizardBranchCreateDataSchema,
  wizardBranchUpdateDataSchema,
} from '../../../schemas';

import type { BranchValidationResult, IBranchValidatorService } from '../types';

/**
 * Сервіс валідації філій
 * @implements IBranchValidatorService
 */
export class BranchValidatorService implements IBranchValidatorService {
  /**
   * Перевірка, чи існує філія з вказаним ID
   * @param branches Список філій
   * @param branchId ID філії для пошуку
   * @returns true, якщо філія існує
   */
  isBranchValid(branches: WizardBranch[], branchId: string): boolean {
    return branches.some((branch) => branch.id === branchId);
  }

  /**
   * Знаходження філії за ID
   * @param branches Список філій
   * @param branchId ID філії для пошуку
   * @returns Філія або undefined
   */
  findBranchById(branches: WizardBranch[], branchId: string): WizardBranch | undefined {
    return branches.find((branch) => branch.id === branchId);
  }

  /**
   * Знаходження філії за кодом
   * @param branches Список філій
   * @param code Код філії для пошуку
   * @returns Філія або undefined
   */
  findBranchByCode(branches: WizardBranch[], code: string): WizardBranch | undefined {
    return branches.find((branch) => branch.code === code);
  }

  /**
   * Фільтрація філій за активністю
   * @param branches Список філій
   * @param active Статус активності
   * @returns Відфільтровані філії
   */
  filterByActive(branches: WizardBranch[], active: boolean): WizardBranch[] {
    return branches.filter((branch) => branch.active === active);
  }

  /**
   * Валідація даних філії через Zod схеми
   * @param branchData Дані філії для валідації
   * @returns Результат валідації
   */
  validateBranchData(
    branchData: WizardBranchCreateData | WizardBranchUpdateData
  ): BranchValidationResult {
    try {
      // Визначаємо, який тип даних ми валідуємо
      const isCreateData = this.isCreateData(branchData);
      const schema = isCreateData ? wizardBranchCreateDataSchema : wizardBranchUpdateDataSchema;

      const result = schema.safeParse(branchData);

      if (result.success) {
        return {
          isValid: true,
          errors: [],
          warnings: [],
          fieldErrors: {},
        };
      }

      // Обробляємо помилки валідації
      const fieldErrors: Record<string, string[]> = {};
      const errors: string[] = [];

      result.error.issues.forEach((issue) => {
        const fieldPath = issue.path.join('.');
        const message = issue.message;

        if (fieldPath) {
          if (!fieldErrors[fieldPath]) {
            fieldErrors[fieldPath] = [];
          }
          fieldErrors[fieldPath].push(message);
        } else {
          errors.push(message);
        }
      });

      return {
        isValid: false,
        errors,
        warnings: [],
        fieldErrors,
      };
    } catch (error) {
      console.error('Помилка валідації даних філії:', error);
      return {
        isValid: false,
        errors: ['Помилка валідації даних'],
        warnings: [],
        fieldErrors: {},
      };
    }
  }

  /**
   * Валідація існуючої філії
   * @param branch Філія для валідації
   * @returns Результат валідації
   */
  validateExistingBranch(branch: WizardBranch): BranchValidationResult {
    try {
      const result = wizardBranchSchema.safeParse(branch);

      if (result.success) {
        return {
          isValid: true,
          errors: [],
          warnings: [],
          fieldErrors: {},
        };
      }

      // Обробляємо помилки валідації
      const fieldErrors: Record<string, string[]> = {};
      const errors: string[] = [];

      result.error.issues.forEach((issue) => {
        const fieldPath = issue.path.join('.');
        const message = issue.message;

        if (fieldPath) {
          if (!fieldErrors[fieldPath]) {
            fieldErrors[fieldPath] = [];
          }
          fieldErrors[fieldPath].push(message);
        } else {
          errors.push(message);
        }
      });

      return {
        isValid: false,
        errors,
        warnings: [],
        fieldErrors,
      };
    } catch (error) {
      console.error('Помилка валідації філії:', error);
      return {
        isValid: false,
        errors: ['Помилка валідації філії'],
        warnings: [],
        fieldErrors: {},
      };
    }
  }

  /**
   * Перевірка унікальності коду філії
   * @param branches Список існуючих філій
   * @param code Код для перевірки
   * @param excludeId ID філії, яку треба виключити з перевірки (для оновлення)
   * @returns true, якщо код унікальний
   */
  isCodeUnique(branches: WizardBranch[], code: string, excludeId?: string): boolean {
    return !branches.some((branch) => branch.code === code && branch.id !== excludeId);
  }

  /**
   * Допоміжний метод для визначення типу даних
   */
  private isCreateData(
    data: WizardBranchCreateData | WizardBranchUpdateData
  ): data is WizardBranchCreateData {
    // Якщо всі обов'язкові поля для створення присутні, це CreateData
    return 'name' in data && 'address' in data && 'code' in data;
  }
}

// Експортуємо екземпляр сервісу (Singleton)
export const branchValidatorService = new BranchValidatorService();
