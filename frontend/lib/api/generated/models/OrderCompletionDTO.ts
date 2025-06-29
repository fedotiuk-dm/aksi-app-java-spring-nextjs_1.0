/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OrderFinalizationRequest } from './OrderFinalizationRequest';
export type OrderCompletionDTO = {
    sessionId?: string;
    currentState?: OrderCompletionDTO.currentState;
    finalizationRequest?: OrderFinalizationRequest;
    orderProcessed?: boolean;
    orderSaved?: boolean;
    wizardCompleted?: boolean;
    completionTimestamp?: string;
    createdOrderNumber?: string;
    completionMessage?: string;
    hasValidationErrors?: boolean;
};
export namespace OrderCompletionDTO {
    export enum currentState {
        STAGE4_INITIALIZED = 'STAGE4_INITIALIZED',
        ORDER_SUMMARY_REVIEW = 'ORDER_SUMMARY_REVIEW',
        LEGAL_ACCEPTANCE = 'LEGAL_ACCEPTANCE',
        LEGAL_ACCEPTANCE_COMPLETED = 'LEGAL_ACCEPTANCE_COMPLETED',
        RECEIPT_GENERATION = 'RECEIPT_GENERATION',
        RECEIPT_GENERATED = 'RECEIPT_GENERATED',
        ORDER_COMPLETION = 'ORDER_COMPLETION',
        STAGE4_COMPLETED = 'STAGE4_COMPLETED',
        STAGE4_ERROR = 'STAGE4_ERROR',
    }
}

