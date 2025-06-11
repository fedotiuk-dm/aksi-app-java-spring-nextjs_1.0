/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CustomerSignatureRequest } from './CustomerSignatureRequest';
export type LegalAcceptanceDTO = {
    sessionId?: string;
    currentState?: LegalAcceptanceDTO.currentState;
    signatureRequest?: CustomerSignatureRequest;
    termsRead?: boolean;
    signatureCaptured?: boolean;
    legalConfirmed?: boolean;
    acceptanceTimestamp?: string;
    validationMessage?: string;
    hasValidationErrors?: boolean;
};
export namespace LegalAcceptanceDTO {
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

