/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ModifierCalculationDetail } from './ModifierCalculationDetail';
export type PriceCalculationResponseDTO = {
    baseTotalPrice?: number;
    baseUnitPrice?: number;
    calculationDetails?: Array<ModifierCalculationDetail>;
    finalTotalPrice?: number;
    finalUnitPrice?: number;
    quantity?: number;
};

