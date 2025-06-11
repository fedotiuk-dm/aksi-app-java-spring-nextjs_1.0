/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $OrderConfirmationDTO = {
    properties: {
        sessionId: {
            type: 'string',
            format: 'uuid',
        },
        currentState: {
            type: 'Enum',
        },
        orderSummary: {
            type: 'OrderDetailedSummaryResponse',
        },
        readyForConfirmation: {
            type: 'boolean',
        },
        summaryReviewed: {
            type: 'boolean',
        },
        validationMessage: {
            type: 'string',
        },
        hasValidationErrors: {
            type: 'boolean',
        },
    },
} as const;
