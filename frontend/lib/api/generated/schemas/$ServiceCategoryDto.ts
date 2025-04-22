/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ServiceCategoryDto = {
    properties: {
        active: {
            type: 'boolean',
        },
        code: {
            type: 'string',
        },
        description: {
            type: 'string',
        },
        id: {
            type: 'string',
            format: 'uuid',
        },
        items: {
            type: 'array',
            contains: {
                type: 'PriceListItemDto',
            },
        },
        name: {
            type: 'string',
        },
        sortOrder: {
            type: 'number',
            format: 'int32',
        },
    },
} as const;
