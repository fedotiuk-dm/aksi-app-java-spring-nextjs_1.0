/**
 * @fileoverview Основний сервіс управління філіями для Order Wizard
 * @module domain/wizard/services/stage-2-branch-services/services/branch
 */

import { BranchLoaderService } from './branch-loader.service';
import { BranchOperationsService } from './branch-operations.service';
import { BranchSelectionService } from './branch-selection.service';
import { BranchValidatorService } from './branch-validator.service';

import type {
  WizardBranch,
  WizardBranchCreateData,
  WizardBranchUpdateData,
} from '../../../schemas';
import type {
  BranchFilters,
  BranchValidationResult,
  BranchServiceState,
  BranchOperationResult,
} from '../types';

/**
 * Основний сервіс управління філіями
 * Об'єднує функціональність всіх інших сервісів філій
 * @implements IBranchService
 */
export class BranchService {
  private loaderService: BranchLoaderService;
  private validatorService: BranchValidatorService;
  private selectionService: BranchSelectionService;
  private operationsService: BranchOperationsService;

  private state: BranchServiceState = {
    branches: [],
    activeBranches: [],
    loading: false,
    error: undefined,
    lastFilter: undefined,
  };

  constructor() {
    this.loaderService = new BranchLoaderService();
    this.validatorService = new BranchValidatorService();
    this.selectionService = new BranchSelectionService();
    this.operationsService = new BranchOperationsService();
  }

  /**
   * Завантаження всіх філій
   */
  async loadAllBranches(): Promise<BranchOperationResult<WizardBranch[]>> {
    this.state.loading = true;
    this.state.error = undefined;

    try {
      const result = await this.loaderService.loadAllBranches();

      if (result.success && result.data) {
        this.state.branches = result.data;
      } else {
        this.state.error = result.error;
      }

      return result;
    } finally {
      this.state.loading = false;
    }
  }

  /**
   * Завантаження тільки активних філій
   */
  async loadActiveBranches(): Promise<BranchOperationResult<WizardBranch[]>> {
    this.state.loading = true;
    this.state.error = undefined;

    try {
      const result = await this.loaderService.loadActiveBranches();

      if (result.success && result.data) {
        this.state.activeBranches = result.data;
      } else {
        this.state.error = result.error;
      }

      return result;
    } finally {
      this.state.loading = false;
    }
  }

  /**
   * Отримання філії за ідентифікатором
   */
  async getBranchById(branchId: string): Promise<BranchOperationResult<WizardBranch>> {
    // Якщо філії ще не завантажені, завантажуємо їх
    if (this.state.branches.length === 0) {
      const loadResult = await this.loadAllBranches();
      if (!loadResult.success) {
        return {
          success: false,
          error: loadResult.error,
        };
      }
    }

    const branch = this.validatorService.findBranchById(this.state.branches, branchId);

    if (!branch) {
      return {
        success: false,
        error: `Філію з ID ${branchId} не знайдено`,
      };
    }

    return {
      success: true,
      data: branch,
    };
  }

  /**
   * Отримання філії за кодом
   */
  async getBranchByCode(code: string): Promise<BranchOperationResult<WizardBranch>> {
    // Якщо філії ще не завантажені, завантажуємо їх
    if (this.state.branches.length === 0) {
      const loadResult = await this.loadAllBranches();
      if (!loadResult.success) {
        return {
          success: false,
          error: loadResult.error,
        };
      }
    }

    const branch = this.validatorService.findBranchByCode(this.state.branches, code);

    if (!branch) {
      return {
        success: false,
        error: `Філію з кодом ${code} не знайдено`,
      };
    }

    return {
      success: true,
      data: branch,
    };
  }

  /**
   * Фільтрація філій за заданими критеріями
   */
  filterBranches(filters: BranchFilters): WizardBranch[] {
    this.state.lastFilter = filters;
    let filteredBranches = [...this.state.branches];

    // Фільтрація за пошуковим терміном
    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
      filteredBranches = filteredBranches.filter(
        (branch) =>
          branch.name.toLowerCase().includes(searchTerm) ||
          branch.address.toLowerCase().includes(searchTerm) ||
          branch.code.toLowerCase().includes(searchTerm)
      );
    }

    // Фільтрація за активністю
    if (filters.active !== undefined) {
      filteredBranches = this.validatorService.filterByActive(filteredBranches, filters.active);
    }

    // Фільтрація за кодом
    if (filters.code) {
      filteredBranches = filteredBranches.filter((branch) => branch.code === filters.code);
    }

    return filteredBranches;
  }

  /**
   * Вибір філії
   */
  async selectBranch(branchId: string): Promise<BranchOperationResult<WizardBranch>> {
    const result = await this.selectionService.selectBranch(branchId);

    if (result.success && result.data) {
      this.state.selectedBranch = result.data;
    }

    return result;
  }

  /**
   * Створення нової філії
   */
  async createBranch(
    branchData: WizardBranchCreateData
  ): Promise<BranchOperationResult<WizardBranch>> {
    return this.operationsService.createBranch(branchData);
  }

  /**
   * Оновлення існуючої філії
   */
  async updateBranch(
    branchId: string,
    branchData: WizardBranchUpdateData
  ): Promise<BranchOperationResult<WizardBranch>> {
    return this.operationsService.updateBranch(branchId, branchData);
  }

  /**
   * Видалення філії
   */
  async deleteBranch(branchId: string): Promise<BranchOperationResult<void>> {
    return this.operationsService.deleteBranch(branchId);
  }

  /**
   * Активація філії
   */
  async activateBranch(branchId: string): Promise<BranchOperationResult<WizardBranch>> {
    return this.operationsService.activateBranch(branchId);
  }

  /**
   * Деактивація філії
   */
  async deactivateBranch(branchId: string): Promise<BranchOperationResult<WizardBranch>> {
    return this.operationsService.deactivateBranch(branchId);
  }

  /**
   * Валідація даних філії
   */
  validateBranchData(
    branchData: WizardBranchCreateData | WizardBranchUpdateData
  ): BranchValidationResult {
    return this.validatorService.validateBranchData(branchData);
  }

  /**
   * Отримання поточного стану сервісу філій
   */
  getState(): BranchServiceState {
    return { ...this.state };
  }

  /**
   * Скидання стану до початкового
   */
  resetState(): void {
    this.state = {
      branches: [],
      activeBranches: [],
      loading: false,
      error: undefined,
      lastFilter: undefined,
    };

    // Очищуємо кеш завантажувача
    this.loaderService.clearCache();
  }
}

// Експортуємо екземпляр сервісу (Singleton)
export const branchService = new BranchService();
