/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $OrderDiscountRequest = {
    properties: {
        discountDescription: {
            type: 'string',
            maxLength: 255,
        },
        discountPercentage: {
            type: 'number',
            format: 'int32',
            maximum: 100,
        },
        discountType: {
            type: 'Enum',
            isRequired: true,
        },
        orderId: {
            type: 'string',
            isRequired: true,
            format: 'uuid',
        },
    },
} as const;
