/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $OrderFinalizationRequest = {
    properties: {
        comments: {
            type: 'string',
        },
        generatePrintableReceipt: {
            type: 'boolean',
        },
        orderId: {
            type: 'string',
            isRequired: true,
            format: 'uuid',
        },
        sendReceiptByEmail: {
            type: 'boolean',
        },
        signatureData: {
            type: 'string',
        },
        termsAccepted: {
            type: 'boolean',
        },
    },
} as const;
