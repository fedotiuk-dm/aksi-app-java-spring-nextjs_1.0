/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $PdfReceiptResponse = {
    properties: {
        orderId: {
            type: 'string',
            format: 'uuid',
        },
        pdfUrl: {
            type: 'string',
        },
        pdfData: {
            type: 'string',
        },
        generatedAt: {
            type: 'string',
            format: 'date-time',
        },
        format: {
            type: 'string',
        },
        includeSignature: {
            type: 'boolean',
        },
        fileSize: {
            type: 'number',
            format: 'int64',
        },
        fileName: {
            type: 'string',
        },
    },
} as const;
