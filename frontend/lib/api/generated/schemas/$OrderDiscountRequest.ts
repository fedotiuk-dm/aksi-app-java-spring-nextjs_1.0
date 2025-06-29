/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $OrderDiscountRequest = {
    properties: {
        orderId: {
            type: 'string',
            isRequired: true,
            format: 'uuid',
        },
        discountType: {
            type: 'Enum',
            isRequired: true,
        },
        discountPercentage: {
            type: 'number',
            format: 'int32',
            maximum: 100,
        },
        discountDescription: {
            type: 'string',
            maxLength: 255,
        },
    },
} as const;
