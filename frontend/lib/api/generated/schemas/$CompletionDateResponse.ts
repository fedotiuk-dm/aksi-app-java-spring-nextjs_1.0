/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $CompletionDateResponse = {
    properties: {
        expectedCompletionDate: {
            type: 'string',
            format: 'date-time',
        },
        expeditedProcessingHours: {
            type: 'number',
            format: 'int32',
        },
        standardProcessingHours: {
            type: 'number',
            format: 'int32',
        },
    },
} as const;
