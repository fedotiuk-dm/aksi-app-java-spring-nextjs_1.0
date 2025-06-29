/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PriceListItemDTO } from './PriceListItemDTO';
export type ServiceCategoryDTO = {
    id?: string;
    code?: string;
    name?: string;
    description?: string;
    sortOrder?: number;
    active?: boolean;
    standardProcessingDays?: number;
    items?: Array<PriceListItemDTO>;
};

