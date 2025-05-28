/**
 * @fileoverview Stage-4 Confirmation hooks export
 * @module domain/wizard/hooks/stage-4
 */

// Individual hooks
export { useOrderValidation } from './use-order-validation.hook';
export { useReceiptGeneration } from './use-receipt-generation.hook';
export { useOrderCompletion } from './use-order-completion.hook';

// Composition hook
export { useStage4Composition } from './use-stage-4-composition.hook';
