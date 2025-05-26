/**
 * @fileoverview Типи доступності філій
 * @module domain/wizard/services/branch/types/branch-availability
 */

import type { DayScheduleDomain } from './branch-core.types';

/**
 * Доступність філії
 */
export interface BranchAvailabilityDomain {
  branchId: string;
  isOpen: boolean;
  currentStatus: 'OPEN' | 'CLOSED' | 'BREAK';
  nextStatusChange?: {
    status: 'OPEN' | 'CLOSED' | 'BREAK';
    time: string; // HH:mm
  };
  todaySchedule: DayScheduleDomain;
}
