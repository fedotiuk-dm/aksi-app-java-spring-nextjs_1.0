/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CalculationDetailsDTO } from './CalculationDetailsDTO';
import type { FixedModifierQuantityDTO } from './FixedModifierQuantityDTO';
import type { PriceCalculationRequestDTO } from './PriceCalculationRequestDTO';
import type { PriceCalculationResponseDTO } from './PriceCalculationResponseDTO';
import type { RangeModifierValueDTO } from './RangeModifierValueDTO';
export type PriceDiscountDTO = {
    calculationRequest?: PriceCalculationRequestDTO;
    calculationResponse?: PriceCalculationResponseDTO;
    selectedModifierIds?: Array<string>;
    rangeModifierValues?: Array<RangeModifierValueDTO>;
    fixedModifierQuantities?: Array<FixedModifierQuantityDTO>;
    calculationNotes?: string;
    calculationCompleted?: boolean;
    hasCalculationErrors?: boolean;
    errorMessage?: string;
    basePrice?: number;
    finalPrice?: number;
    calculationDetails?: Array<CalculationDetailsDTO>;
    modifiersCount?: number;
};

