/**
 * @fileoverview Інтерфейси для сервісів філій
 * @module domain/wizard/services/stage-2-branch-services/interfaces
 */

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
} from '../types/';

/**
 * Інтерфейс сервісу управління філіями
 */
export interface IBranchService {
  /**
   * Завантаження всіх філій
   */
  loadAllBranches(): Promise<BranchOperationResult<WizardBranch[]>>;

  /**
   * Завантаження тільки активних філій
   */
  loadActiveBranches(): Promise<BranchOperationResult<WizardBranch[]>>;

  /**
   * Отримання філії за ідентифікатором
   * @param branchId Ідентифікатор філії
   */
  getBranchById(branchId: string): Promise<BranchOperationResult<WizardBranch>>;

  /**
   * Отримання філії за кодом
   * @param code Код філії
   */
  getBranchByCode(code: string): Promise<BranchOperationResult<WizardBranch>>;

  /**
   * Фільтрація філій за заданими критеріями
   * @param filters Фільтри для філій
   */
  filterBranches(filters: BranchFilters): WizardBranch[];

  /**
   * Вибір філії
   * @param branchId Ідентифікатор філії
   */
  selectBranch(branchId: string): Promise<BranchOperationResult<WizardBranch>>;

  /**
   * Створення нової філії
   * @param branchData Дані нової філії
   */
  createBranch(branchData: WizardBranchCreateData): Promise<BranchOperationResult<WizardBranch>>;

  /**
   * Оновлення існуючої філії
   * @param branchId Ідентифікатор філії
   * @param branchData Дані для оновлення
   */
  updateBranch(
    branchId: string,
    branchData: WizardBranchUpdateData
  ): Promise<BranchOperationResult<WizardBranch>>;

  /**
   * Видалення філії
   * @param branchId Ідентифікатор філії
   */
  deleteBranch(branchId: string): Promise<BranchOperationResult<void>>;

  /**
   * Активація філії
   * @param branchId Ідентифікатор філії
   */
  activateBranch(branchId: string): Promise<BranchOperationResult<WizardBranch>>;

  /**
   * Деактивація філії
   * @param branchId Ідентифікатор філії
   */
  deactivateBranch(branchId: string): Promise<BranchOperationResult<WizardBranch>>;

  /**
   * Валідація даних філії
   * @param branchData Дані філії для валідації
   */
  validateBranchData(
    branchData: WizardBranchCreateData | WizardBranchUpdateData
  ): BranchValidationResult;

  /**
   * Отримання поточного стану сервісу філій
   */
  getState(): BranchServiceState;

  /**
   * Скидання стану до початкового
   */
  resetState(): void;
}
