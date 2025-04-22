/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $OrderDto = {
    properties: {
        amountDue: {
            type: 'number',
        },
        amountPaid: {
            type: 'number',
        },
        basePrice: {
            type: 'number',
        },
        client: {
            type: 'ClientDTO',
        },
        clientRequirements: {
            type: 'string',
        },
        clientSignature: {
            type: 'string',
        },
        createdAt: {
            type: 'string',
            format: 'date-time',
        },
        customDiscountPercentage: {
            type: 'number',
            format: 'int32',
        },
        discountType: {
            type: 'Enum',
        },
        expectedCompletionDate: {
            type: 'string',
            format: 'date',
        },
        id: {
            type: 'string',
            format: 'uuid',
        },
        items: {
            type: 'array',
            contains: {
                type: 'OrderItemDto',
            },
        },
        notes: {
            type: 'string',
        },
        paymentMethod: {
            type: 'Enum',
        },
        receiptNumber: {
            type: 'string',
        },
        receptionPoint: {
            type: 'string',
        },
        status: {
            type: 'Enum',
        },
        totalPrice: {
            type: 'number',
        },
        uniqueTag: {
            type: 'string',
        },
        urgencyType: {
            type: 'Enum',
        },
    },
} as const;
