/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $StageInfo = {
    properties: {
        stageNumber: {
            type: 'number',
            format: 'int32',
        },
        title: {
            type: 'string',
        },
        description: {
            type: 'string',
        },
        substeps: {
            type: 'array',
            contains: {
                type: 'string',
            },
        },
        adapterClass: {
            type: 'string',
        },
        isReady: {
            type: 'boolean',
        },
    },
} as const;
