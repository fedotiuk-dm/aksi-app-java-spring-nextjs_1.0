/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $OrderItemPriceCalculationDto = {
    properties: {
        appliedModifiers: {
            type: 'array',
            contains: {
                type: 'PriceModifierDetailDto',
            },
        },
        basePrice: {
            type: 'number',
        },
        basePriceWithQuantity: {
            type: 'number',
        },
        childSizeDiscountApplied: {
            type: 'boolean',
        },
        finalPrice: {
            type: 'number',
        },
        heavilySoiledApplied: {
            type: 'boolean',
        },
        heavilySoiledPercentage: {
            type: 'number',
            format: 'int32',
        },
        manualCleaningApplied: {
            type: 'boolean',
        },
        quantity: {
            type: 'number',
        },
    },
} as const;
