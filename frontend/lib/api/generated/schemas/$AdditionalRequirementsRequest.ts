/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $AdditionalRequirementsRequest = {
    properties: {
        additionalRequirements: {
            type: 'string',
            maxLength: 1000,
        },
        customerNotes: {
            type: 'string',
            maxLength: 1000,
        },
        orderId: {
            type: 'string',
            isRequired: true,
            format: 'uuid',
        },
    },
} as const;
