/**
 * @fileoverview Сервіс завантаження філій для Order Wizard
 * @module domain/wizard/services/stage-2-branch-services/services/branch-loader
 */

import { getAllBranches, getActiveBranches } from '../../../adapters/branch';
import { WizardBranch, wizardBranchSchema } from '../../../schemas';

import type { BranchOperationResult, IBranchLoaderService } from '../types';

/**
 * Константи помилок
 */
export const BRANCH_LOADER_ERRORS = {
  LOAD_FAILED: 'Не вдалося завантажити філії',
  NO_ACTIVE_BRANCHES: 'Немає активних філій',
  NETWORK_ERROR: 'Помилка мережі при завантаженні філій',
  VALIDATION_ERROR: 'Помилка валідації даних філій',
} as const;

/**
 * Сервіс завантаження філій
 * @implements IBranchLoaderService
 */
export class BranchLoaderService implements IBranchLoaderService {
  private cachedBranches: WizardBranch[] = [];
  private cachedActiveBranches: WizardBranch[] = [];
  private lastLoadTime: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 хвилин

  /**
   * Завантаження всіх філій
   * @returns Promise з результатом операції
   */
  async loadAllBranches(): Promise<BranchOperationResult<WizardBranch[]>> {
    try {
      // Перевіряємо кеш
      if (this.isCacheValid() && this.cachedBranches.length > 0) {
        return {
          success: true,
          data: this.cachedBranches,
        };
      }

      // Використовуємо адаптер для завантаження філій з API
      const adapterResult = await getAllBranches();

      if (!adapterResult.success || !adapterResult.data) {
        return {
          success: false,
          error: adapterResult.error || BRANCH_LOADER_ERRORS.LOAD_FAILED,
        };
      }

      // Валідація отриманих даних через Zod схему
      const validationResults = adapterResult.data.map((branch) =>
        wizardBranchSchema.safeParse(branch)
      );
      const invalidBranches = validationResults.filter((result) => !result.success);

      if (invalidBranches.length > 0) {
        console.warn('Знайдено невалідні дані філій:', invalidBranches);
      }

      const validBranches = validationResults
        .filter((result) => result.success)
        .map((result) => result.data as WizardBranch);

      // Оновлюємо кеш
      this.cachedBranches = validBranches;
      this.lastLoadTime = Date.now();

      return {
        success: true,
        data: validBranches,
      };
    } catch (error) {
      console.error('Помилка завантаження філій:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : BRANCH_LOADER_ERRORS.LOAD_FAILED,
      };
    }
  }

  /**
   * Завантаження тільки активних філій
   * @returns Promise з результатом операції
   */
  async loadActiveBranches(): Promise<BranchOperationResult<WizardBranch[]>> {
    try {
      // Перевіряємо кеш активних філій
      if (this.isCacheValid() && this.cachedActiveBranches.length > 0) {
        return {
          success: true,
          data: this.cachedActiveBranches,
        };
      }

      // Використовуємо спеціалізований адаптер для активних філій
      const adapterResult = await getActiveBranches();

      if (!adapterResult.success || !adapterResult.data) {
        return {
          success: false,
          error: adapterResult.error || BRANCH_LOADER_ERRORS.LOAD_FAILED,
        };
      }

      // Валідація отриманих даних
      const validationResults = adapterResult.data.map((branch) =>
        wizardBranchSchema.safeParse(branch)
      );
      const invalidBranches = validationResults.filter((result) => !result.success);

      if (invalidBranches.length > 0) {
        console.warn('Знайдено невалідні дані активних філій:', invalidBranches);
      }

      const activeBranches = validationResults
        .filter((result) => result.success)
        .map((result) => result.data as WizardBranch);

      if (activeBranches.length === 0) {
        return {
          success: false,
          error: BRANCH_LOADER_ERRORS.NO_ACTIVE_BRANCHES,
        };
      }

      // Оновлюємо кеш активних філій
      this.cachedActiveBranches = activeBranches;

      return {
        success: true,
        data: activeBranches,
      };
    } catch (error) {
      console.error('Помилка завантаження активних філій:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : BRANCH_LOADER_ERRORS.LOAD_FAILED,
      };
    }
  }

  /**
   * Очищення кешу
   */
  clearCache(): void {
    this.cachedBranches = [];
    this.cachedActiveBranches = [];
    this.lastLoadTime = 0;
  }

  /**
   * Примусове оновлення даних (ігнорує кеш)
   */
  async forceReload(): Promise<BranchOperationResult<WizardBranch[]>> {
    this.clearCache();
    return this.loadAllBranches();
  }

  /**
   * Перевірка валідності кешу
   */
  private isCacheValid(): boolean {
    return Date.now() - this.lastLoadTime < this.CACHE_DURATION;
  }

  /**
   * Отримання інформації про стан кешу
   */
  getCacheInfo(): {
    hasCachedBranches: boolean;
    hasCachedActiveBranches: boolean;
    cacheAge: number;
    isValid: boolean;
  } {
    const cacheAge = Date.now() - this.lastLoadTime;
    return {
      hasCachedBranches: this.cachedBranches.length > 0,
      hasCachedActiveBranches: this.cachedActiveBranches.length > 0,
      cacheAge,
      isValid: this.isCacheValid(),
    };
  }
}

// Експортуємо екземпляр сервісу (Singleton)
export const branchLoaderService = new BranchLoaderService();
