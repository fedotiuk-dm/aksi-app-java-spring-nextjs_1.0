/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type OrderCreateRequest = {
    amountPaid: number;
    clientId: string;
    clientRequirements?: string;
    customDiscountPercentage?: number;
    discountType: OrderCreateRequest.discountType;
    expectedCompletionDate: string;
    notes?: string;
    paymentMethod: OrderCreateRequest.paymentMethod;
    receiptNumber?: string;
    receptionPointId: string;
    uniqueTag?: string;
    urgencyType: OrderCreateRequest.urgencyType;
};
export namespace OrderCreateRequest {
    export enum discountType {
        NONE = 'NONE',
        EVERCARD = 'EVERCARD',
        SOCIAL_MEDIA = 'SOCIAL_MEDIA',
        MILITARY = 'MILITARY',
        CUSTOM = 'CUSTOM',
    }
    export enum paymentMethod {
        TERMINAL = 'TERMINAL',
        CASH = 'CASH',
        BANK_TRANSFER = 'BANK_TRANSFER',
    }
    export enum urgencyType {
        STANDARD = 'STANDARD',
        HOURS_48 = 'HOURS_48',
        HOURS_24 = 'HOURS_24',
    }
}

