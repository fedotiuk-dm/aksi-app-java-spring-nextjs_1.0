/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ClientSearchRequest = {
    properties: {
        loyaltyLevel: {
            type: 'Enum',
        },
        page: {
            type: 'number',
            format: 'int32',
        },
        search: {
            type: 'string',
        },
        size: {
            type: 'number',
            format: 'int32',
        },
        sortBy: {
            type: 'string',
        },
        sortDirection: {
            type: 'string',
        },
        source: {
            type: 'Enum',
        },
        status: {
            type: 'Enum',
        },
        tags: {
            type: 'array',
            contains: {
                type: 'string',
            },
        },
    },
} as const;
