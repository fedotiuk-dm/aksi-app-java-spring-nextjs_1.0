/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $PageableObject = {
    properties: {
        offset: {
            type: 'number',
            format: 'int64',
        },
        pageNumber: {
            type: 'number',
            format: 'int32',
        },
        pageSize: {
            type: 'number',
            format: 'int32',
        },
        paged: {
            type: 'boolean',
        },
        sort: {
            type: 'SortObject',
        },
        unpaged: {
            type: 'boolean',
        },
    },
} as const;
