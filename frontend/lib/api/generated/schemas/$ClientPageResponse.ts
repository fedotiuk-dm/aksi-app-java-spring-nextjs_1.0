/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ClientPageResponse = {
    properties: {
        content: {
            type: 'array',
            contains: {
                type: 'ClientResponse',
            },
        },
        totalElements: {
            type: 'number',
            format: 'int64',
        },
        totalPages: {
            type: 'number',
            format: 'int32',
        },
        pageNumber: {
            type: 'number',
            format: 'int32',
        },
        pageSize: {
            type: 'number',
            format: 'int32',
        },
        hasPrevious: {
            type: 'boolean',
        },
        hasNext: {
            type: 'boolean',
        },
    },
} as const;
