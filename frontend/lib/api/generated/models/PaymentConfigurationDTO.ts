/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PaymentCalculationRequest } from './PaymentCalculationRequest';
import type { PaymentCalculationResponse } from './PaymentCalculationResponse';
export type PaymentConfigurationDTO = {
    sessionId?: string;
    orderId?: string;
    paymentRequest?: PaymentCalculationRequest;
    paymentResponse?: PaymentCalculationResponse;
    totalAmount?: number;
    paidAmount?: number;
    remainingAmount?: number;
    isValid?: boolean;
    validationMessage?: string;
    lastUpdated?: string;
    fullyPaid?: boolean;
    prepaymentAmount?: number;
    paymentMethod?: PaymentConfigurationDTO.paymentMethod;
    readyForCompletion?: boolean;
    paymentConfigComplete?: boolean;
};
export namespace PaymentConfigurationDTO {
    export enum paymentMethod {
        TERMINAL = 'TERMINAL',
        CASH = 'CASH',
        BANK_TRANSFER = 'BANK_TRANSFER',
    }
}

