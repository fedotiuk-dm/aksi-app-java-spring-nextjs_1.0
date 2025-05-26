/**
 * @fileoverview Сервіс вибору філії для Order Wizard
 * @module domain/wizard/services/stage-2-branch-services/services
 */

import { getAllBranches, getActiveBranches } from '../../../adapters/branch';

import type { WizardBranch, WizardBranchOperationResult } from '../../../adapters/branch';

/**
 * Простий сервіс для вибору філії (пункту прийому замовлення)
 * Відповідає за отримання списку філій та вибір філії для замовлення
 */
export class BranchSelectionService {
  /**
   * Отримання всіх філій
   */
  async getAllBranches(): Promise<WizardBranchOperationResult<WizardBranch[]>> {
    try {
      return await getAllBranches();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Невідома помилка',
      };
    }
  }

  /**
   * Отримання тільки активних філій
   */
  async getActiveBranches(): Promise<WizardBranchOperationResult<WizardBranch[]>> {
    try {
      return await getActiveBranches();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Невідома помилка',
      };
    }
  }

  /**
   * Перевірка, чи існує філія з вказаним ID
   * @param branches Список філій
   * @param branchId ID філії для перевірки
   */
  isBranchValid(branches: WizardBranch[], branchId: string): boolean {
    return branches.some(branch => branch.id === branchId && branch.active);
  }

  /**
   * Знаходження філії за ID
   * @param branches Список філій
   * @param branchId ID філії
   */
  findBranchById(branches: WizardBranch[], branchId: string): WizardBranch | undefined {
    return branches.find(branch => branch.id === branchId);
  }

  /**
   * Форматування назви філії
   * @param branch Філія
   */
  formatBranchName(branch: WizardBranch): string {
    return `${branch.name} (${branch.address})`;
  }
}

// Експортуємо екземпляр сервісу (Singleton)
export const branchSelectionService = new BranchSelectionService();
