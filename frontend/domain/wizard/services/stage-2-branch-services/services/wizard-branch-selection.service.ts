/**
 * @fileoverview Сервіс для вибору пункту прийому замовлення (філії) в Order Wizard
 * @module domain/wizard/services/stage-2-branch-services/services/wizard-branch-selection
 *
 * Цей сервіс реалізує логіку вибору філії згідно з документацією:
 * Етап 1.2: Базова інформація замовлення - Пункт прийому замовлення (вибір філії)
 */

import { getActiveBranches } from '../../../adapters/branch';
import {
  WizardBranch,
  WizardBranchFilters,
  wizardBranchSchema,
  wizardBranchFiltersSchema,
} from '../../../schemas';

import type { BranchOperationResult } from '../types';

/**
 * Інтерфейс для вибору філії в Order Wizard
 */
export interface IWizardBranchSelectionService {
  /**
   * Отримання всіх активних філій для вибору
   */
  getAvailableBranches(): Promise<BranchOperationResult<WizardBranch[]>>;

  /**
   * Вибір філії за ID
   * @param branchId ID філії
   */
  selectBranch(branchId: string): Promise<BranchOperationResult<WizardBranch>>;

  /**
   * Перевірка, чи може філія приймати замовлення
   * @param branch Філія для перевірки
   */
  canAcceptOrders(branch: WizardBranch): boolean;

  /**
   * Форматування інформації про філію для відображення у wizard
   * @param branch Філія
   */
  formatBranchForWizard(branch: WizardBranch): string;

  /**
   * Пошук філій за критеріями
   * @param filters Фільтри пошуку
   */
  searchBranches(filters: WizardBranchFilters): Promise<BranchOperationResult<WizardBranch[]>>;
}

/**
 * Помилки сервісу вибору філії
 */
export const BRANCH_SELECTION_ERRORS = {
  NO_BRANCHES_AVAILABLE: 'Немає доступних філій для прийому замовлень',
  BRANCH_NOT_FOUND: 'Філію не знайдено',
  BRANCH_INACTIVE: 'Філія неактивна та не може приймати замовлення',
  INVALID_BRANCH_ID: 'Некоректний ідентифікатор філії',
  SEARCH_FAILED: 'Помилка під час пошуку філій',
  VALIDATION_FAILED: 'Помилка валідації даних філії',
  INVALID_BRANCH_DATA: 'Знайдено невалідні дані філій',
  LOAD_FAILED: 'Не вдалося завантажити філії',
} as const;

/**
 * Сервіс для вибору пункту прийому замовлення в Order Wizard
 */
export class WizardBranchSelectionService implements IWizardBranchSelectionService {
  private branches: WizardBranch[] = [];
  private selectedBranch?: WizardBranch;

  /**
   * Отримання всіх активних філій для вибору
   */
  async getAvailableBranches(): Promise<BranchOperationResult<WizardBranch[]>> {
    try {
      // Використовуємо адаптер для завантаження активних філій з API
      const adapterResult = await getActiveBranches();

      if (!adapterResult.success || !adapterResult.data) {
        return {
          success: false,
          error: adapterResult.error || BRANCH_SELECTION_ERRORS.LOAD_FAILED,
        };
      }

      // Валідація отриманих даних через Zod схему
      const validationResults = adapterResult.data.map((branch) =>
        wizardBranchSchema.safeParse(branch)
      );
      const invalidBranches = validationResults.filter((result) => !result.success);

      if (invalidBranches.length > 0) {
        console.warn(BRANCH_SELECTION_ERRORS.INVALID_BRANCH_DATA, invalidBranches);
      }

      const validBranches = validationResults
        .filter((result) => result.success)
        .map((result) => result.data as WizardBranch);

      const activeBranches = validBranches.filter(
        (branch) => branch.active && this.canAcceptOrders(branch)
      );

      if (activeBranches.length === 0) {
        return {
          success: false,
          error: BRANCH_SELECTION_ERRORS.NO_BRANCHES_AVAILABLE,
        };
      }

      this.branches = activeBranches;

      return {
        success: true,
        data: activeBranches,
      };
    } catch (error) {
      console.error('Помилка завантаження філій:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Невідома помилка',
      };
    }
  }

