/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $PaymentCalculationRequest = {
    properties: {
        orderId: {
            type: 'string',
            isRequired: true,
            format: 'uuid',
        },
        paymentMethod: {
            type: 'Enum',
            isRequired: true,
        },
        prepaymentAmount: {
            type: 'number',
        },
    },
} as const;
