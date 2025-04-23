/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $OrderDraftDto = {
    properties: {
        clientId: {
            type: 'string',
            format: 'uuid',
        },
        clientName: {
            type: 'string',
        },
        convertedToOrder: {
            type: 'boolean',
        },
        createdAt: {
            type: 'string',
            format: 'date-time',
        },
        createdBy: {
            type: 'string',
        },
        draftData: {
            type: 'string',
        },
        draftName: {
            type: 'string',
        },
        id: {
            type: 'string',
            format: 'uuid',
        },
        orderId: {
            type: 'string',
            format: 'uuid',
        },
        updatedAt: {
            type: 'string',
            format: 'date-time',
        },
    },
} as const;
