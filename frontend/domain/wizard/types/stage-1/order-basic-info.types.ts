/**
 * Етап 1.2: Стан кроку "Базова інформація замовлення"
 */

import type { BranchData, BranchListItem } from '../shared/orval-types';
import type { WizardStepState } from '../wizard-step-state.types';

/**
 * Етап 1.2: Стан кроку "Базова інформація замовлення"
 */
export interface OrderBasicInfoStepState extends WizardStepState {
  receiptNumber: string; // автогенерований
  tagNumber: string; // вводиться вручну або сканується
  selectedBranchId: string | null;
  selectedBranch: BranchData | null;
  branches: BranchListItem[];
  orderCreatedDate: string; // автоматично
  isLoadingBranches: boolean;
  orderInitiated: boolean;
}
