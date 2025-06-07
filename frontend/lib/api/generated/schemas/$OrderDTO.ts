/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $OrderDTO = {
    properties: {
        id: {
            type: 'string',
            format: 'uuid',
        },
        receiptNumber: {
            type: 'string',
            isRequired: true,
            minLength: 1,
        },
        tagNumber: {
            type: 'string',
        },
        client: {
            type: 'ClientResponse',
            isRequired: true,
        },
        clientId: {
            type: 'string',
            format: 'uuid',
        },
        items: {
            type: 'array',
            contains: {
                type: 'OrderItemDTO',
            },
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
        prepaymentAmount: {
            type: 'number',
        },
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
        status: {
            type: 'Enum',
            isRequired: true,
        },
        createdDate: {
            type: 'string',
            format: 'date-time',
        },
        updatedDate: {
            type: 'string',
            format: 'date-time',
        },
        expectedCompletionDate: {
            type: 'string',
            format: 'date-time',
        },
        completedDate: {
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
        completionComments: {
            type: 'string',
        },
        termsAccepted: {
            type: 'boolean',
        },
        finalizedAt: {
            type: 'string',
            format: 'date-time',
        },
        express: {
            type: 'boolean',
        },
        draft: {
            type: 'boolean',
        },
        emailed: {
            type: 'boolean',
        },
        printed: {
            type: 'boolean',
        },
    },
} as const;
