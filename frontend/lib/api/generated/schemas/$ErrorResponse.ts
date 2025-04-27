/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ErrorResponse = {
    properties: {
        errorId: {
            type: 'string',
        },
        errorType: {
            type: 'string',
        },
        errors: {
            type: 'dictionary',
            contains: {
                type: 'string',
            },
        },
        message: {
            type: 'string',
        },
        method: {
            type: 'string',
        },
        path: {
            type: 'string',
        },
        stackTrace: {
            type: 'array',
            contains: {
                type: 'string',
            },
        },
        status: {
            type: 'number',
            format: 'int32',
        },
        timestamp: {
            type: 'string',
            format: 'date-time',
        },
    },
} as const;
