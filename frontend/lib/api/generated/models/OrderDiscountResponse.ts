/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type OrderDiscountResponse = {
    discountAmount?: number;
    discountDescription?: string;
    discountPercentage?: number;
    discountType?: OrderDiscountResponse.discountType;
    finalAmount?: number;
    nonDiscountableAmount?: number;
    nonDiscountableCategories?: Array<string>;
    orderId?: string;
    totalAmount?: number;
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

