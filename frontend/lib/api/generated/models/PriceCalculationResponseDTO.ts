/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CalculationDetailsDTO } from './CalculationDetailsDTO';
export type PriceCalculationResponseDTO = {
    baseUnitPrice?: number;
    quantity?: number;
    baseTotalPrice?: number;
    unitOfMeasure?: string;
    finalUnitPrice?: number;
    finalTotalPrice?: number;
    calculationDetails?: Array<CalculationDetailsDTO>;
};

