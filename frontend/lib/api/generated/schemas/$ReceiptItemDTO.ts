/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ReceiptItemDTO = {
    properties: {
        basePrice: {
            type: 'number',
        },
        color: {
            type: 'string',
        },
        defects: {
            type: 'array',
            contains: {
                type: 'string',
            },
        },
        filler: {
            type: 'string',
        },
        finalPrice: {
            type: 'number',
        },
        id: {
            type: 'string',
            format: 'uuid',
        },
        material: {
            type: 'string',
        },
        name: {
            type: 'string',
        },
        notes: {
            type: 'string',
        },
        orderNumber: {
            type: 'number',
            format: 'int32',
        },
        priceModifiers: {
            type: 'array',
            contains: {
                type: 'ReceiptPriceModifierDTO',
            },
        },
        quantity: {
            type: 'number',
        },
        serviceCategory: {
            type: 'string',
        },
        stains: {
            type: 'array',
            contains: {
                type: 'string',
            },
        },
        unitOfMeasure: {
            type: 'string',
        },
        wearPercentage: {
            type: 'number',
            format: 'int32',
        },
    },
} as const;
