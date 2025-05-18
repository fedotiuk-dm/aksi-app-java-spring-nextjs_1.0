/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type PaymentCalculationResponse = {
    balanceAmount?: number;
    discountAmount?: number;
    finalAmount?: number;
    orderId?: string;
    paymentMethod?: PaymentCalculationResponse.paymentMethod;
    prepaymentAmount?: number;
    totalAmount?: number;
};
export namespace PaymentCalculationResponse {
    export enum paymentMethod {
        TERMINAL = 'TERMINAL',
        CASH = 'CASH',
        BANK_TRANSFER = 'BANK_TRANSFER',
    }
}

