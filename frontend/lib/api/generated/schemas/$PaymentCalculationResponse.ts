/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $PaymentCalculationResponse = {
    properties: {
        balanceAmount: {
            type: 'number',
        },
        discountAmount: {
            type: 'number',
        },
        finalAmount: {
            type: 'number',
        },
        orderId: {
            type: 'string',
            format: 'uuid',
        },
        paymentMethod: {
            type: 'Enum',
        },
        prepaymentAmount: {
            type: 'number',
        },
        totalAmount: {
            type: 'number',
        },
    },
} as const;
