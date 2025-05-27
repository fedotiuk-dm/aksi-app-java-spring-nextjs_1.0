/**
 * @fileoverview Сервіс для завантаження філій
 * @module domain/wizard/services/stage-2-branch-services/services/branch-loader
 */

import { WizardBranch } from '../../../adapters/branch';
import { getAllBranches, getActiveBranches } from '../../../adapters/branch/api/branch.api';
import { BranchOperationResult, IBranchLoaderService } from '../types/branch-service.types';

/** Константа для невідомої помилки */
export const UNKNOWN_ERROR = 'Невідома помилка при отриманні даних філій';

/**
 * Сервіс для завантаження філій Order Wizard
 * @implements IBranchLoaderService
 */
export class BranchLoaderService implements IBranchLoaderService {
  /**
   * Завантажує всі філії з бекенду
   * @returns Promise з результатом операції
   */
  async loadAllBranches(): Promise<BranchOperationResult<WizardBranch[]>> {
    try {
      const result = await getAllBranches();
      
      if (result.success && result.data) {
        return {
          success: true,
          data: result.data
        };
      } else {
        return {
          success: false,
          error: result.error || 'Не вдалося завантажити філії'
        };
      }
    } catch (error) {
      console.error('Помилка при завантаженні філій:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : UNKNOWN_ERROR
      };
    }
  }

  /**
   * Завантажує тільки активні філії з бекенду
   * @returns Promise з результатом операції
   */
  async loadActiveBranches(): Promise<BranchOperationResult<WizardBranch[]>> {
    try {
      const result = await getActiveBranches();
      
      if (result.success && result.data) {
        return {
          success: true,
          data: result.data
        };
      } else {
        return {
          success: false,
          error: result.error || 'Не вдалося завантажити активні філії'
        };
      }
    } catch (error) {
      console.error('Помилка при завантаженні активних філій:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : UNKNOWN_ERROR
      };
    }
  }
}

// Експортуємо екземпляр сервісу (Singleton)
export const branchLoaderService = new BranchLoaderService();
