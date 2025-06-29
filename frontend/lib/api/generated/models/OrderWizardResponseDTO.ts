/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type OrderWizardResponseDTO = {
    sessionId?: string;
    currentState?: OrderWizardResponseDTO.currentState;
    timestamp?: string;
    success?: boolean;
    message?: string;
};
export namespace OrderWizardResponseDTO {
    export enum currentState {
        INITIAL = 'INITIAL',
        CLIENT_SELECTION = 'CLIENT_SELECTION',
        ORDER_INITIALIZATION = 'ORDER_INITIALIZATION',
        ITEM_MANAGEMENT = 'ITEM_MANAGEMENT',
        ITEM_WIZARD_ACTIVE = 'ITEM_WIZARD_ACTIVE',
        EXECUTION_PARAMS = 'EXECUTION_PARAMS',
        GLOBAL_DISCOUNTS = 'GLOBAL_DISCOUNTS',
        PAYMENT_PROCESSING = 'PAYMENT_PROCESSING',
        ADDITIONAL_INFO = 'ADDITIONAL_INFO',
        ORDER_CONFIRMATION = 'ORDER_CONFIRMATION',
        ORDER_REVIEW = 'ORDER_REVIEW',
        LEGAL_ASPECTS = 'LEGAL_ASPECTS',
        RECEIPT_GENERATION = 'RECEIPT_GENERATION',
        COMPLETED = 'COMPLETED',
        CANCELLED = 'CANCELLED',
    }
}

