/**
 * @fileoverview Типи пошуку філій
 * @module domain/wizard/services/branch/types/branch-search
 */

import type { BranchDomain } from './branch-core.types';

/**
 * Параметри пошуку філій
 */
export interface BranchSearchDomainParams {
  query?: string;
  isActive?: boolean;
  hasService?: string; // serviceId
  city?: string;
  page?: number;
  size?: number;
}

/**
 * Результат пошуку філій
 */
export interface BranchSearchDomainResult {
  branches: BranchDomain[];
  total: number;
  page: number;
  size: number;
  hasMore: boolean;
}
