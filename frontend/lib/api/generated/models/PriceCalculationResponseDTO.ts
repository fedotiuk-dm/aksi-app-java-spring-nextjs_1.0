/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CalculationDetailsDTO } from './CalculationDetailsDTO';
export type PriceCalculationResponseDTO = {
    baseTotalPrice?: number;
    baseUnitPrice?: number;
    calculationDetails?: Array<CalculationDetailsDTO>;
    finalTotalPrice?: number;
    finalUnitPrice?: number;
    quantity?: number;
    unitOfMeasure?: string;
};

