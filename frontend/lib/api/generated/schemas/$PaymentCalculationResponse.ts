/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $PaymentCalculationResponse = {
    properties: {
        orderId: {
            type: 'string',
            format: 'uuid',
        },
        paymentMethod: {
            type: 'Enum',
        },
        totalAmount: {
            type: 'number',
        },
        discountAmount: {
            type: 'number',
        },
        finalAmount: {
            type: 'number',
        },
        prepaymentAmount: {
            type: 'number',
        },
        balanceAmount: {
            type: 'number',
        },
    },
} as const;
