/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ReceiptGenerationRequest = {
    description: `Параметри генерації квитанції`,
    properties: {
        orderId: {
            type: 'string',
            isRequired: true,
            format: 'uuid',
        },
        format: {
            type: 'string',
        },
        includeSignature: {
            type: 'boolean',
        },
    },
} as const;
