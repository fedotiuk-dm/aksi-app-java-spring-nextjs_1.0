/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FixedModifierQuantityDTO } from './FixedModifierQuantityDTO';
import type { RangeModifierValueDTO } from './RangeModifierValueDTO';
export type PriceCalculationRequestDTO = {
    categoryCode?: string;
    fixedModifierQuantities?: Array<FixedModifierQuantityDTO>;
    itemName?: string;
    modifierIds?: Array<string>;
    quantity: number;
    rangeModifierValues?: Array<RangeModifierValueDTO>;
};

