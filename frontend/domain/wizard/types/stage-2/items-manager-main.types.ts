/**
 * Етап 2.0: Стан головного екрану менеджера предметів
 */

import type { OrderItemListItem } from '../shared/orval-types';
import type { WizardStepState } from '../wizard-step-state.types';

/**
 * Етап 2.0: Стан головного екрану менеджера предметів
 */
export interface ItemsManagerMainState extends WizardStepState {
  itemsList: OrderItemListItem[];
  totalAmount: number;
  itemsCount: number;
  hasMinimumItems: boolean;
  isItemWizardActive: boolean;
  editingItemId: string | null;
  unsavedChanges: boolean;
  lastCalculation?: string;
}
