/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $PriceCalculationResponseDTO = {
    properties: {
        baseUnitPrice: {
            type: 'number',
        },
        quantity: {
            type: 'number',
            format: 'int32',
        },
        baseTotalPrice: {
            type: 'number',
        },
        unitOfMeasure: {
            type: 'string',
        },
        finalUnitPrice: {
            type: 'number',
        },
        finalTotalPrice: {
            type: 'number',
        },
        calculationDetails: {
            type: 'array',
            contains: {
                type: 'CalculationDetailsDTO',
            },
        },
    },
} as const;
