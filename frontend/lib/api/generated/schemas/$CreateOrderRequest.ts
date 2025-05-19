/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $CreateOrderRequest = {
    description: `Дані для чернетки замовлення`,
    properties: {
        tagNumber: {
            type: 'string',
        },
        clientId: {
            type: 'string',
            isRequired: true,
            format: 'uuid',
        },
        items: {
            type: 'array',
            contains: {
                type: 'OrderItemDTO',
            },
        },
        discountAmount: {
            type: 'number',
        },
        prepaymentAmount: {
            type: 'number',
        },
        branchLocationId: {
            type: 'string',
            isRequired: true,
            format: 'uuid',
        },
        expectedCompletionDate: {
            type: 'string',
            format: 'date-time',
        },
        customerNotes: {
            type: 'string',
            maxLength: 1000,
        },
        internalNotes: {
            type: 'string',
            maxLength: 1000,
        },
        expediteType: {
            type: 'Enum',
        },
        draft: {
            type: 'boolean',
        },
    },
} as const;
