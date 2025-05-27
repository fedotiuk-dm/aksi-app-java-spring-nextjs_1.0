/**
 * @fileoverview Типи для сервісів філій Order Wizard
 * @module domain/wizard/services/stage-2-branch-services/types
 */

import type {
  WizardBranch,
  WizardBranchCreateData,
  WizardBranchUpdateData
} from '../../../adapters/branch';

/**
 * Фільтри для філій
 */
export interface BranchFilters {
  /** Пошук за назвою філії */
  name?: string;
  /** Фільтр за активністю */
  active?: boolean;
  /** Пошук за адресою */
  address?: string;
  /** Пошук за кодом філії */
  code?: string;
}

/**
 * Результат операції з філіями
 */
export interface BranchOperationResult<T> {
  /** Успішність операції */
  success: boolean;
  /** Дані у випадку успіху */
  data?: T;
  /** Текст помилки у випадку неуспішної операції */
  error?: string;
}

/**
 * Результат валідації даних філії
 */
export interface BranchValidationResult {
  /** Успішність валідації */
  valid: boolean;
  /** Помилки валідації за полями */
  errors: {
    [key: string]: string;
  };
}

/**
 * Стан сервісу філій
 */
export interface BranchServiceState {
  /** Поточний список всіх філій */
  branches: WizardBranch[];
  /** Поточний список активних філій */
  activeBranches: WizardBranch[];
  /** Поточна вибрана філія */
  selectedBranch?: WizardBranch;
  /** Індикатор завантаження */
  loading: boolean;
  /** Помилка (якщо є) */
  error?: string;
  /** Останній використаний фільтр */
  lastFilter?: BranchFilters;
}

/**
 * Типи сервісів філій - описують сигнатури методів та типи для різних сервісів
 */

/**
 * Тип для сервісу завантаження філій
 */
export interface IBranchLoaderService {
  /** Завантаження всіх філій */
  loadAllBranches(): Promise<BranchOperationResult<WizardBranch[]>>;
  
  /** Завантаження тільки активних філій */
  loadActiveBranches(): Promise<BranchOperationResult<WizardBranch[]>>;
}

/**
 * Тип для сервісу валідації філій
 */
export interface IBranchValidatorService {
  /** Перевірка, чи існує філія з вказаним ID */
  isBranchValid(branches: WizardBranch[], branchId: string): boolean;
  
  /** Знаходження філії за ID */
  findBranchById(branches: WizardBranch[], branchId: string): WizardBranch | undefined;
  
  /** Знаходження філії за кодом */
  findBranchByCode(branches: WizardBranch[], code: string): WizardBranch | undefined;
  
  /** Фільтрація філій за активністю */
  filterByActive(branches: WizardBranch[], active: boolean): WizardBranch[];
  
  /** Валідація даних філії */
  validateBranchData(branchData: WizardBranchCreateData | WizardBranchUpdateData): BranchValidationResult;
}

/**
 * Тип для сервісу вибору філій
 */
export interface IBranchSelectionService {
  /** Форматування назви філії */
  formatBranchName(branch: WizardBranch): string;
  
  /** Вибір філії за ідентифікатором */
  selectBranch(branchId: string): Promise<BranchOperationResult<WizardBranch>>;
}

/**
 * Тип для сервісу операцій з філіями
 */
export interface IBranchOperationsService {
  /** Створення нової філії */
  createBranch(branchData: WizardBranchCreateData): Promise<BranchOperationResult<WizardBranch>>;
  
  /** Оновлення існуючої філії */
  updateBranch(branchId: string, branchData: WizardBranchUpdateData): Promise<BranchOperationResult<WizardBranch>>;
  
  /** Видалення філії */
  deleteBranch(branchId: string): Promise<BranchOperationResult<void>>;
  
  /** Активація філії */
  activateBranch(branchId: string): Promise<BranchOperationResult<WizardBranch>>;
  
  /** Деактивація філії */
  deactivateBranch(branchId: string): Promise<BranchOperationResult<WizardBranch>>;
}
