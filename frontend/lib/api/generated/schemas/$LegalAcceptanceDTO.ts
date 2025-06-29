/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $LegalAcceptanceDTO = {
    properties: {
        sessionId: {
            type: 'string',
            format: 'uuid',
        },
        currentState: {
            type: 'Enum',
        },
        signatureRequest: {
            type: 'CustomerSignatureRequest',
        },
        termsRead: {
            type: 'boolean',
        },
        signatureCaptured: {
            type: 'boolean',
        },
        legalConfirmed: {
            type: 'boolean',
        },
        acceptanceTimestamp: {
            type: 'string',
            format: 'date-time',
        },
        validationMessage: {
            type: 'string',
        },
        hasValidationErrors: {
            type: 'boolean',
        },
    },
} as const;
