/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $EmailReceiptRequest = {
    description: `Параметри відправки квитанції`,
    properties: {
        orderId: {
            type: 'string',
            isRequired: true,
            format: 'uuid',
        },
        recipientEmail: {
            type: 'string',
            isRequired: true,
            minLength: 1,
        },
        subject: {
            type: 'string',
        },
        message: {
            type: 'string',
        },
        includeSignature: {
            type: 'boolean',
        },
    },
} as const;
