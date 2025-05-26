/**
 * @fileoverview Маппер для перетворення BranchLocationDTO ↔ WizardBranch
 * @module domain/wizard/adapters/branch/mappers
 */

import type {
  WizardBranch,
  WizardBranchCreateData,
  WizardBranchUpdateData,
} from '../types/branch-adapter.types';
import type {
  BranchLocationDTO,
  BranchLocationCreateRequest,
  BranchLocationUpdateRequest,
} from '@/lib/api';

/**
 * Перетворює BranchLocationDTO у WizardBranch
 */
export function mapBranchDTOToDomain(apiBranch: BranchLocationDTO): WizardBranch {
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
 * Перетворює WizardBranchCreateData у BranchLocationCreateRequest
 */
export function mapBranchToCreateRequest(
  domainBranch: WizardBranchCreateData
): BranchLocationCreateRequest {
  return {
    name: domainBranch.name,
    address: domainBranch.address,
    phone: domainBranch.phone,
    code: domainBranch.code,
    active: domainBranch.active ?? true,
  };
}

/**
 * Перетворює WizardBranchUpdateData у BranchLocationUpdateRequest
 */
export function mapBranchToUpdateRequest(
  domainBranch: WizardBranchUpdateData
): BranchLocationUpdateRequest {
  const request: Partial<BranchLocationUpdateRequest> = {};

  if (domainBranch.name !== undefined) request.name = domainBranch.name;
  if (domainBranch.address !== undefined) request.address = domainBranch.address;
  if (domainBranch.phone !== undefined) request.phone = domainBranch.phone;
  if (domainBranch.code !== undefined) request.code = domainBranch.code;
  if (domainBranch.active !== undefined) request.active = domainBranch.active;

  return request as BranchLocationUpdateRequest;
}

/**
 * Перетворює масив API філій у WizardBranch[]
 */
export function mapBranchArrayToDomain(apiBranches: BranchLocationDTO[]): WizardBranch[] {
  return apiBranches.map(mapBranchDTOToDomain);
}

/**
 * Перетворює WizardBranch у часткові дані для створення
 */
export function mapWizardBranchToCreateData(branch: Partial<WizardBranch>): WizardBranchCreateData {
  if (!branch.name || !branch.address || !branch.code) {
    throw new Error("Обов'язкові поля для створення філії: name, address, code");
  }

  return {
    name: branch.name,
    address: branch.address,
    phone: branch.phone,
    code: branch.code,
    active: branch.active ?? true,
  };
}

/**
 * Перетворює WizardBranch у часткові дані для оновлення
 */
export function mapWizardBranchToUpdateData(branch: Partial<WizardBranch>): WizardBranchUpdateData {
  return {
    name: branch.name,
    address: branch.address,
    phone: branch.phone,
    code: branch.code,
    active: branch.active,
  };
}
