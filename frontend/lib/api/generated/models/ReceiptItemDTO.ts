/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ReceiptPriceModifierDTO } from './ReceiptPriceModifierDTO';
export type ReceiptItemDTO = {
    basePrice?: number;
    color?: string;
    defects?: Array<string>;
    filler?: string;
    finalPrice?: number;
    id?: string;
    material?: string;
    name?: string;
    notes?: string;
    orderNumber?: number;
    priceModifiers?: Array<ReceiptPriceModifierDTO>;
    quantity?: number;
    serviceCategory?: string;
    stains?: Array<string>;
    unitOfMeasure?: string;
    wearPercentage?: number;
};

