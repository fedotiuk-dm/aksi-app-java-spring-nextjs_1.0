/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $PriceCalculationResponseDTO = {
    properties: {
        baseTotalPrice: {
            type: 'number',
        },
        baseUnitPrice: {
            type: 'number',
        },
        calculationDetails: {
            type: 'array',
            contains: {
                type: 'CalculationDetailsDTO',
            },
        },
        finalTotalPrice: {
            type: 'number',
        },
        finalUnitPrice: {
            type: 'number',
        },
        quantity: {
            type: 'number',
            format: 'int32',
        },
        unitOfMeasure: {
            type: 'string',
        },
    },
} as const;
