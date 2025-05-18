/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $CompletionDateCalculationRequest = {
    properties: {
        expediteType: {
            type: 'Enum',
            isRequired: true,
        },
        serviceCategoryIds: {
            type: 'array',
            contains: {
                type: 'string',
                format: 'uuid',
            },
        },
    },
} as const;
