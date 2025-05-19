/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $OrderCompletionUpdateRequest = {
    properties: {
        orderId: {
            type: 'string',
            isRequired: true,
            format: 'uuid',
        },
        expediteType: {
            type: 'Enum',
            isRequired: true,
        },
        expectedCompletionDate: {
            type: 'string',
            isRequired: true,
            format: 'date-time',
        },
    },
} as const;
