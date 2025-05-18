/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $EmailReceiptRequest = {
    description: `Параметри відправки квитанції`,
    properties: {
        includeSignature: {
            type: 'boolean',
        },
        message: {
            type: 'string',
        },
        orderId: {
            type: 'string',
            isRequired: true,
            format: 'uuid',
        },
        recipientEmail: {
            type: 'string',
            minLength: 1,
        },
        subject: {
            type: 'string',
        },
    },
} as const;
