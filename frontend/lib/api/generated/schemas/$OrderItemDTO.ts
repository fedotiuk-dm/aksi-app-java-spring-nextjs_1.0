/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $OrderItemDTO = {
    properties: {
        category: {
            type: 'string',
        },
        color: {
            type: 'string',
        },
        defects: {
            type: 'string',
        },
        description: {
            type: 'string',
            maxLength: 1000,
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
            maxLength: 255,
        },
        quantity: {
            type: 'number',
            isRequired: true,
            format: 'int32',
            minimum: 1,
        },
        specialInstructions: {
            type: 'string',
            maxLength: 500,
        },
        totalPrice: {
            type: 'number',
        },
        unitPrice: {
            type: 'number',
            isRequired: true,
        },
    },
} as const;
