/**
 * @fileoverview Експорт всіх функцій для роботи з філіями
 * @module domain/wizard/adapters/branch
 */

// Експорт мапперів
export {
  mapBranchDTOToDomain,
  mapBranchToCreateRequest,
  mapBranchToUpdateRequest,
  mapBranchToDTO, // Legacy
  mapBranchArrayToDomain,
} from './branch.mapper';

// Експорт API функцій
export {
  getAllBranches,
  getBranchById,
  getBranchByCode,
  createBranch,
  updateBranch,
  deleteBranch,
  getActiveBranches,
  setBranchActiveStatus,
} from './branch.api';
