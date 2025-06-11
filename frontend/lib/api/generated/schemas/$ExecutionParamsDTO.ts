/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ExecutionParamsDTO = {
    properties: {
        sessionId: {
            type: 'string',
            format: 'uuid',
        },
        serviceCategoryIds: {
            type: 'array',
            contains: {
                type: 'string',
                format: 'uuid',
            },
        },
        completionDateRequest: {
            type: 'CompletionDateCalculationRequest',
        },
        completionDateResponse: {
            type: 'CompletionDateResponse',
        },
        manualExecutionDate: {
            type: 'string',
            format: 'date',
        },
        useManualDate: {
            type: 'boolean',
        },
        needsRecalculation: {
            type: 'boolean',
        },
        lastUpdated: {
            type: 'string',
            format: 'date-time',
        },
        expediteType: {
            type: 'Enum',
        },
        readyForCompletion: {
            type: 'boolean',
        },
        executionParamsComplete: {
            type: 'boolean',
        },
        effectiveExecutionDate: {
            type: 'string',
            format: 'date-time',
        },
    },
} as const;
