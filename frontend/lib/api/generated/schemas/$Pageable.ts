/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $Pageable = {
    properties: {
        page: {
            type: 'number',
            format: 'int32',
        },
        size: {
            type: 'number',
            format: 'int32',
            minimum: 1,
        },
        sort: {
            type: 'array',
            contains: {
                type: 'string',
            },
        },
    },
} as const;
