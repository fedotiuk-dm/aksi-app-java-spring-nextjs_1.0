/**
 * @fileoverview Маппер для перетворення BranchLocationDTO ↔ Branch
 * @module domain/wizard/adapters/branch
 */

import type { Branch } from '../../types';
import type {
  BranchLocationDTO,
  BranchLocationCreateRequest,
  BranchLocationUpdateRequest,
} from '@/lib/api';

/**
 * Перетворює BranchLocationDTO у доменний Branch
 */
export function mapBranchDTOToDomain(apiBranch: BranchLocationDTO): Branch {
  return {
    id: apiBranch.id || '',
    name: apiBranch.name || '',
    address: apiBranch.address || '',
    phone: apiBranch.phone || undefined,
    code: apiBranch.code || '',
    active: apiBranch.active ?? true,
    createdAt: apiBranch.createdAt || new Date().toISOString(),
    updatedAt: apiBranch.updatedAt || new Date().toISOString(),
  };
}

/**
 * Базова функція для перетворення доменного Branch у API запит
 */
function mapBranchToRequest(domainBranch: Partial<Branch>) {
  return {
    name: domainBranch.name || '',
    address: domainBranch.address || '',
    phone: domainBranch.phone,
    code: domainBranch.code || '',
    active: domainBranch.active ?? true,
  };
}

/**
 * Перетворює доменний Branch у BranchLocationCreateRequest
 */
export function mapBranchToCreateRequest(
  domainBranch: Partial<Branch>
): BranchLocationCreateRequest {
  return mapBranchToRequest(domainBranch);
}

/**
 * Перетворює доменний Branch у BranchLocationUpdateRequest
 */
export function mapBranchToUpdateRequest(
  domainBranch: Partial<Branch>
): BranchLocationUpdateRequest {
  return mapBranchToRequest(domainBranch);
}

/**
 * @deprecated Використовуйте mapBranchToCreateRequest або mapBranchToUpdateRequest
 */
export function mapBranchToDTO(domainBranch: Partial<Branch>): Partial<BranchLocationDTO> {
  return {
    id: domainBranch.id,
    name: domainBranch.name,
    address: domainBranch.address,
    phone: domainBranch.phone,
    code: domainBranch.code,
    active: domainBranch.active,
  };
}

/**
 * Перетворює масив API філій у доменні типи
 */
export function mapBranchArrayToDomain(apiBranches: BranchLocationDTO[]): Branch[] {
  return apiBranches.map(mapBranchDTOToDomain);
}
