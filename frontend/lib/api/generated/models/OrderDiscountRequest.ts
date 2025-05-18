/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type OrderDiscountRequest = {
    discountDescription?: string;
    discountPercentage?: number;
    discountType: OrderDiscountRequest.discountType;
    orderId: string;
};
export namespace OrderDiscountRequest {
    export enum discountType {
        NO_DISCOUNT = 'NO_DISCOUNT',
        EVERCARD = 'EVERCARD',
        SOCIAL_MEDIA = 'SOCIAL_MEDIA',
        MILITARY = 'MILITARY',
        CUSTOM = 'CUSTOM',
    }
}