  /**
   * Вибір філії за ID
   */
  async selectBranch(branchId: string): Promise<BranchOperationResult<WizardBranch>> {
    try {
      // Валідація ID філії
      if (!branchId || typeof branchId !== 'string') {
        return {
          success: false,
          error: BRANCH_SELECTION_ERRORS.INVALID_BRANCH_ID,
        };
      }

      // Якщо філії ще не завантажені, завантажуємо їх
      if (this.branches.length === 0) {
        const branchesResult = await this.getAvailableBranches();
        if (!branchesResult.success) {
          return {
            success: false,
            error: branchesResult.error || BRANCH_SELECTION_ERRORS.LOAD_FAILED,
          };
        }
      }

      // Пошук філії за ID
      const branch = this.branches.find((b) => b.id === branchId);

      if (!branch) {
        return {
          success: false,
          error: BRANCH_SELECTION_ERRORS.BRANCH_NOT_FOUND,
        };
      }

      // Перевірка, чи може філія приймати замовлення
      if (!this.canAcceptOrders(branch)) {
        return {
          success: false,
          error: BRANCH_SELECTION_ERRORS.BRANCH_INACTIVE,
        };
      }

      // Валідація даних філії через Zod схему
      const validationResult = wizardBranchSchema.safeParse(branch);
      if (!validationResult.success) {
        return {
          success: false,
          error: BRANCH_SELECTION_ERRORS.VALIDATION_FAILED,
        };
      }

      this.selectedBranch = branch;

      return {
        success: true,
        data: branch,
      };
    } catch (error) {
      console.error('Помилка вибору філії:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Невідома помилка',
      };
    }
  }

  /**
   * Перевірка, чи може філія приймати замовлення
   */
  canAcceptOrders(branch: WizardBranch): boolean {
    return branch.active;
  }

  /**
   * Форматування інформації про філію для відображення у wizard
   */
  formatBranchForWizard(branch: WizardBranch): string {
    return `${branch.name} (${branch.code}) - ${branch.address}`;
  }

  /**
   * Пошук філій за критеріями
   */
  async searchBranches(
    filters: WizardBranchFilters
  ): Promise<BranchOperationResult<WizardBranch[]>> {
    try {
      // Валідація фільтрів через Zod схему
      const validationResult = wizardBranchFiltersSchema.safeParse(filters);
      if (!validationResult.success) {
        return {
          success: false,
          error: BRANCH_SELECTION_ERRORS.VALIDATION_FAILED,
        };
      }

      // Якщо філії ще не завантажені, завантажуємо їх
      if (this.branches.length === 0) {
        const branchesResult = await this.getAvailableBranches();
        if (!branchesResult.success) {
          return {
            success: false,
            error: branchesResult.error || BRANCH_SELECTION_ERRORS.LOAD_FAILED,
          };
        }
      }

      let filteredBranches = [...this.branches];

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

      // Фільтрація за кодом
      if (filters.code) {
        filteredBranches = filteredBranches.filter((branch) => branch.code === filters.code);
      }

      // Фільтрація за активністю (додатковий фільтр)
      if (filters.active !== undefined) {
        filteredBranches = filteredBranches.filter((branch) => branch.active === filters.active);
      }

      return {
        success: true,
        data: filteredBranches,
      };
    } catch (error) {
      console.error('Помилка пошуку філій:', error);
      return {
        success: false,
        error: BRANCH_SELECTION_ERRORS.SEARCH_FAILED,
      };
    }
  }

  /**
   * Отримання поточно вибраної філії
   */
  getSelectedBranch(): WizardBranch | undefined {
    return this.selectedBranch;
  }

  /**
   * Скидання вибору філії
   */
  clearSelection(): void {
    this.selectedBranch = undefined;
  }
}

// Експортуємо singleton екземпляр
export const wizardBranchSelectionService = new WizardBranchSelectionService();
