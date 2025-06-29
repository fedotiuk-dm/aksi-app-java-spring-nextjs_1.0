/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ServiceCategoryDTO = {
    properties: {
        id: {
            type: 'string',
            format: 'uuid',
        },
        code: {
            type: 'string',
        },
        name: {
            type: 'string',
        },
        description: {
            type: 'string',
        },
        sortOrder: {
            type: 'number',
            format: 'int32',
        },
        active: {
            type: 'boolean',
        },
        standardProcessingDays: {
            type: 'number',
            format: 'int32',
        },
        items: {
            type: 'array',
            contains: {
                type: 'PriceListItemDTO',
            },
        },
    },
} as const;
