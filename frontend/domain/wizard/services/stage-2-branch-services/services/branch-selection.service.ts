/**
 * @fileoverview Сервіс для вибору філій в Order Wizard
 * @module domain/wizard/services/stage-2-branch-services/services/branch-selection
 */

import { BranchLoaderService, UNKNOWN_ERROR } from './branch-loader.service';
import { BranchValidatorService } from './branch-validator.service';
import { WizardBranch } from '../../../adapters/branch';
import { BranchOperationResult, IBranchSelectionService } from '../types/branch-service.types';

/**
 * Сервіс для вибору філій в Order Wizard
 * @implements IBranchSelectionService
 */
export class BranchSelectionService implements IBranchSelectionService {
  private loaderService: BranchLoaderService;
  private validatorService: BranchValidatorService;
  private branches: WizardBranch[] = [];
  private activeBranches: WizardBranch[] = [];

  constructor() {
    this.loaderService = new BranchLoaderService();
    this.validatorService = new BranchValidatorService();
  }

  /**
   * Форматує назву філії для відображення
   * @param branch Філія для форматування
   * @returns Форматована назва філії
   */
  formatBranchName(branch: WizardBranch): string {
    return `${branch.name} (${branch.code})`;
  }

  /**
   * Вибір філії за ідентифікатором
   * @param branchId Ідентифікатор філії
   * @returns Promise з результатом операції
   */
  async selectBranch(branchId: string): Promise<BranchOperationResult<WizardBranch>> {
    try {
      // Якщо у нас ще немає завантажених філій, завантажуємо їх
      if (this.branches.length === 0) {
        const branchesResult = await this.loaderService.loadAllBranches();
        if (!branchesResult.success || !branchesResult.data) {
          return {
            success: false,
            error: branchesResult.error || 'Не вдалося завантажити філії'
          };
        }
        this.branches = branchesResult.data;
      }

      // Якщо у нас ще немає завантажених активних філій, завантажуємо їх
      if (this.activeBranches.length === 0) {
        const activeBranchesResult = await this.loaderService.loadActiveBranches();
        if (!activeBranchesResult.success || !activeBranchesResult.data) {
          return {
            success: false,
            error: activeBranchesResult.error || 'Не вдалося завантажити активні філії'
          };
        }
        this.activeBranches = activeBranchesResult.data;
      }

      // Перевіряємо, чи існує філія з вказаним ID
      const branch = this.validatorService.findBranchById(this.branches, branchId);
      if (!branch) {
        return {
          success: false,
          error: `Філію з ID ${branchId} не знайдено`
        };
      }

      // Перевіряємо, чи є філія активною
      if (!branch.active) {
        return {
          success: false,
          error: `Філія ${branch.name} неактивна. Виберіть активну філію.`
        };
      }

      // Повертаємо успішний результат
      return {
        success: true,
        data: branch
      };
    } catch (error) {
      console.error('Помилка при виборі філії:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : UNKNOWN_ERROR
      };
    }
  }
}

// Експортуємо екземпляр сервісу (Singleton)
export const branchSelectionService = new BranchSelectionService();
