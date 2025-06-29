/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $OrderCompletionDTO = {
    properties: {
        sessionId: {
            type: 'string',
            format: 'uuid',
        },
        currentState: {
            type: 'Enum',
        },
        finalizationRequest: {
            type: 'OrderFinalizationRequest',
        },
        orderProcessed: {
            type: 'boolean',
        },
        orderSaved: {
            type: 'boolean',
        },
        wizardCompleted: {
            type: 'boolean',
        },
        completionTimestamp: {
            type: 'string',
            format: 'date-time',
        },
        createdOrderNumber: {
            type: 'string',
        },
        completionMessage: {
            type: 'string',
        },
        hasValidationErrors: {
            type: 'boolean',
        },
    },
} as const;
