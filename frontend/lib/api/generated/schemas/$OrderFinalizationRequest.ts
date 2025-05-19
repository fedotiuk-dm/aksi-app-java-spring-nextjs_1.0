/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $OrderFinalizationRequest = {
    properties: {
        orderId: {
            type: 'string',
            isRequired: true,
            format: 'uuid',
        },
        signatureData: {
            type: 'string',
        },
        termsAccepted: {
            type: 'boolean',
        },
        sendReceiptByEmail: {
            type: 'boolean',
        },
        generatePrintableReceipt: {
            type: 'boolean',
        },
        comments: {
            type: 'string',
        },
    },
} as const;
