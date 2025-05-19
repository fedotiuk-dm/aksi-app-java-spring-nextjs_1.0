/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ReceiptItemDTO = {
    properties: {
        id: {
            type: 'string',
            format: 'uuid',
        },
        orderNumber: {
            type: 'number',
            format: 'int32',
        },
        name: {
            type: 'string',
        },
        serviceCategory: {
            type: 'string',
        },
        quantity: {
            type: 'number',
        },
        unitOfMeasure: {
            type: 'string',
        },
        material: {
            type: 'string',
        },
        color: {
            type: 'string',
        },
        filler: {
            type: 'string',
        },
        wearPercentage: {
            type: 'number',
            format: 'int32',
        },
        basePrice: {
            type: 'number',
        },
        finalPrice: {
            type: 'number',
        },
        priceModifiers: {
            type: 'array',
            contains: {
                type: 'ReceiptPriceModifierDTO',
            },
        },
        stains: {
            type: 'array',
            contains: {
                type: 'string',
            },
        },
        defects: {
            type: 'array',
            contains: {
                type: 'string',
            },
        },
        notes: {
            type: 'string',
        },
    },
} as const;
