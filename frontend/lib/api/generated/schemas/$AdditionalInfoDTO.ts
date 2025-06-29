/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $AdditionalInfoDTO = {
    properties: {
        sessionId: {
            type: 'string',
            format: 'uuid',
        },
        orderId: {
            type: 'string',
            format: 'uuid',
        },
        additionalInfoRequest: {
            type: 'AdditionalRequirementsRequest',
        },
        additionalInfoResponse: {
            type: 'AdditionalRequirementsResponse',
        },
        hasAdditionalRequirements: {
            type: 'boolean',
        },
        hasCustomerNotes: {
            type: 'boolean',
        },
        isValid: {
            type: 'boolean',
        },
        validationMessage: {
            type: 'string',
        },
        lastUpdated: {
            type: 'string',
            format: 'date-time',
        },
        readyForCompletion: {
            type: 'boolean',
        },
        additionalRequirements: {
            type: 'string',
        },
        customerNotes: {
            type: 'string',
        },
        additionalInfoComplete: {
            type: 'boolean',
        },
    },
} as const;
