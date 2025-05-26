/**
 * @fileoverview Типи відстаней філій
 * @module domain/wizard/services/branch/types/branch-distance
 */

/**
 * Відстань до філії
 */
export interface BranchDistanceDomain {
  branchId: string;
  distance: number; // в кілометрах
  estimatedTravelTime: number; // в хвилинах
}
