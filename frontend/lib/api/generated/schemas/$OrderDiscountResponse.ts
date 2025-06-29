/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $OrderDiscountResponse = {
    properties: {
        orderId: {
            type: 'string',
            format: 'uuid',
        },
        discountType: {
            type: 'Enum',
        },
        discountPercentage: {
            type: 'number',
            format: 'int32',
        },
        discountDescription: {
            type: 'string',
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
        nonDiscountableCategories: {
            type: 'array',
            contains: {
                type: 'string',
            },
        },
        nonDiscountableAmount: {
            type: 'number',
        },
    },
} as const;
