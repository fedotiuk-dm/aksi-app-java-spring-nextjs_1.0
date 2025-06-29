/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $SystemStats = {
    properties: {
        allAdaptersReady: {
            type: 'boolean',
        },
        readyAdaptersCount: {
            type: 'number',
            format: 'int32',
        },
        totalAdapters: {
            type: 'number',
            format: 'int32',
        },
        readinessPercentage: {
            type: 'number',
            format: 'double',
        },
        status: {
            type: 'string',
        },
        timestamp: {
            type: 'string',
        },
    },
} as const;
