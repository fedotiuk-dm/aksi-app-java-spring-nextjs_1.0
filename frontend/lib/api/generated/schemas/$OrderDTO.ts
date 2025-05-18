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
        branchLocationId: {
            type: 'string',
            format: 'uuid',
        },
        client: {
            type: 'ClientResponse',
            isRequired: true,
        },
        clientId: {
            type: 'string',
            format: 'uuid',
        },
        completedDate: {
            type: 'string',
            format: 'date-time',
        },
        completionComments: {
            type: 'string',
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
        emailed: {
            type: 'boolean',
        },
        expectedCompletionDate: {
            type: 'string',
            format: 'date-time',
        },
        expediteType: {
            type: 'Enum',
        },
        express: {
            type: 'boolean',
        },
        finalAmount: {
            type: 'number',
        },
        finalizedAt: {
            type: 'string',
            format: 'date-time',
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
        printed: {
            type: 'boolean',
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
        termsAccepted: {
            type: 'boolean',
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
