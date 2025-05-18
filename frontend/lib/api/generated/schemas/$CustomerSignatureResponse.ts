/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $CustomerSignatureResponse = {
    properties: {
        createdAt: {
            type: 'string',
            format: 'date-time',
        },
        id: {
            type: 'string',
            format: 'uuid',
        },
        orderId: {
            type: 'string',
            format: 'uuid',
        },
        signatureData: {
            type: 'string',
        },
        signatureType: {
            type: 'string',
        },
        termsAccepted: {
            type: 'boolean',
        },
        updatedAt: {
            type: 'string',
            format: 'date-time',
        },
    },
} as const;
