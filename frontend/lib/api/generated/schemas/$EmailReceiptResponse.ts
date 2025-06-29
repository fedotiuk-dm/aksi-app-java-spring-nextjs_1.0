/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $EmailReceiptResponse = {
    properties: {
        orderId: {
            type: 'string',
            format: 'uuid',
        },
        recipientEmail: {
            type: 'string',
        },
        sentAt: {
            type: 'string',
            format: 'date-time',
        },
        messageId: {
            type: 'string',
        },
        status: {
            type: 'Enum',
        },
        subject: {
            type: 'string',
        },
        message: {
            type: 'string',
        },
    },
} as const;
