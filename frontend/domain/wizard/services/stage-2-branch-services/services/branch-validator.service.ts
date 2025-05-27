/**
 * @fileoverview Сервіс для валідації філій
 * @module domain/wizard/services/stage-2-branch-services/services/branch-validator
 */

import type {
  WizardBranch,
  WizardBranchCreateData,
  WizardBranchUpdateData
} from '../../../adapters/branch';
import type { BranchValidationResult, IBranchValidatorService } from '../types/branch-service.types';

/**
 * Сервіс для валідації філій
 * @implements IBranchValidatorService
 */
export class BranchValidatorService implements IBranchValidatorService {
  /**
   * Перевіряє, чи існує філія з вказаним ID
   * @param branches Масив філій
   * @param branchId ID філії
   * @returns true, якщо філія існує
   */
  isBranchValid(branches: WizardBranch[], branchId: string): boolean {
    return branches.some(branch => branch.id === branchId);
  }

  /**
   * Знаходить філію за ID
   * @param branches Масив філій
   * @param branchId ID філії
   * @returns Знайдена філія або undefined
   */
  findBranchById(branches: WizardBranch[], branchId: string): WizardBranch | undefined {
    return branches.find(branch => branch.id === branchId);
  }

  /**
   * Знаходить філію за кодом
   * @param branches Масив філій
   * @param code Код філії
   * @returns Знайдена філія або undefined
   */
  findBranchByCode(branches: WizardBranch[], code: string): WizardBranch | undefined {
    return branches.find(branch => branch.code === code);
  }

  /**
   * Фільтрує філії за активністю
   * @param branches Масив філій
   * @param active Активність філій
   * @returns Фільтрований масив філій
   */
  filterByActive(branches: WizardBranch[], active: boolean): WizardBranch[] {
    return branches.filter(branch => branch.active === active);
  }

  /**
   * Валідує дані філії перед створенням або оновленням
   * @param branchData Дані філії
   * @returns Результат валідації
   */
  validateBranchData(branchData: WizardBranchCreateData | WizardBranchUpdateData): BranchValidationResult {
    const errors: { [key: string]: string } = {};

    // Валідація назви
    if (!branchData.name || branchData.name.trim() === '') {
      errors.name = 'Назва філії обов’язкова';
    } else if (branchData.name.length < 3) {
      errors.name = 'Назва філії повинна містити мінімум 3 символи';
    }

    // Валідація коду
    if (!branchData.code || branchData.code.trim() === '') {
      errors.code = 'Код філії обов’язковий';
    } else if (!/^[A-Z0-9]+$/.test(branchData.code)) {
      errors.code = 'Код філії повинен містити лише великі літери та цифри';
    }

    // Валідація адреси
    if (!branchData.address || branchData.address.trim() === '') {
      errors.address = 'Адреса філії обов’язкова';
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors
    };
  }
}

// Експортуємо екземпляр сервісу (Singleton)
export const branchValidatorService = new BranchValidatorService();
