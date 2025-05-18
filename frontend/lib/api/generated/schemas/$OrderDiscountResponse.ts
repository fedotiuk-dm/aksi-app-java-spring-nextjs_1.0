/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $OrderDiscountResponse = {
    properties: {
        discountAmount: {
            type: 'number',
        },
        discountDescription: {
            type: 'string',
        },
        discountPercentage: {
            type: 'number',
            format: 'int32',
        },
        discountType: {
            type: 'Enum',
        },
        finalAmount: {
            type: 'number',
        },
        nonDiscountableAmount: {
            type: 'number',
        },
        nonDiscountableCategories: {
            type: 'array',
            contains: {
                type: 'string',
            },
        },
        orderId: {
            type: 'string',
            format: 'uuid',
        },
        totalAmount: {
            type: 'number',
        },
    },
} as const;
