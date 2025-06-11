/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type PaymentCalculationResponse = {
    orderId?: string;
    paymentMethod?: PaymentCalculationResponse.paymentMethod;
    totalAmount?: number;
    discountAmount?: number;
    finalAmount?: number;
    prepaymentAmount?: number;
    balanceAmount?: number;
};
export namespace PaymentCalculationResponse {
    export enum paymentMethod {
        TERMINAL = 'TERMINAL',
        CASH = 'CASH',
        BANK_TRANSFER = 'BANK_TRANSFER',
    }
}

