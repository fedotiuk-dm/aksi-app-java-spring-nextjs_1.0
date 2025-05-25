/**
 * @fileoverview Експорт адаптерів філій
 * @module domain/wizard/adapters/branch-adapters
 */

export { BranchMappingAdapter } from './mapping.adapter';
export { BranchApiOperationsAdapter } from './api-operations.adapter';

// Композиційний адаптер для зворотної сумісності
export { BranchAdapter } from './branch.adapter';

// Експорт типів
export type { BranchCreateRequest, BranchUpdateRequest } from './mapping.adapter';
export type { Branch } from '../../types/wizard-step-states.types';

// Імпорт типів для групування
import type { BranchCreateRequest, BranchUpdateRequest } from './mapping.adapter';
import type { Branch } from '../../types/wizard-step-states.types';

// Групування типів для зручності
export type BranchDomainTypes = {
  Branch: Branch;
  BranchCreateRequest: BranchCreateRequest;
  BranchUpdateRequest: BranchUpdateRequest;
};

// Експорт для зворотної сумісності
export type { Branch as WizardBranch } from '../../types/wizard-step-states.types';
export type { BranchCreateRequest as WizardBranchCreateRequest } from './mapping.adapter';
export type { BranchUpdateRequest as WizardBranchUpdateRequest } from './mapping.adapter';
