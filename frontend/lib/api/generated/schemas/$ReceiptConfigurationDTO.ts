/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ReceiptConfigurationDTO = {
    properties: {
        sessionId: {
            type: 'string',
            format: 'uuid',
        },
        currentState: {
            type: 'Enum',
        },
        generationRequest: {
            type: 'ReceiptGenerationRequest',
        },
        generatedReceipt: {
            type: 'ReceiptDTO',
        },
        pdfGenerated: {
            type: 'boolean',
        },
        emailSent: {
            type: 'boolean',
        },
        readyForPrint: {
            type: 'boolean',
        },
        pdfFilePath: {
            type: 'string',
        },
        generationTimestamp: {
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
