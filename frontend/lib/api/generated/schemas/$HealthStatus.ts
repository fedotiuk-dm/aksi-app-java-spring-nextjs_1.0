/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $HealthStatus = {
    properties: {
        status: {
            type: 'string',
        },
        version: {
            type: 'string',
        },
        allStagesReady: {
            type: 'boolean',
        },
        totalStages: {
            type: 'number',
            format: 'int32',
        },
        totalSubsteps: {
            type: 'number',
            format: 'int32',
        },
        totalAdapters: {
            type: 'number',
            format: 'int32',
        },
        architecture: {
            type: 'string',
        },
    },
} as const;
