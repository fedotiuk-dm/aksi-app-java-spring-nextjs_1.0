/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OrderDiscountRequest } from './OrderDiscountRequest';
import type { OrderDiscountResponse } from './OrderDiscountResponse';
export type DiscountConfigurationDTO = {
    sessionId?: string;
    orderId?: string;
    discountRequest?: OrderDiscountRequest;
    discountResponse?: OrderDiscountResponse;
    excludedCategoryIds?: Array<string>;
    originalAmount?: number;
    discountAmount?: number;
    finalAmount?: number;
    isValid?: boolean;
    validationMessage?: string;
    lastUpdated?: string;
    discountType?: DiscountConfigurationDTO.discountType;
    discountPercentage?: number;
    discountDescription?: string;
    readyForCompletion?: boolean;
    discountConfigComplete?: boolean;
};
export namespace DiscountConfigurationDTO {
    export enum discountType {
        NO_DISCOUNT = 'NO_DISCOUNT',
        EVERCARD = 'EVERCARD',
        SOCIAL_MEDIA = 'SOCIAL_MEDIA',
        MILITARY = 'MILITARY',
        CUSTOM = 'CUSTOM',
    }
}

