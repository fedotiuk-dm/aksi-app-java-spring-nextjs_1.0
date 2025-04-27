/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $PriceCalculationRequestDTO = {
    properties: {
        categoryCode: {
            type: 'string',
            minLength: 1,
        },
        fixedModifierQuantities: {
            type: 'array',
            contains: {
                type: 'FixedModifierQuantityDTO',
            },
        },
        itemName: {
            type: 'string',
            minLength: 1,
        },
        modifierIds: {
            type: 'array',
            contains: {
                type: 'string',
            },
        },
        quantity: {
            type: 'number',
            isRequired: true,
            format: 'int32',
        },
        rangeModifierValues: {
            type: 'array',
            contains: {
                type: 'RangeModifierValueDTO',
            },
        },
    },
} as const;
