/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ReceiptPriceModifierDTO } from './ReceiptPriceModifierDTO';
export type ReceiptItemDTO = {
    id?: string;
    orderNumber?: number;
    name?: string;
    serviceCategory?: string;
    quantity?: number;
    unitOfMeasure?: string;
    material?: string;
    color?: string;
    filler?: string;
    wearPercentage?: number;
    basePrice?: number;
    finalPrice?: number;
    priceModifiers?: Array<ReceiptPriceModifierDTO>;
    stains?: Array<string>;
    defects?: Array<string>;
    notes?: string;
};

