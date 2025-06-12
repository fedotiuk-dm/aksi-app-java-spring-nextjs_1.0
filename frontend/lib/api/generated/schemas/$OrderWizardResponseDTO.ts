/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $OrderWizardResponseDTO = {
    properties: {
        sessionId: {
            type: 'string',
        },
        currentState: {
            type: 'Enum',
        },
        timestamp: {
            type: 'string',
            format: 'date-time',
        },
        success: {
            type: 'boolean',
        },
        message: {
            type: 'string',
        },
    },
} as const;
