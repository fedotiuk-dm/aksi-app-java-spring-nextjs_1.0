/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ClientSearchResultDTO = {
    properties: {
        clients: {
            type: 'array',
            contains: {
                type: 'ClientResponse',
            },
        },
        searchCriteria: {
            type: 'ClientSearchCriteriaDTO',
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
        searchTimeMs: {
            type: 'number',
            format: 'int64',
        },
        exactSearch: {
            type: 'boolean',
        },
        firstClient: {
            type: 'ClientResponse',
        },
    },
} as const;
