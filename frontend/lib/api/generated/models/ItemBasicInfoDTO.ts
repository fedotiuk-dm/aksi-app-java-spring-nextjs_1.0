/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PriceListItemDTO } from './PriceListItemDTO';
import type { ServiceCategoryDTO } from './ServiceCategoryDTO';
export type ItemBasicInfoDTO = {
    itemId?: string;
    serviceCategory?: ServiceCategoryDTO;
    priceListItem?: PriceListItemDTO;
    unitOfMeasure?: string;
    quantity?: number;
    totalBasePrice?: number;
    valid?: boolean;
    complete?: boolean;
};

