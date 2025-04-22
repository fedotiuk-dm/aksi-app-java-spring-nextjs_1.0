/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $OrderItemModifierCreateRequest = {
    properties: {
        applicationOrder: {
            type: 'number',
            isRequired: true,
            format: 'int32',
        },
        description: {
            type: 'string',
        },
        name: {
            type: 'string',
            minLength: 1,
        },
        replacesBasePrice: {
            type: 'boolean',
        },
        type: {
            type: 'string',
            minLength: 1,
        },
        value: {
            type: 'number',
            isRequired: true,
        },
    },
} as const;
