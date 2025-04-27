/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $OrderDTO = {
    properties: {
        balanceAmount: {
            type: 'number',
        },
        branchLocation: {
            type: 'BranchLocationDTO',
            isRequired: true,
        },
        client: {
            type: 'ClientResponse',
            isRequired: true,
        },
        completedDate: {
            type: 'string',
            format: 'date-time',
        },
        createdDate: {
            type: 'string',
            format: 'date-time',
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
        express: {
            type: 'boolean',
        },
        finalAmount: {
            type: 'number',
        },
        id: {
            type: 'string',
            format: 'uuid',
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
        receiptNumber: {
            type: 'string',
            minLength: 1,
        },
        status: {
            type: 'Enum',
            isRequired: true,
        },
        tagNumber: {
            type: 'string',
        },
        totalAmount: {
            type: 'number',
        },
        updatedDate: {
            type: 'string',
            format: 'date-time',
        },
    },
} as const;
