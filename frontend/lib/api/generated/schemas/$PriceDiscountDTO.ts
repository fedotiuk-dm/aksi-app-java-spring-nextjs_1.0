/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $PriceDiscountDTO = {
    properties: {
        calculationRequest: {
            type: 'PriceCalculationRequestDTO',
        },
        calculationResponse: {
            type: 'PriceCalculationResponseDTO',
        },
        selectedModifierIds: {
            type: 'array',
            contains: {
                type: 'string',
            },
        },
        rangeModifierValues: {
            type: 'array',
            contains: {
                type: 'RangeModifierValueDTO',
            },
        },
        fixedModifierQuantities: {
            type: 'array',
            contains: {
                type: 'FixedModifierQuantityDTO',
            },
        },
        calculationNotes: {
            type: 'string',
        },
        calculationCompleted: {
            type: 'boolean',
        },
        hasCalculationErrors: {
            type: 'boolean',
        },
        errorMessage: {
            type: 'string',
        },
        basePrice: {
            type: 'number',
        },
        finalPrice: {
            type: 'number',
        },
        calculationDetails: {
            type: 'array',
            contains: {
                type: 'CalculationDetailsDTO',
            },
        },
        modifiersCount: {
            type: 'number',
            format: 'int32',
        },
    },
} as const;
