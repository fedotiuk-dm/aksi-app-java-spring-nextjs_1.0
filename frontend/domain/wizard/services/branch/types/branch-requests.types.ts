/**
 * @fileoverview Типи запитів для філій
 * @module domain/wizard/services/branch/types/branch-requests
 */

import type { WorkingHoursDomain, CoordinatesDomain } from './branch-core.types';

/**
 * Запит на створення філії
 */
export interface CreateBranchDomainRequest {
  name: string;
  code: string;
  address: string;
  phone: string;
  email?: string;
  workingHours: WorkingHoursDomain;
  isActive: boolean;
  isMainBranch: boolean;
  coordinates?: CoordinatesDomain;
  managerId?: string;
  serviceIds: string[];
}

/**
 * Запит на оновлення філії
 */
export interface UpdateBranchDomainRequest {
  name?: string;
  address?: string;
  phone?: string;
  email?: string;
  workingHours?: WorkingHoursDomain;
  isActive?: boolean;
  coordinates?: CoordinatesDomain;
  managerId?: string;
  serviceIds?: string[];
}
