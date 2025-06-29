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
            isRequired: true,
            minLength: 1,
        },
        termsAccepted: {
            type: 'boolean',
            isRequired: true,
        },
        signatureType: {
            type: 'string',
        },
    },
} as const;
