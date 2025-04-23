/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $PageOrderDraftDto = {
    properties: {
        content: {
            type: 'array',
            contains: {
                type: 'OrderDraftDto',
            },
        },
        empty: {
            type: 'boolean',
        },
        first: {
            type: 'boolean',
        },
        last: {
            type: 'boolean',
        },
        number: {
            type: 'number',
            format: 'int32',
        },
        numberOfElements: {
            type: 'number',
            format: 'int32',
        },
        pageable: {
            type: 'PageableObject',
        },
        size: {
            type: 'number',
            format: 'int32',
        },
        sort: {
            type: 'SortObject',
        },
        totalElements: {
            type: 'number',
            format: 'int64',
        },
        totalPages: {
            type: 'number',
            format: 'int32',
        },
    },
} as const;
