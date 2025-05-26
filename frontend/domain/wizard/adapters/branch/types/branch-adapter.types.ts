/**
 * @fileoverview Локальні типи для branch адаптерів wizard домену
 * @module domain/wizard/adapters/branch/types
 *
 * Ці типи відповідають структурі даних з OpenAPI та результатам мапперів
 */

// ============= БАЗОВІ ТИПИ =============

export type WizardBranchId = string;
export type WizardBranchCode = string;

// ============= СУТНОСТІ ДЛЯ WIZARD =============

/**
 * Філія для wizard
 * Базується на BranchLocationDTO з OpenAPI
 */
export interface WizardBranch {
  readonly id: string;
  readonly name: string;
  readonly address: string;
  readonly phone?: string;
  readonly code: string;
  readonly active: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
}

/**
 * Дані для створення філії
 * Базується на BranchLocationCreateRequest з OpenAPI
 */
export interface WizardBranchCreateData {
  readonly name: string;
  readonly address: string;
  readonly phone?: string;
  readonly code: string;
  readonly active?: boolean;
}

/**
 * Дані для оновлення філії
 * Базується на BranchLocationUpdateRequest з OpenAPI
 */
export interface WizardBranchUpdateData {
  readonly name?: string;
  readonly address?: string;
  readonly phone?: string;
  readonly code?: string;
  readonly active?: boolean;
}

// ============= РЕЗУЛЬТАТИ ОПЕРАЦІЙ =============

/**
 * Результат операції з філією
 */
export interface WizardBranchOperationResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Результат валідації філії
 */
export interface WizardBranchValidationResult {
  readonly isValid: boolean;
  readonly errors: string[];
  readonly warnings: string[];
  readonly fieldErrors: Record<string, string[]>;
}

// ============= ПАРАМЕТРИ ПОШУКУ =============

/**
 * Фільтри для пошуку філій
 */
export interface WizardBranchFilters {
  readonly searchTerm?: string;
  readonly active?: boolean;
  readonly code?: string;
  readonly city?: string;
}

/**
 * Параметри сортування філій
 */
export interface WizardBranchSortOptions {
  readonly field: 'name' | 'code' | 'address' | 'createdAt';
  readonly direction: 'asc' | 'desc';
}

/**
 * Результат пошуку філій
 */
export interface WizardBranchSearchResult {
  readonly branches: WizardBranch[];
  readonly total: number;
  readonly hasMore: boolean;
}

// ============= КОНФІГУРАЦІЯ =============

/**
 * Конфігурація для branch адаптера
 */
export interface WizardBranchAdapterConfig {
  readonly enableCaching: boolean;
  readonly cacheTimeout: number;
  readonly retryAttempts: number;
  readonly retryDelay: number;
}

/**
 * Стан завантаження для branch операцій
 */
export interface WizardBranchLoadingState {
  readonly loading: boolean;
  readonly creating: boolean;
  readonly updating: boolean;
  readonly deleting: boolean;
  readonly searching: boolean;
}
