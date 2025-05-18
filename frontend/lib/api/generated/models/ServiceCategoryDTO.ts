/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PriceListItemDTO } from './PriceListItemDTO';
export type ServiceCategoryDTO = {
    active?: boolean;
    code?: string;
    description?: string;
    id?: string;
    items?: Array<PriceListItemDTO>;
    name?: string;
    sortOrder?: number;
    standardProcessingDays?: number;
};

