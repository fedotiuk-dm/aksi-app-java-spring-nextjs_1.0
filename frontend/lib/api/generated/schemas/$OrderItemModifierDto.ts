/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $OrderItemModifierDto = {
    properties: {
        applicationOrder: {
            type: 'number',
            format: 'int32',
        },
        description: {
            type: 'string',
        },
        id: {
            type: 'string',
            format: 'uuid',
        },
        name: {
            type: 'string',
        },
        orderItemId: {
            type: 'string',
            format: 'uuid',
        },
        priceImpact: {
            type: 'number',
        },
        replacesBasePrice: {
            type: 'boolean',
        },
        type: {
            type: 'string',
        },
        value: {
            type: 'number',
        },
    },
} as const;
