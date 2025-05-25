/**
 * @fileoverview Експорт адаптерів філій
 * @module domain/wizard/adapters/branch-adapters
 */

export { BranchMappingAdapter } from './mapping.adapter';
export { BranchApiOperationsAdapter } from './api-operations.adapter';

// Композиційний адаптер для зворотної сумісності
export { BranchAdapter } from './branch.adapter';

// Експорт власних типів адаптера
export type { BranchCreateRequest, BranchUpdateRequest } from './mapping.adapter';

// Групування типів адаптера (БЕЗ реекспорту доменних типів)
import type { BranchCreateRequest, BranchUpdateRequest } from './mapping.adapter';
import type { Branch } from '../../types/wizard-step-states.types';

export type BranchDomainTypes = {
  Branch: Branch;
  BranchCreateRequest: BranchCreateRequest;
  BranchUpdateRequest: BranchUpdateRequest;
};

// Експорт для зворотної сумісності (тільки аліаси)
export type { Branch as WizardBranch } from '../../types/wizard-step-states.types';
export type { BranchCreateRequest as WizardBranchCreateRequest } from './mapping.adapter';
export type { BranchUpdateRequest as WizardBranchUpdateRequest } from './mapping.adapter';
