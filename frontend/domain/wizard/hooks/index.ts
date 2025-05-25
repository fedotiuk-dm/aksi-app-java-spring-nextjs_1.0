/**
 * @fileoverview Публічне API для wizard хуків
 * @module domain/wizard/hooks
 */

// === STEP 3 COMPLETED: Client Selection Hooks ===
export { useClientSearch, useClientForm, useClientSelection } from './steps/client-selection';

// === Shared Hooks ===
export { useWizardNavigation, useWizardState, useWizardForm } from './shared';

// === TODO: STEP 4 - Branch Selection Hooks ===
// export { useBranchSelection } from './steps/branch-selection/use-branch-selection.hook';
// export { useOrderInitiation } from './steps/branch-selection/use-order-initiation.hook';

// === TODO: STEP 5 - Item Management Hooks ===
// export { useItemWizard } from './steps/item-management/use-item-wizard.hook';
// export { useItemForm } from './steps/item-management/use-item-form.hook';
// export { useItemProperties } from './steps/item-management/use-item-properties.hook';
// export { useItemDefects } from './steps/item-management/use-item-defects.hook';
// export { useItemPricing } from './steps/item-management/use-item-pricing.hook';
// export { useItemPhotos } from './steps/item-management/use-item-photos.hook';

// === TODO: STEP 6 - Order Parameters Hooks ===
// export { useOrderParameters } from './steps/order-parameters/use-order-parameters.hook';
// export { useOrderSummary } from './steps/order-parameters/use-order-summary.hook';

// === TODO: STEP 7 - Order Completion Hooks ===
// export { useOrderCompletion } from './steps/order-completion/use-order-completion.hook';
// export { useOrderConfirmation } from './steps/order-completion/use-order-confirmation.hook';
