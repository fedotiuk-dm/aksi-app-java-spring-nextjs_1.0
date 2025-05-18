/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $CustomerSignatureRequest = {
    description: `Дані підпису клієнта`,
    properties: {
        orderId: {
            type: 'string',
            isRequired: true,
            format: 'uuid',
        },
        signatureData: {
            type: 'string',
            minLength: 1,
        },
        signatureType: {
            type: 'string',
        },
        termsAccepted: {
            type: 'boolean',
            isRequired: true,
        },
    },
} as const;
