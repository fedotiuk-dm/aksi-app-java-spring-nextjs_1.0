/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ReceiptGenerationRequest = {
    description: `Параметри генерації квитанції`,
    properties: {
        format: {
            type: 'string',
        },
        includeSignature: {
            type: 'boolean',
        },
        orderId: {
            type: 'string',
            isRequired: true,
            format: 'uuid',
        },
    },
} as const;
