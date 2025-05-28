/**
 * @fileoverview Stage-3 Order Parameters hooks export
 * @module domain/wizard/hooks/stage-3
 */

// Individual hooks
export { useExecutionParams } from './use-execution-params.hook';
export { useGlobalDiscounts } from './use-global-discounts.hook';
export { usePaymentProcessing } from './use-payment-processing.hook';

// Composition hook
export { useOrderParamsComposition } from './use-order-params-composition.hook';
