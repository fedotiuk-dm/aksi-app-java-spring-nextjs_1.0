/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ReceiptDTO } from './ReceiptDTO';
import type { ReceiptGenerationRequest } from './ReceiptGenerationRequest';
export type ReceiptConfigurationDTO = {
    sessionId?: string;
    currentState?: ReceiptConfigurationDTO.currentState;
    generationRequest?: ReceiptGenerationRequest;
    generatedReceipt?: ReceiptDTO;
    pdfGenerated?: boolean;
    emailSent?: boolean;
    readyForPrint?: boolean;
    pdfFilePath?: string;
    generationTimestamp?: string;
    validationMessage?: string;
    hasValidationErrors?: boolean;
};
export namespace ReceiptConfigurationDTO {
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

