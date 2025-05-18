/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $CreateOrderRequest = {
    description: `Дані для чернетки замовлення`,
    properties: {
        branchLocationId: {
            type: 'string',
            isRequired: true,
            format: 'uuid',
        },
        clientId: {
            type: 'string',
            isRequired: true,
            format: 'uuid',
        },
        customerNotes: {
            type: 'string',
            maxLength: 1000,
        },
        discountAmount: {
            type: 'number',
        },
        draft: {
            type: 'boolean',
        },
        expectedCompletionDate: {
            type: 'string',
            format: 'date-time',
        },
        expediteType: {
            type: 'Enum',
        },
        internalNotes: {
            type: 'string',
            maxLength: 1000,
        },
        items: {
            type: 'array',
            contains: {
                type: 'OrderItemDTO',
            },
        },
        prepaymentAmount: {
            type: 'number',
        },
        tagNumber: {
            type: 'string',
        },
    },
} as const;
