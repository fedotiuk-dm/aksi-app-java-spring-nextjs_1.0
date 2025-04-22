/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PriceModifierDetailDto } from './PriceModifierDetailDto';
export type OrderItemPriceCalculationDto = {
    appliedModifiers?: Array<PriceModifierDetailDto>;
    basePrice?: number;
    basePriceWithQuantity?: number;
    childSizeDiscountApplied?: boolean;
    finalPrice?: number;
    heavilySoiledApplied?: boolean;
    heavilySoiledPercentage?: number;
    manualCleaningApplied?: boolean;
    quantity?: number;
};

