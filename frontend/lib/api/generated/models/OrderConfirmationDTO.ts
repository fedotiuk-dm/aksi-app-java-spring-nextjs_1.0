/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OrderDetailedSummaryResponse } from './OrderDetailedSummaryResponse';
export type OrderConfirmationDTO = {
    sessionId?: string;
    currentState?: OrderConfirmationDTO.currentState;
    orderSummary?: OrderDetailedSummaryResponse;
    readyForConfirmation?: boolean;
    summaryReviewed?: boolean;
    validationMessage?: string;
    hasValidationErrors?: boolean;
};
export namespace OrderConfirmationDTO {
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

