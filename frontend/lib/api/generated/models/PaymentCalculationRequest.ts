/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type PaymentCalculationRequest = {
    orderId: string;
    paymentMethod: PaymentCalculationRequest.paymentMethod;
    prepaymentAmount?: number;
};
export namespace PaymentCalculationRequest {
    export enum paymentMethod {
        TERMINAL = 'TERMINAL',
        CASH = 'CASH',
        BANK_TRANSFER = 'BANK_TRANSFER',
    }
}

