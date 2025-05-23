/**
 * Типи форм для домену Branch
 * Адаптовані з API request типів для роботи з формами
 */

import type { Branch, BranchSearchParams, BranchSearchResult } from './branch.types';

/**
 * Дані форми для створення нового приймального пункту
 * На основі BranchLocationCreateRequest
 */
export interface CreateBranchFormData {
  name: string;
  address: string;
  phone?: string;
  code: string;
  active: boolean;
}

/**
 * Дані форми для оновлення приймального пункту
 * На основі BranchLocationUpdateRequest + ID
 */
export interface UpdateBranchFormData extends CreateBranchFormData {
  id: string;
}

/**
 * Результат створення приймального пункту
 */
export interface CreateBranchResult {
  branch: Branch | null;
  errors: BranchFormErrors | null;
}

/**
 * Результат оновлення приймального пункту
 */
export interface UpdateBranchResult {
  branch: Branch | null;
  errors: BranchFormErrors | null;
}

/**
 * Помилки валідації форм приймального пункту
 */
export interface BranchFormErrors {
  general?: string;
  name?: string;
  address?: string;
  phone?: string;
  code?: string;
  active?: string;
}

// Реекспорт з основних типів для зручності
export type { Branch, BranchSearchParams, BranchSearchResult };
