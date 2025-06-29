/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type OrderDiscountResponse = {
    orderId?: string;
    discountType?: OrderDiscountResponse.discountType;
    discountPercentage?: number;
    discountDescription?: string;
    totalAmount?: number;
    discountAmount?: number;
    finalAmount?: number;
    nonDiscountableCategories?: Array<string>;
    nonDiscountableAmount?: number;
};
export namespace OrderDiscountResponse {
    export enum discountType {
        NO_DISCOUNT = 'NO_DISCOUNT',
        EVERCARD = 'EVERCARD',
        SOCIAL_MEDIA = 'SOCIAL_MEDIA',
        MILITARY = 'MILITARY',
        CUSTOM = 'CUSTOM',
    }
}

