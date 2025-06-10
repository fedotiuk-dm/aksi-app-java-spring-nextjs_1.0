/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $StagesStatus = {
    properties: {
        stages: {
            type: 'dictionary',
            contains: {
                type: 'StageStatusInfo',
            },
        },
        overall: {
            type: 'string',
        },
        totalReadyStages: {
            type: 'number',
            format: 'int32',
        },
        totalStages: {
            type: 'number',
            format: 'int32',
        },
        totalAdapters: {
            type: 'number',
            format: 'int32',
        },
    },
} as const;
