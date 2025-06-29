/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $OrderSummaryDTO = {
    properties: {
        id: {
            type: 'string',
            format: 'uuid',
        },
        receiptNumber: {
            type: 'string',
        },
        status: {
            type: 'Enum',
        },
        totalAmount: {
            type: 'number',
        },
        createdAt: {
            type: 'string',
            format: 'date-time',
        },
        completionDate: {
            type: 'string',
            format: 'date-time',
        },
        itemCount: {
            type: 'number',
            format: 'int32',
        },
    },
} as const;
