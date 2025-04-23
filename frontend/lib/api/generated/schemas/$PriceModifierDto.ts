/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $PriceModifierDto = {
    properties: {
        applicableCategories: {
            type: 'array',
            contains: {
                type: 'string',
                format: 'uuid',
            },
        },
        applicationOrder: {
            type: 'number',
            format: 'int32',
        },
        description: {
            type: 'string',
        },
        id: {
            type: 'string',
        },
        modifierCategory: {
            type: 'string',
        },
        name: {
            type: 'string',
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
