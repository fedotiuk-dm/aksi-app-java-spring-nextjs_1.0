/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $CompletionDateCalculationRequest = {
    properties: {
        serviceCategoryIds: {
            type: 'array',
            contains: {
                type: 'string',
                format: 'uuid',
            },
            isRequired: true,
        },
        expediteType: {
            type: 'Enum',
            isRequired: true,
        },
    },
} as const;
